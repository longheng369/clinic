<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['vaccine_id', 'dose_number', 'age_unit', 'min_age', 'max_age', 'amount', 'unit_id'])]
class VaccineDoseRule extends Model
{
    protected function casts(): array
    {
        return [
            'dose_number' => 'integer',
            'min_age' => 'integer',
            'max_age' => 'integer',
            'amount' => 'double',
        ];
    }

    public function vaccine(): BelongsTo
    {
        return $this->belongsTo(Vaccine::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}
