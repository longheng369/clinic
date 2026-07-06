<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'khmer_first_name',
    'khmer_last_name',
    'first_name',
    'last_name',
    'date_of_birth',
    'address',
    'blood_group',
    'phone_number',
    'gender',
    'allergy',
    'register_by',
    'last_modifier',
    'national_id',
])]
class Patient extends Model
{
    use SoftDeletes;

    public function registerBy(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'register_by');
    }

    public function lastModifier(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'last_modifier');
    }

    public function attachments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PatientAttachment::class);
    }

    public function surveillances(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PatientSurveillance::class);
    }

    public function paraclinicRequests(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ParaclinicRequest::class);
    }
}
