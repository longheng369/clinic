<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'patient_id',
    'visit_id',
    'systolic',
    'diastolic',
    'pulse',
    'temperature',
    'rr',
    'spo2',
    'o2_supply',
    'recorded_by',
])]
class PatientSurveillance extends Model
{
    protected $table = 'patient_surveillances';

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
