<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'prescription_id',
    'medicine_id',
    'route',
    'dosage',
    'unit',
    'frequency',
    'duration_days',
    'quantity',
    'notes',
])]
class PrescriptionItem extends Model
{
    protected function casts(): array
    {
        return [
            'dosage' => 'decimal:2',
            'quantity' => 'decimal:2',
            'duration_days' => 'integer',
        ];
    }

    public function prescription(): BelongsTo
    {
        return $this->belongsTo(Prescription::class);
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class);
    }
}
