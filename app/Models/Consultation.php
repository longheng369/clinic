<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'patient_id',
    'visit_id',
    'weight',
    'chief_complaint',
    'respiratory_system_symptoms',
    'respiratory_system_others_note',
    'cardiovascular_symptoms',
    'cardiovascular_others_note',
    'neurological_symptoms',
    'neurological_others_note',
    'musculoskeletal_symptoms',
    'musculoskeletal_others_note',
    'digestive_symptoms',
    'digestive_others_note',
    'renal_reproductive_symptoms',
    'renal_reproductive_others_note',
    'skin_symptoms',
    'skin_others_note',
    'eye_symptoms',
    'eye_others_note',
    'ear_symptoms',
    'ear_others_note',
    'nose_symptoms',
    'nose_others_note',
    'throat_symptoms',
    'throat_others_note',
    'psychology_symptoms',
    'psychology_others_note',
    'diagnosis',
    'note',
    'fee',
    'created_by',
])]
class Consultation extends Model
{
    protected function casts(): array
    {
        return [
            'weight' => 'decimal:1',
            'fee' => 'decimal:2',
            'respiratory_system_symptoms' => 'array',
            'cardiovascular_symptoms' => 'array',
            'neurological_symptoms' => 'array',
            'musculoskeletal_symptoms' => 'array',
            'digestive_symptoms' => 'array',
            'renal_reproductive_symptoms' => 'array',
            'skin_symptoms' => 'array',
            'eye_symptoms' => 'array',
            'ear_symptoms' => 'array',
            'nose_symptoms' => 'array',
            'throat_symptoms' => 'array',
            'psychology_symptoms' => 'array',
        ];
    }

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
        return $this->belongsTo(User::class, 'created_by');
    }
}
