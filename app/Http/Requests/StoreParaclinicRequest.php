<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreParaclinicRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:users,id'],
            'visit_id' => ['nullable', 'exists:visits,id'],
            'external_facility_name' => ['nullable', 'string', 'max:255'],
            'request_date' => ['required', 'date'],
            'clinical_reason' => ['nullable', 'string'],
            'provisional_diagnosis' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:Draft,Requested,Waiting Result,Result Received,Reviewed,Completed,Cancelled'],
            'fee' => ['nullable', 'numeric', 'min:0'],
            'payment_status' => ['nullable', 'in:Unpaid,Partial,Paid'],
            'payment_date' => ['nullable', 'date'],
            'tests' => ['required', 'array', 'min:1'],
            'tests.*.lab_test_id' => ['required', 'exists:lap_tests,id'],
            'tests.*.price' => ['nullable', 'numeric', 'min:0'],
            'tests.*.priority' => ['required', 'in:Routine,Urgent,STAT'],
            'tests.*.instruction' => ['nullable', 'string'],
        ];
    }
}
