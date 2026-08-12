<?php

namespace App\Http\Controllers;

use App\Http\Requests\MissedDoseRequest;
use App\Http\Requests\RefusedDoseRequest;
use App\Models\MedicationAdministration;
use App\Models\MedicationAudit;
use App\Models\Visit;

class MedicationAdministrationController extends Controller
{
    public function administer(Visit $visit, MedicationAdministration $medicationAdministration)
    {
        abort_unless($medicationAdministration->medicationOrder->visit_id === $visit->id, 404);

        $order = $medicationAdministration->medicationOrder;

        abort_if($order->status !== 'active', 403, 'Cannot administer doses while order is not active.');

        if ($medicationAdministration->status !== 'pending') {
            if ($medicationAdministration->status === 'provided') {
                $msg = 'Dose already provided by '.($medicationAdministration->administeredBy?->name ?? 'unknown')
                    .' at '.$medicationAdministration->administered_at->format('H:i');
            } else {
                $msg = 'Dose already handled (status: '.$medicationAdministration->status.').';
            }
            abort(409, $msg);
        }

        $medicine = $order->medicine;

        $medicationAdministration->update([
            'status' => 'provided',
            'administered_at' => now(),
            'administered_by' => auth()->id(),
            'unit_price' => $medicine?->unit_price,
        ]);

        MedicationAudit::log(auth()->user(), 'dose_provided', $medicationAdministration);

        if ($order->interval !== 'PRN') {
            $nextDose = $order->generateNextDose();

            if ($nextDose === null) {
                $order->update(['status' => 'completed']);
                MedicationAudit::log(auth()->user(), 'completed', $order);
            }
        }

        return back()->with('success', 'Dose provided.');
    }

    public function missed(Visit $visit, MedicationAdministration $medicationAdministration, MissedDoseRequest $request)
    {
        abort_unless($medicationAdministration->medicationOrder->visit_id === $visit->id, 404);

        $order = $medicationAdministration->medicationOrder;

        abort_if($order->status !== 'active', 403, 'Cannot record missed dose while order is not active.');
        abort_if($medicationAdministration->status !== 'pending', 409, 'Dose already handled.');

        $medicationAdministration->update([
            'status' => 'missed',
            'reason' => $request->reason,
            'note' => $request->note,
        ]);

        MedicationAudit::log(auth()->user(), 'dose_missed', $medicationAdministration);

        if ($order->interval !== 'PRN' && $order->status === 'active') {
            $nextDose = $order->generateNextDose();

            if ($nextDose === null) {
                $order->update(['status' => 'completed']);
                MedicationAudit::log(auth()->user(), 'completed', $order);
            }
        }

        return back()->with('success', 'Dose recorded as missed.');
    }

    public function refused(Visit $visit, MedicationAdministration $medicationAdministration, RefusedDoseRequest $request)
    {
        abort_unless($medicationAdministration->medicationOrder->visit_id === $visit->id, 404);

        $order = $medicationAdministration->medicationOrder;

        abort_if($order->status !== 'active', 403, 'Cannot record refused dose while order is not active.');
        abort_if($medicationAdministration->status !== 'pending', 409, 'Dose already handled.');

        $medicationAdministration->update([
            'status' => 'refused',
            'reason' => $request->reason,
            'note' => $request->note,
        ]);

        MedicationAudit::log(auth()->user(), 'dose_refused', $medicationAdministration);

        if ($order->interval !== 'PRN' && $order->status === 'active') {
            $nextDose = $order->generateNextDose();

            if ($nextDose === null) {
                $order->update(['status' => 'completed']);
                MedicationAudit::log(auth()->user(), 'completed', $order);
            }
        }

        return back()->with('success', 'Dose recorded as refused.');
    }
}
