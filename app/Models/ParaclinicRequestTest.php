<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'paraclinic_request_id',
    'diagnostic_test_id',
    'test_category',
    'test_name',
    'priority',
    'instruction',
    'price',
])]
class ParaclinicRequestTest extends Model
{
    protected $table = 'para_clinic_request_tests';

    public function paraclinicRequest(): BelongsTo
    {
        return $this->belongsTo(ParaclinicRequest::class);
    }

    public function diagnosticTest(): BelongsTo
    {
        return $this->belongsTo(DiagnosticTest::class);
    }
}
