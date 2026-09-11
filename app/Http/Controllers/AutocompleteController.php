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

        $query = $class::query();

        if ($q !== '' && !empty($columns)) {
            $query->where(function ($query) use ($columns, $q) {
                foreach ($columns as $column) {
                    $query->orWhere($column, 'like', "%{$q}%");
                }
            });
        }

        $results = $query->limit(25)->get()->map(fn ($record) => [
            'value' => $record->id,
            'label' => $record->autocompleteLabel(),
        ]);

        return response()->json($results);
    }
}
