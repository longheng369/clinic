<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientSurveillanceRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'visit_id' => ['nullable', 'integer', 'exists:visits,id'],
            'systolic' => ['required', 'integer', 'min:0', 'max:300'],
            'diastolic' => ['required', 'integer', 'min:0', 'max:200'],
            'pulse' => ['required', 'integer', 'min:0', 'max:300'],
            'temperature' => ['required', 'numeric', 'min:30', 'max:45'],
            'rr' => ['required', 'integer', 'min:0', 'max:100'],
            'spo2' => ['nullable', 'integer', 'min:0', 'max:100'],
            'o2_supply' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
