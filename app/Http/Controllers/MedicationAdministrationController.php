<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMedicationAdministrationRequest;
use App\Models\MedicationAdministration;
use App\Models\MedicationAudit;
use App\Models\Patient;
use App\Models\Visit;
use Carbon\Carbon;

class MedicationAdministrationController extends Controller
{
    public function store(StoreMedicationAdministrationRequest $request)
    {
        $visit = Visit::findOrFail($request->visit_id);

        $startsAt = $request->starts_at ? Carbon::parse($request->starts_at) : now();

        $medication = $visit->medicationAdministrations()->create(array_merge(
            $request->validated(),
            [
                'status' => 'active',
                'cycle_no' => 1,
                'starts_at' => $startsAt,
                'created_by' => auth()->id(),
            ]
        ));

        MedicationAudit::log(auth()->user(), 'created', $medication, null, $medication->toArray());

        if ($request->interval !== 'PRN') {
            $medication->generateNextDose();
        }

        return back()->with('success', 'Medication order created.');
    }

    public function update(StoreMedicationAdministrationRequest $request, Patient $patient, MedicationAdministration $medicationAdministration)
    {
        abort_if($medicationAdministration->status === 'stopped', 403, 'Cannot edit a stopped medication.');
        abort_if($medicationAdministration->hasAdministrationActivity(), 403,
            'Cannot edit an order with administration history. Stop and create a new order instead.');

        $oldValues = $medicationAdministration->toArray();

        $startsAt = $request->starts_at ? Carbon::parse($request->starts_at) : $medicationAdministration->starts_at;

        $medicationAdministration->update(array_merge(
            $request->validated(),
            ['starts_at' => $startsAt]
        ));

        MedicationAudit::log(auth()->user(), 'updated', $medicationAdministration, $oldValues, $medicationAdministration->fresh()->toArray());

        $medicationAdministration->doses()
            ->where('status', 'pending')
            ->delete();

        if ($request->interval !== 'PRN') {
            $medicationAdministration->generateNextDose();
        }

        return back()->with('success', 'Medication order updated.');
    }

    public function continue(Visit $visit, MedicationAdministration $medicationAdministration)
    {
        abort_if($medicationAdministration->status !== 'completed', 403, 'Only completed orders can be continued.');

        $newCycleNo = $medicationAdministration->cycle_no + 1;

        $medicationAdministration->update([
            'status' => 'active',
            'cycle_no' => $newCycleNo,
            'stopped_at' => null,
        ]);

        MedicationAudit::log(auth()->user(), 'continued', $medicationAdministration, null, [
            'cycle_no' => $newCycleNo,
            'status' => 'active',
        ]);

        if ($medicationAdministration->interval !== 'PRN') {
            $medicationAdministration->generateNextDose();
        }

        return back()->with('success', 'Medication order continued.');
    }

    public function stop(Visit $visit, MedicationAdministration $medicationAdministration)
    {
        abort_if($medicationAdministration->status === 'stopped', 403, 'Already stopped.');

        $medicationAdministration->update([
            'status' => 'stopped',
            'stopped_at' => now(),
        ]);

        MedicationAudit::log(auth()->user(), 'stopped', $medicationAdministration);

        $medicationAdministration->doses()
            ->where('status', 'pending')
            ->update([
                'status' => 'cancelled',
            ]);

        return back()->with('success', 'Medication order stopped.');
    }

    public function hold(Visit $visit, MedicationAdministration $medicationAdministration)
    {
        abort_if($medicationAdministration->status !== 'active', 403, 'Only active orders can be placed on hold.');

        $medicationAdministration->update(['status' => 'on_hold']);

        MedicationAudit::log(auth()->user(), 'held', $medicationAdministration);

        return back()->with('success', 'Medication order placed on hold.');
    }

    public function resume(Visit $visit, MedicationAdministration $medicationAdministration)
    {
        abort_if($medicationAdministration->status !== 'on_hold', 403, 'Only on-hold orders can be resumed.');

        $medicationAdministration->update(['status' => 'active']);

        MedicationAudit::log(auth()->user(), 'resumed', $medicationAdministration);

        return back()->with('success', 'Medication order resumed.');
    }
}
