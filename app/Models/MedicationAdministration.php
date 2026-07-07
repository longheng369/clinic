<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'visit_id',
    'medicine_id',
    'route',
    'dosage',
    'unit',
    'interval',
    'status',
    'notes',
    'created_by',
])]
class MedicationAdministration extends Model
{
    protected function casts(): array
    {
        return [
            'dosage' => 'decimal:2',
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

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
