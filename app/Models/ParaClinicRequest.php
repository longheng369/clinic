<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

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

    protected $table = 'para_clinic_requests';

    protected static function boot(): void
    {
        parent::boot();
        static::creating(fn (ParaClinicRequest $model) => $model->created_by ??= auth()->id());
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
