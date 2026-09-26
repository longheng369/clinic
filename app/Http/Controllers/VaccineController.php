<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVaccineRequest;
use App\Http\Requests\UpdateVaccineRequest;
use App\Models\Unit;
use App\Models\Vaccine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VaccineController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        return Inertia::render('vaccines/index', [
            'vaccines' => Vaccine::latest()
                ->with('ageRules')
                ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
                ->paginate(10)
                ->withQueryString(),
            'search' => $search,
            'units' => Unit::orderBy('name')->get(),
        ]);
    }

    public function store(StoreVaccineRequest $request)
    {
        DB::transaction(function () use ($request) {
            $vaccine = Vaccine::create([
                'name' => $request->name,
                'description' => $request->description,
                'created_by' => auth()->id(),
            ]);

            foreach ($request->age_rules as $ageRule) {
                $vaccine->ageRules()->create([
                    'min_age' => $ageRule['min_age'],
                    'min_age_unit' => $ageRule['min_age_unit'],
                    'max_age' => $ageRule['max_age'] ?? null,
                    'max_age_unit' => $ageRule['max_age_unit'],
                    'dose_rules' => $ageRule['dose_rules'],
                ]);
            }
        });

        return redirect()->route('vaccines.index')
            ->with('success', 'Vaccine created.');
    }

    public function update(UpdateVaccineRequest $request, Vaccine $vaccine)
    {
        DB::transaction(function () use ($request, $vaccine) {
            $vaccine->update([
                'name' => $request->name,
                'description' => $request->description,
            ]);

            $existingIds = collect($request->age_rules)->pluck('id')->filter();
            $vaccine->ageRules()->whereNotIn('id', $existingIds)->delete();

            foreach ($request->age_rules as $ageRule) {
                if (isset($ageRule['id'])) {
                    $vaccine->ageRules()->where('id', $ageRule['id'])->update([
                        'min_age' => $ageRule['min_age'],
                        'min_age_unit' => $ageRule['min_age_unit'],
                        'max_age' => $ageRule['max_age'] ?? null,
                        'max_age_unit' => $ageRule['max_age_unit'],
                        'dose_rules' => $ageRule['dose_rules'],
                    ]);
                } else {
                    $vaccine->ageRules()->create([
                        'min_age' => $ageRule['min_age'],
                        'min_age_unit' => $ageRule['min_age_unit'],
                        'max_age' => $ageRule['max_age'] ?? null,
                        'max_age_unit' => $ageRule['max_age_unit'],
                        'dose_rules' => $ageRule['dose_rules'],
                    ]);
                }
            }
        });

        return redirect()->route('vaccines.index')
            ->with('success', 'Vaccine updated.');
    }

    public function destroy(Vaccine $vaccine)
    {
        $vaccine->delete();

        return redirect()->route('vaccines.index')
            ->with('success', 'Vaccine deleted.');
    }
}
