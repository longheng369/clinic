<?php

namespace App\Http\Controllers;

use App\Models\MedicationAdministration;
use App\Models\MedicationDose;
use App\Models\Visit;
use App\Http\Requests\StoreMedicationAdministrationRequest;
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
                'starts_at' => $startsAt,
                'created_by' => auth()->id(),
            ]
        ));

        if ($request->interval !== 'PRN') {
            $this->generateDoses($medication, $startsAt);
        }

        return back()->with('success', 'Added to drug chart.');
    }

    public function stop(Visit $visit, MedicationAdministration $medicationAdministration)
    {
        abort_if($medicationAdministration->status === 'stopped', 403, 'Already stopped.');

        $medicationAdministration->update([
            'status' => 'stopped',
            'stopped_at' => now(),
        ]);

        $medicationAdministration->doses()
            ->where('status', 'pending')
            ->where('scheduled_at', '>', now())
            ->update([
                'status' => 'skipped',
                'skip_reason' => 'Prescription stopped',
            ]);

        return back()->with('success', 'Medication stopped.');
    }

    private function generateDoses(MedicationAdministration $medication, Carbon $startsAt): void
    {
        $times = match ($medication->interval) {
            'QD' => ['08:00'],
            'BID' => ['08:00', '20:00'],
            'TID' => ['08:00', '14:00', '20:00'],
            'QID' => ['08:00', '12:00', '18:00', '22:00'],
            'QHS' => ['22:00'],
            default => ['08:00'],
        };

        $start = $startsAt->copy()->startOfDay();
        $horizon = 7;

        $doses = [];

        for ($day = 0; $day < $horizon; $day++) {
            foreach ($times as $time) {
                $scheduledAt = $start->copy()->addDays($day)->setTimeFromTimeString($time);

                if ($scheduledAt->lte(now())) {
                    continue;
                }

                $doses[] = [
                    'medication_administration_id' => $medication->id,
                    'scheduled_at' => $scheduledAt,
                    'status' => 'pending',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (! empty($doses)) {
            MedicationDose::insert($doses);
        }
    }
}
