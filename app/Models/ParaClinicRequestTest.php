<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'para_clinic_request_id',
    'diagnostic_test_id',
    'test_category',
    'test_name',
    'price',
])]
class ParaClinicRequestTest extends Model
{
    public function paraClinicRequest(): BelongsTo
    {
        return $this->belongsTo(ParaClinicRequest::class);
    }

    public function diagnosticTest(): BelongsTo
    {
        return $this->belongsTo(DiagnosticTest::class);
    }
}
