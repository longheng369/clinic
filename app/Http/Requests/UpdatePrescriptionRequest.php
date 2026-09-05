<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePrescriptionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'visit_id' => ['required', 'exists:visits,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.medicine_id' => ['required', 'exists:medicines,id'],
            'items.*.route' => ['required', 'string', 'max:255'],
            'items.*.unit_id' => ['nullable', 'exists:units,id'],
            'items.*.morning' => ['nullable', 'numeric', 'min:0'],
            'items.*.afternoon' => ['nullable', 'numeric', 'min:0'],
            'items.*.evening' => ['nullable', 'numeric', 'min:0'],
            'items.*.night' => ['nullable', 'numeric', 'min:0'],
            'items.*.number_of_day' => ['nullable', 'integer', 'min:1'],
            'items.*.quantity' => ['nullable', 'numeric', 'min:0'],
            'items.*.notes' => ['nullable', 'string', 'max:500'],
            'items.*.instruction' => ['nullable', 'string', 'max:255'],
        ];
    }
}
