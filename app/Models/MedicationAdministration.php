<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'medication_order_id',
    'cycle_no',
    'administration_no',
    'total_administrations',
    'scheduled_at',
    'administered_at',
    'status',
    'administered_by',
    'unit_price',
    'reason',
    'note',
])]
class MedicationAdministration extends Model
{
    protected $table = 'medication_administrations';

    protected function casts(): array
    {
        return [
            'cycle_no' => 'integer',
            'administration_no' => 'integer',
            'total_administrations' => 'integer',
            'scheduled_at' => 'datetime',
            'administered_at' => 'datetime',
            'unit_price' => 'decimal:2',
        ];
    }

    public function medicationOrder(): BelongsTo
    {
        return $this->belongsTo(MedicationOrder::class, 'medication_order_id');
    }

    public function administeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'administered_by');
    }
}
