<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateParaclinicRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->filled('payment_status')) {
            $this->merge([
                'payment_status' => strtolower((string) $this->input('payment_status')),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'exists:patients,id'],
            'visit_id' => ['nullable', 'exists:visits,id'],
            'external_facility_name' => ['nullable', 'string', 'max:255'],
            'request_date' => ['required', 'date_format:d-m-Y H:i'],
            'clinical_reason' => ['nullable', 'string'],
            'provisional_diagnosis' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:requested,cancelled,completed'],
            'fee' => ['nullable', 'numeric', 'min:0'],
            'payment_status' => ['nullable', 'in:unpaid,partial,paid'],
            'payment_date' => ['nullable', 'date'],
            'tests' => ['required', 'array', 'min:1'],
            'tests.*' => ['required', 'integer', 'exists:diagnostic_tests,id'],
        ];
    }
}
