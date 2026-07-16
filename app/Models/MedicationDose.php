<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'medication_administration_id',
    'scheduled_at',
    'administered_at',
    'status',
    'administered_by',
    'unit_price',
    'skip_reason',
])]
class MedicationDose extends Model
{
    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'administered_at' => 'datetime',
            'unit_price' => 'decimal:2',
        ];
    }

    public function medicationAdministration(): BelongsTo
    {
        return $this->belongsTo(MedicationAdministration::class);
    }

    public function administeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'administered_by');
    }
}
