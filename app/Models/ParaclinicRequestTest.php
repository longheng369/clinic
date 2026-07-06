<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'paraclinic_request_id',
    'test_category',
    'test_name',
    'priority',
    'instruction',
])]
class ParaclinicRequestTest extends Model
{
    public function paraclinicRequest(): BelongsTo
    {
        return $this->belongsTo(ParaclinicRequest::class);
    }
}
