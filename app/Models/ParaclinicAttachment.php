<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'paraclinic_request_id',
    'file_name',
    'file_path',
    'mime_type',
    'file_size',
    'uploaded_by',
])]
class ParaclinicAttachment extends Model
{
    public function paraclinicRequest(): BelongsTo
    {
        return $this->belongsTo(ParaclinicRequest::class);
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
