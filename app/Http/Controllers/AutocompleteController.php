<?php

namespace App\Http\Controllers;

use App\Traits\Autocompletable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AutocompleteController extends Controller
{
    public function __invoke(Request $request, string $model): JsonResponse
    {
        $class = 'App\\Models\\' . Str::studly(Str::singular($model));

        if (!class_exists($class) || !in_array(Autocompletable::class, class_uses_recursive($class))) {
            abort(404);
        }

        $q = trim((string) $request->query('search', ''));
        $columns = $class::autocompleteSearchable();

        $ids = array_slice(
            array_filter(
                array_map('trim', explode(',', (string) $request->query('ids', ''))),
                fn ($id) => $id !== ''
            ),
            0,
            25
        );

        $query = $class::query();

        // Resolving known keys (edit form pre-fill) ignores the search term.
        if (!empty($ids)) {
            $query->whereKey($ids);
        } elseif ($q !== '' && !empty($columns)) {
            $query->where(function ($query) use ($columns, $q) {
                foreach ($columns as $column) {
                    $query->orWhere($column, 'like', "%{$q}%");
                }
            });
        }

        $extraColumns = $class::autocompleteExtra();

        $results = $query->limit(empty($ids) ? 25 : count($ids))->get()->map(function ($record) use ($extraColumns) {
            $result = [
                'value' => $record->id,
                'label' => $record->autocompleteLabel(),
            ];
            foreach ($extraColumns as $column) {
                $result[$column] = $record->{$column};
            }
            return $result;
        });

        return response()->json($results);
    }
}
