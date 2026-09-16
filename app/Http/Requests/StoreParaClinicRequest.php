<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreParaClinicRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'exists:patients,id'],
            'visit_id' => ['nullable', 'exists:visits,id'],
            'request_date' => ['required', 'date_format:d-m-Y H:i'],
            'clinical_reason' => ['nullable', 'string'],
            'provisional_diagnosis' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:requested,cancelled,completed'],
            'payment_status' => ['nullable', 'in:unpaid,partial,paid'],
            'payment_date' => ['nullable', 'date'],
            'tests' => ['required', 'array', 'min:1'],
            'tests.*' => ['required', 'integer', 'exists:diagnostic_tests,id'],
        ];
    }
}
