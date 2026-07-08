<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientVaccinationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'vaccine_id' => ['required', 'exists:vaccines,id'],
            'dose_number' => ['required', 'integer', 'min:1'],
            'administered_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
