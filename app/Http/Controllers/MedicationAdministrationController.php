<?php

namespace App\Http\Controllers;

use App\Models\MedicationAdministration;
use App\Models\Visit;
use App\Http\Requests\StoreMedicationAdministrationRequest;

class MedicationAdministrationController extends Controller
{
    public function store(StoreMedicationAdministrationRequest $request)
    {
        $visit = Visit::findOrFail($request->visit_id);

        $visit->medicationAdministrations()->create(array_merge(
            $request->validated(),
            ['created_by' => auth()->id()]
        ));

        return back()->with('success', 'Medication prescribed.');
    }

    public function provide(Visit $visit, MedicationAdministration $medicationAdministration)
    {
        abort_if($medicationAdministration->status === 'stopped', 403, 'Cannot provide a stopped medication.');

        $medicationAdministration->update(['status' => 'provided']);

        return back()->with('success', 'Dose administered.');
    }

    public function continue(Visit $visit, MedicationAdministration $medicationAdministration)
    {
        abort_if($medicationAdministration->status !== 'provided', 403, 'Can only continue a provided medication.');

        $medicationAdministration->update(['status' => 'continued']);

        return back()->with('success', 'Medication continued.');
    }

    public function stop(Visit $visit, MedicationAdministration $medicationAdministration)
    {
        abort_if($medicationAdministration->status === 'stopped', 403, 'Already stopped.');

        $medicationAdministration->update(['status' => 'stopped']);

        return back()->with('success', 'Medication stopped.');
    }
}
