<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'appointment_date' => ['required', 'date'],
            'appointment_time' => ['nullable', 'string'],
            'type' => ['required', 'string', 'in:consultation,vaccination,follow_up,checkup,other'],
            'status' => ['required', 'string', 'in:scheduled,completed,cancelled,no_show'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
