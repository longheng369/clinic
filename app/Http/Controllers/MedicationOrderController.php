<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMedicationOrderRequest;
use App\Models\MedicationAudit;
use App\Models\MedicationOrder;
use App\Models\Patient;
use App\Models\Visit;
use Carbon\Carbon;

class MedicationOrderController extends Controller
{
    public function store(StoreMedicationOrderRequest $request)
    {
        $visit = Visit::findOrFail($request->visit_id);

        $startsAt = $request->starts_at ? Carbon::parse($request->starts_at) : now();

        $order = $visit->medicationOrders()->create(array_merge(
            $request->validated(),
            [
                'status' => 'active',
                'cycle_no' => 1,
                'starts_at' => $startsAt,
                'created_by' => auth()->id(),
            ]
        ));

        MedicationAudit::log(auth()->user(), 'created', $order, null, $order->toArray());

        if ($request->interval !== 'PRN') {
            $order->generateNextDose();
        }

        return back()->with('success', 'Medication order created.');
    }

    public function update(StoreMedicationOrderRequest $request, Patient $patient, MedicationOrder $medicationOrder)
    {
        abort_if($medicationOrder->status === 'stopped', 403, 'Cannot edit a stopped medication.');
        abort_if($medicationOrder->hasAdministrationActivity(), 403,
            'Cannot edit an order with administration history. Stop and create a new order instead.');

        $oldValues = $medicationOrder->toArray();

        $startsAt = $request->starts_at ? Carbon::parse($request->starts_at) : $medicationOrder->starts_at;

        $medicationOrder->update(array_merge(
            $request->validated(),
            ['starts_at' => $startsAt]
        ));

        MedicationAudit::log(auth()->user(), 'updated', $medicationOrder, $oldValues, $medicationOrder->fresh()->toArray());

        $medicationOrder->administrations()
            ->where('status', 'pending')
            ->delete();

        if ($request->interval !== 'PRN') {
            $medicationOrder->generateNextDose();
        }

        return back()->with('success', 'Medication order updated.');
    }

    public function continue(Visit $visit, MedicationOrder $medicationOrder)
    {
        abort_if($medicationOrder->status !== 'completed', 403, 'Only completed orders can be continued.');

        $newCycleNo = $medicationOrder->cycle_no + 1;

        $medicationOrder->update([
            'status' => 'active',
            'cycle_no' => $newCycleNo,
            'stopped_at' => null,
        ]);

        MedicationAudit::log(auth()->user(), 'continued', $medicationOrder, null, [
            'cycle_no' => $newCycleNo,
            'status' => 'active',
        ]);

        if ($medicationOrder->interval !== 'PRN') {
            $medicationOrder->generateNextDose();
        }

        return back()->with('success', 'Medication order continued.');
    }

    public function stop(Visit $visit, MedicationOrder $medicationOrder)
    {
        abort_if($medicationOrder->status === 'stopped', 403, 'Already stopped.');

        $medicationOrder->update([
            'status' => 'stopped',
            'stopped_at' => now(),
        ]);

        MedicationAudit::log(auth()->user(), 'stopped', $medicationOrder);

        $medicationOrder->administrations()
            ->where('status', 'pending')
            ->update([
                'status' => 'cancelled',
            ]);

        return back()->with('success', 'Medication order stopped.');
    }

    public function hold(Visit $visit, MedicationOrder $medicationOrder)
    {
        abort_if($medicationOrder->status !== 'active', 403, 'Only active orders can be placed on hold.');

        $medicationOrder->update(['status' => 'on_hold']);

        MedicationAudit::log(auth()->user(), 'held', $medicationOrder);

        return back()->with('success', 'Medication order placed on hold.');
    }

    public function resume(Visit $visit, MedicationOrder $medicationOrder)
    {
        abort_if($medicationOrder->status !== 'on_hold', 403, 'Only on-hold orders can be resumed.');

        $medicationOrder->update(['status' => 'active']);

        MedicationAudit::log(auth()->user(), 'resumed', $medicationOrder);

        return back()->with('success', 'Medication order resumed.');
    }
}
