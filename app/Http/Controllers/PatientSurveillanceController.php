<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\PatientSurveillance;
use App\Http\Requests\StorePatientSurveillanceRequest;
use App\Http\Requests\UpdatePatientSurveillanceRequest;

class PatientSurveillanceController extends Controller
{
    public function index(Patient $patient)
    {
        return $patient->surveillances()
            ->with('recordedBy')
            ->latest()
            ->paginate(10)
            ->through(fn ($s) => [
                'id' => $s->id,
                'systolic' => $s->systolic,
                'diastolic' => $s->diastolic,
                'pulse' => $s->pulse,
                'temperature' => (float) $s->temperature,
                'rr' => $s->rr,
                'spo2' => $s->spo2,
                'o2_supply' => $s->o2_supply,
                'recorded_by' => $s->recordedBy?->name,
                'created_at' => $s->created_at,
            ]);
    }

    public function store(StorePatientSurveillanceRequest $request, Patient $patient)
    {
        $patient->surveillances()->create(array_merge(
            $request->validated(),
            ['recorded_by' => auth()->id()]
        ));

        return back()->with('success', 'Surveillance record created.');
    }

    public function update(UpdatePatientSurveillanceRequest $request, Patient $patient, PatientSurveillance $surveillance)
    {
        $surveillance->update($request->validated());

        return back()->with('success', 'Surveillance record updated.');
    }

    public function destroy(Patient $patient, PatientSurveillance $surveillance)
    {
        $surveillance->delete();

        return back()->with('success', 'Surveillance record deleted.');
    }
}
