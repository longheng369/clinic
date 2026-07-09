<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'exists:patients,id'],
            'appointment_date' => ['required', 'date'],
            'appointment_time' => ['nullable', 'string'],
            'type' => ['required', 'string', 'in:consultation,vaccination,follow_up,checkup,other'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
