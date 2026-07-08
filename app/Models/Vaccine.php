<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'description', 'rules', 'created_by'])]
class Vaccine extends Model
{
    protected function casts(): array
    {
        return [
            'rules' => 'array',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function patientVaccinations(): HasMany
    {
        return $this->hasMany(PatientVaccination::class);
    }
}
