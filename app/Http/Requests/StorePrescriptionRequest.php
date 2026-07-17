<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePrescriptionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'visit_id' => ['required', 'exists:visits,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.medicine_id' => ['required', 'exists:medicines,id'],
            'items.*.route' => ['required', 'string', 'max:255'],
            'items.*.dosage' => ['required', 'numeric', 'min:0'],
            'items.*.unit' => ['required', 'string', 'max:255'],
            'items.*.frequency' => ['required', 'string', 'in:QD,BID,TID,QID,QHS,PRN'],
            'items.*.duration_days' => ['nullable', 'integer', 'min:1'],
            'items.*.quantity' => ['nullable', 'numeric', 'min:0'],
            'items.*.notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
