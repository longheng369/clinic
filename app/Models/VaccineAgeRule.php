<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['vaccine_id', 'min_age', 'min_age_unit', 'max_age', 'max_age_unit', 'dose_rules'])]
class VaccineAgeRule extends Model
{
    protected function casts(): array
    {
        return [
            'min_age' => 'integer',
            'max_age' => 'integer',
            'dose_rules' => 'array',
        ];
    }

    public function vaccine(): BelongsTo
    {
        return $this->belongsTo(Vaccine::class);
    }

    public static function toDays(int|float|string|null $value, ?string $unit): float
    {
        if ($value === null || $value === '') {
            return 0.0;
        }

        return (float) $value * match (strtolower($unit ?? '')) {
            'year' => 365.0,
            'month' => 30.0,
            'day' => 1.0,
            default => 1.0,
        };
    }

    public function coversAgeInDays(int|float $ageDays): bool
    {
        if ($ageDays < self::toDays($this->min_age, $this->min_age_unit)) {
            return false;
        }

        return $this->max_age === null
            || $ageDays <= self::toDays($this->max_age, $this->max_age_unit);
    }
}
