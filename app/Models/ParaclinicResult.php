<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'paraclinic_request_id',
    'result_date',
    'result_summary',
    'doctor_interpretation',
    'reviewed_by',
    'reviewed_at',
])]
class ParaclinicResult extends Model
{
    public function paraclinicRequest(): BelongsTo
    {
        return $this->belongsTo(ParaclinicRequest::class);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
