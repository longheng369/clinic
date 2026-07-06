<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePatientRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'khmer_first_name' => ['required', 'string', 'max:255'],
            'khmer_last_name' => ['required', 'string', 'max:255'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'integer'],
            'blood_group' => ['nullable', 'string', 'max:10'],
            'phone_number' => ['required', 'string', 'max:20'],
            'gender' => ['required', 'string', 'in:male,female'],
            'allergy' => ['nullable', 'string', 'max:500'],
            'national_id' => ['nullable', 'string', 'max:50'],
        ];
    }
}
