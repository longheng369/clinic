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
    'status',
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

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function doses(): HasMany
    {
        return $this->hasMany(MedicationDose::class);
    }
}
