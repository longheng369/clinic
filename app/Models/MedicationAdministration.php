<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'visit_id',
    'medicine_id',
    'route',
    'dosage',
    'unit',
    'interval',
    'duration',
    'status',
    'cycle_no',
    'notes',
    'starts_at',
    'stopped_at',
    'created_by',
])]
class MedicationAdministration extends Model
{
    protected function casts(): array
    {
        return [
            'dosage' => 'decimal:2',
            'duration' => 'integer',
            'cycle_no' => 'integer',
            'starts_at' => 'datetime',
            'stopped_at' => 'datetime',
        ];
    }

    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function doses(): HasMany
    {
        return $this->hasMany(MedicationDose::class);
    }

    public function dailyDoseCount(): int
    {
        return match ($this->interval) {
            'QD' => 1,
            'BID' => 2,
            'TID' => 3,
            'QID' => 4,
            'QHS' => 1,
            'PRN' => 1,
            default => 1,
        };
    }

    public function doseTimes(): array
    {
        return match ($this->interval) {
            'QD' => ['08:00'],
            'BID' => ['08:00', '20:00'],
            'TID' => ['08:00', '14:00', '20:00'],
            'QID' => ['08:00', '12:00', '18:00', '22:00'],
            'QHS' => ['22:00'],
            default => ['08:00'],
        };
    }

    public function hasAdministrationActivity(): bool
    {
        return $this->doses()
            ->whereIn('status', ['provided', 'missed', 'refused'])
            ->exists();
    }

    public function generateNextDose(): ?MedicationDose
    {
        if ($this->doses()->where('status', 'pending')->exists()) {
            return null;
        }

        $duration = $this->duration ?? $this->dailyDoseCount();

        $actionedCount = $this->doses()
            ->where('cycle_no', $this->cycle_no)
            ->whereIn('status', ['provided', 'missed', 'refused'])
            ->count();

        if ($actionedCount >= $duration) {
            return null;
        }

        $nextNo = $actionedCount + 1;

        $now = now();
        $times = $this->doseTimes();
        $dailyCount = $this->dailyDoseCount();

        for ($dayOffset = 0; $dayOffset < 30; $dayOffset++) {
            $date = $now->copy()->addDays($dayOffset)->startOfDay();

            foreach ($times as $time) {
                $scheduledAt = $date->copy()->setTimeFromTimeString($time);

                if ($scheduledAt->lte($now)) {
                    continue;
                }

                $exists = $this->doses()
                    ->where('scheduled_at', $scheduledAt)
                    ->exists();

                if ($exists) {
                    continue;
                }

                return MedicationDose::create([
                    'medication_administration_id' => $this->id,
                    'cycle_no' => $this->cycle_no,
                    'administration_no' => $nextNo,
                    'total_administrations' => $duration,
                    'scheduled_at' => $scheduledAt,
                    'status' => 'pending',
                ]);
            }
        }

        return null;
    }
}
