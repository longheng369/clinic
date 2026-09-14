<?php

namespace App\Models;

use App\Traits\Autocompletable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'price', 'description'])]
class DiagnosticTest extends Model
{
    use Autocompletable;

    public static function autocompleteExtra(): array
    {
        return ['price'];
    }

    protected function casts(): array
    {
        return [
            'price' => 'float',
        ];
    }

    public function paraClinicRequestTests(): HasMany
    {
        return $this->hasMany(ParaClinicRequestTest::class, 'diagnostic_test_id');
    }
}
