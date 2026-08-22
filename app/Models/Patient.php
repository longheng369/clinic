<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

#[Fillable([
    'khmer_first_name',
    'khmer_last_name',
    'first_name',
    'last_name',
    'date_of_birth',
    'address',
    'blood_group',
    'phone_number',
    'gender',
    'allergy',
    'created_by',
    'last_modifier',
    'national_id',
])]
class Patient extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function lastModifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'last_modifier');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(PatientAttachment::class);
    }

    public function surveillance(): HasMany
    {
        return $this->hasMany(PatientSurveillance::class);
    }

    public function consultations(): HasMany
    {
        return $this->hasMany(Consultation::class);
    }

    public function paraClinicRequests(): HasMany
    {
        return $this->hasMany(ParaclinicRequest::class);
    }

    public function visits(): HasMany
    {
        return $this->hasMany(Visit::class);
    }

    public function vaccinations(): HasMany
    {
        return $this->hasMany(PatientVaccination::class);
    }

    public function getAgeInMonthsAttribute(): int
    {
        return (int) $this->date_of_birth->diffInMonths(now());
    }

    public function nextDoseForVaccine(Vaccine $vaccine): array
    {
        $ageMonths = $this->age_in_months;

        $rules = $vaccine->rules ?? [];
        $rule = null;
        foreach ($rules as $r) {
            if ($ageMonths >= $r['min_age_months'] && ($r['max_age_months'] === null || $ageMonths <= $r['max_age_months'])) {
                $rule = $r;
                break;
            }
        }

        if (! $rule) {
            return [
                'eligible' => false,
                'doses_completed' => 0,
                'total_doses' => 0,
                'next_dose_number' => null,
                'next_dose_due_date' => null,
            ];
        }

        $totalDoses = count($rule['doses']);
        $lastVaccination = $this->vaccinations()
            ->where('vaccine_id', $vaccine->id)
            ->latest('id')
            ->first();

        $dosesCompleted = $lastVaccination?->dose_number ?? 0;

        if ($dosesCompleted >= $totalDoses) {
            return [
                'eligible' => true,
                'doses_completed' => $totalDoses,
                'total_doses' => $totalDoses,
                'next_dose_number' => null,
                'next_dose_due_date' => null,
            ];
        }

        $nextDoseNumber = $dosesCompleted + 1;
        $nextDoseDef = null;
        foreach ($rule['doses'] as $d) {
            if ($d['dose_number'] === $nextDoseNumber) {
                $nextDoseDef = $d;
                break;
            }
        }

        if (! $nextDoseDef) {
            return [
                'eligible' => true,
                'doses_completed' => $dosesCompleted,
                'total_doses' => $totalDoses,
                'next_dose_number' => null,
                'next_dose_due_date' => null,
            ];
        }

        if ($dosesCompleted === 0) {
            $dueDate = now();
        } else {
            $dueDate = Carbon::parse($lastVaccination->administered_date)
                ->addDays($nextDoseDef['interval_days']);
        }

        return [
            'eligible' => true,
            'doses_completed' => $dosesCompleted,
            'total_doses' => $totalDoses,
            'next_dose_number' => $nextDoseNumber,
            'next_dose_due_date' => $dueDate->toDateString(),
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $patient) {
            if (! $patient->created_by && Auth::check()) {
                $patient->created_by = Auth::id();
            }
        });
    }
}
