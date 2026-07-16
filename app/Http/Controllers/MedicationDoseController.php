<?php

namespace App\Http\Controllers;

use App\Models\MedicationDose;
use App\Models\Visit;
use Illuminate\Http\Request;

class MedicationDoseController extends Controller
{
    public function administer(Visit $visit, MedicationDose $dose)
    {
        abort_unless($dose->medicationAdministration->visit_id === $visit->id, 404);
        abort_if($dose->status !== 'pending', 409, 'Dose already handled.');

        $dose->update([
            'status' => 'administered',
            'administered_at' => now(),
            'administered_by' => auth()->id(),
            'unit_price' => $dose->medicationAdministration->medicine?->unit_price,
        ]);

        return back()->with('success', 'Dose administered.');
    }

    public function skip(Visit $visit, MedicationDose $dose, Request $request)
    {
        abort_unless($dose->medicationAdministration->visit_id === $visit->id, 404);
        abort_if($dose->status !== 'pending', 409, 'Dose already handled.');

        $dose->update([
            'status' => 'skipped',
            'skip_reason' => $request->input('reason', 'Skipped'),
        ]);

        return back()->with('success', 'Dose skipped.');
    }
}
