<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePrescriptionRequest;
use App\Http\Requests\UpdatePrescriptionRequest;
use App\Models\Medicine;
use App\Models\Patient;
use App\Models\Prescription;

class PrescriptionController extends Controller
{
    public function store(StorePrescriptionRequest $request)
    {
        $validated = $request->validated();
        $items = $validated['items'];

        // Fill unit from medicine if not provided
        foreach ($items as &$item) {
            if (empty($item['unit_id']) && isset($item['medicine_id'])) {
                $medicine = Medicine::find($item['medicine_id']);
                if ($medicine && $medicine->unit_id) {
                    $item['unit_id'] = $medicine->unit_id;
                }
            }

            $item = $this->normalizeDoseSlots($item);
        }

        $prescription = Prescription::create($validated);

        $prescription->items()->createMany($items);

        return back()->with('success', 'Prescription saved.');
    }

    public function update(UpdatePrescriptionRequest $request, Patient $patient, Prescription $prescription)
    {
        $validated = $request->validated();
        $items = $validated['items'];

        // Fill unit from medicine if not provided
        foreach ($items as &$item) {
            if (empty($item['unit_id']) && isset($item['medicine_id'])) {
                $medicine = Medicine::find($item['medicine_id']);
                if ($medicine && $medicine->unit_id) {
                    $item['unit_id'] = $medicine->unit_id;
                }
            }

            $item = $this->normalizeDoseSlots($item);
        }

        $prescription->update($validated);
        $prescription->items()->delete();
        $prescription->items()->createMany($items);

        return back()->with('success', 'Prescription updated.');
    }

    private function normalizeDoseSlots(array $item): array
    {
        $slots = ['morning', 'afternoon', 'evening', 'night'];

        foreach ($slots as $slot) {
            $item[$slot] = isset($item[$slot]) && $item[$slot] !== ''
                ? (float) $item[$slot]
                : null;
        }

        return $item;
    }
}
