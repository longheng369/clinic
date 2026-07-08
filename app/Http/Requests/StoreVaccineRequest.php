<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVaccineRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:vaccines,name'],
            'description' => ['nullable', 'string'],
            'rules' => ['required', 'array', 'min:1'],
            'rules.*.min_age_months' => ['required', 'integer', 'min:0'],
            'rules.*.max_age_months' => ['nullable', 'integer', 'min:0', 'gte:rules.*.min_age_months'],
            'rules.*.doses' => ['required', 'array', 'min:1'],
            'rules.*.doses.*.dose_number' => ['required', 'integer', 'min:1'],
            'rules.*.doses.*.interval_days' => ['required', 'integer', 'min:0'],
        ];
    }
}
