<?php

namespace App\Http\Controllers;

use App\Models\MedicationAudit;
use App\Models\MedicationDose;
use App\Models\Visit;
use App\Http\Requests\MissedDoseRequest;
use App\Http\Requests\RefusedDoseRequest;
use Illuminate\Http\Request;

class MedicationDoseController extends Controller
{
    public function administer(Visit $visit, MedicationDose $dose)
    {
        abort_unless($dose->medicationAdministration->visit_id === $visit->id, 404);

        $order = $dose->medicationAdministration;

        abort_if($order->status !== 'active', 403, 'Cannot administer doses while order is not active.');

        if ($dose->status !== 'pending') {
            if ($dose->status === 'provided') {
                $msg = 'Dose already provided by ' . ($dose->administeredBy?->name ?? 'unknown')
                    . ' at ' . $dose->administered_at->format('H:i');
            } else {
                $msg = 'Dose already handled (status: ' . $dose->status . ').';
            }
            abort(409, $msg);
        }

        $medicine = $order->medicine;

        $dose->update([
            'status' => 'provided',
            'administered_at' => now(),
            'administered_by' => auth()->id(),
            'unit_price' => $medicine?->unit_price,
        ]);

        MedicationAudit::log(auth()->user(), 'dose_provided', $dose);

        if ($order->interval !== 'PRN') {
            $nextDose = $order->generateNextDose();

            if ($nextDose === null) {
                $order->update(['status' => 'completed']);
                MedicationAudit::log(auth()->user(), 'completed', $order);
            }
        }

        return back()->with('success', 'Dose provided.');
    }

    public function missed(Visit $visit, MedicationDose $dose, MissedDoseRequest $request)
    {
        abort_unless($dose->medicationAdministration->visit_id === $visit->id, 404);

        $order = $dose->medicationAdministration;

        abort_if($order->status !== 'active', 403, 'Cannot record missed dose while order is not active.');
        abort_if($dose->status !== 'pending', 409, 'Dose already handled.');

        $dose->update([
            'status' => 'missed',
            'reason' => $request->reason,
            'note' => $request->note,
        ]);

        MedicationAudit::log(auth()->user(), 'dose_missed', $dose);

        if ($order->interval !== 'PRN' && $order->status === 'active') {
            $nextDose = $order->generateNextDose();

            if ($nextDose === null) {
                $order->update(['status' => 'completed']);
                MedicationAudit::log(auth()->user(), 'completed', $order);
            }
        }

        return back()->with('success', 'Dose recorded as missed.');
    }

    public function refused(Visit $visit, MedicationDose $dose, RefusedDoseRequest $request)
    {
        abort_unless($dose->medicationAdministration->visit_id === $visit->id, 404);

        $order = $dose->medicationAdministration;

        abort_if($order->status !== 'active', 403, 'Cannot record refused dose while order is not active.');
        abort_if($dose->status !== 'pending', 409, 'Dose already handled.');

        $dose->update([
            'status' => 'refused',
            'reason' => $request->reason,
            'note' => $request->note,
        ]);

        MedicationAudit::log(auth()->user(), 'dose_refused', $dose);

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
