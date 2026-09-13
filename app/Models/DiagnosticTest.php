<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'price', 'description'])]
class DiagnosticTest extends Model
{
    protected function casts(): array
    {
        return [
            'price' => 'float',
        ];
    }

    public function paraClinicRequestTests(): HasMany
    {
        return $this->hasMany(ParaclinicRequestTest::class, 'diagnostic_test_id');
    }
}
