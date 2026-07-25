<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePrescriptionRequest;
use App\Http\Requests\UpdatePrescriptionRequest;
use App\Models\Patient;
use App\Models\Prescription;

class PrescriptionController extends Controller
{
    public function store(StorePrescriptionRequest $request, Patient $patient)
    {
        $data = $request->validated();
        $items = $data['items'];
        unset($data['items']);

        $prescription = Prescription::firstOrCreate(
            ['visit_id' => $data['visit_id']],
            ['created_by' => auth()->id()]
        );

        $prescription->items()->delete();
        $prescription->items()->createMany($items);

        return back()->with('success', 'Prescription saved.');
    }

    public function update(UpdatePrescriptionRequest $request, Patient $patient, Prescription $prescription)
    {
        $data = $request->validated();
        $items = $data['items'];
        unset($data['items']);

        $prescription->update($data);
        $prescription->items()->delete();
        $prescription->items()->createMany($items);

        return back()->with('success', 'Prescription updated.');
    }

    public function destroy(Patient $patient, Prescription $prescription)
    {
        $prescription->delete();

        return back()->with('success', 'Prescription deleted.');
    }
}