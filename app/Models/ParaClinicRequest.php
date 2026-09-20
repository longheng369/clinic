<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

#[Fillable([
    'request_number',
    'patient_id',
    'visit_id',
    'external_facility_name',
    'request_date',
    'clinical_reason',
    'provisional_diagnosis',
    'notes',
    'status',
    'fee',
    'payment_status',
    'payment_date',
    'created_by',
    'updated_by',
])]
class ParaClinicRequest extends Model
{
    use SoftDeletes;

    protected $casts = [
        'fee' => 'float'
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (ParaClinicRequest $model) {
            $model->created_by ??= auth()->id();

            if (! $model->request_number) {
                $model->request_number = DB::transaction(function () {
                    $prefix = 'PARA-' . now()->startOfDay()->format('Ymd') . '-';

                    $lastSequence = ParaClinicRequest::where('request_number', 'like', $prefix . '%')
                        ->lockForUpdate()
                        ->pluck('request_number')
                        ->map(fn ($n) => (int) substr($n, -4))
                        ->push(0)
                        ->max() + 1;

                    return $prefix . str_pad($lastSequence, 4, '0', STR_PAD_LEFT);
                });
            }
        });
        static::updating(fn (ParaClinicRequest $model) => $model->updated_by = auth()->id());
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function tests(): HasMany
    {
        return $this->hasMany(ParaClinicRequestTest::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
