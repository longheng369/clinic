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
class ParaclinicRequest extends Model
{
    use SoftDeletes;

    protected $table = 'para_clinic_requests';

    protected static function boot(): void
    {
        parent::boot();
        static::creating(fn (ParaclinicRequest $model) => $model->created_by ??= auth()->id());
        static::updating(fn (ParaclinicRequest $model) => $model->updated_by = auth()->id());
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function tests(): HasMany
    {
        return $this->hasMany(ParaclinicRequestTest::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(ParaclinicResult::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(ParaclinicAttachment::class);
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
