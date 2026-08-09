<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePrescriptionRequest;
use App\Http\Requests\UpdatePrescriptionRequest;
use App\Models\Patient;
use App\Models\Prescription;

class PrescriptionController extends Controller
{
    public function store(StorePrescriptionRequest $request)
    {
        $validated = $request->validated();
        $items = $validated['items'];

        $prescription = Prescription::create($validated);

        $prescription->items()->createMany($items);

        return back()->with('success', 'Prescription saved.');
    }

    public function update(UpdatePrescriptionRequest $request, Patient $patient, Prescription $prescription)
    {
        $validated = $request->validated();
        $items = $validated['items'];

        $prescription->update($validated);
        $prescription->items()->delete();
        $prescription->items()->createMany($items);

        return back()->with('success', 'Prescription updated.');
    }
}
