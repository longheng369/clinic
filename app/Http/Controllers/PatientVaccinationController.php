<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\PatientVaccination;
use App\Http\Requests\StorePatientVaccinationRequest;
use Illuminate\Http\Request;

class PatientVaccinationController extends Controller
{
    public function index(Request $request, Patient $patient)
    {
        $perPage = $request->query('per_page', 10);

        return $patient->vaccinations()
            ->with(['vaccine', 'administeredBy'])
            ->latest()
            ->paginate($perPage)
            ->through(fn ($v) => [
                'id' => $v->id,
                'vaccine' => $v->vaccine ? ['id' => $v->vaccine->id, 'name' => $v->vaccine->name] : null,
                'dose_number' => $v->dose_number,
                'administered_date' => $v->administered_date,
                'notes' => $v->notes,
                'administered_by' => $v->administeredBy?->name,
                'created_at' => $v->created_at,
            ]);
    }

    public function store(StorePatientVaccinationRequest $request, Patient $patient)
    {
        $patient->vaccinations()->create(array_merge(
            $request->validated(),
            ['administered_by' => auth()->id()]
        ));

        return back()->with('success', 'Vaccination recorded.');
    }

    public function destroy(Patient $patient, PatientVaccination $vaccination)
    {
        $vaccination->delete();

        return back()->with('success', 'Vaccination record deleted.');
    }
}
