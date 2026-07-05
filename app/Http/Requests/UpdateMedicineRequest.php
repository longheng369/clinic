<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMedicineRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('medicines')->ignore($this->medicine)],
            'type' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'dosage' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'unit_id' => ['nullable', 'exists:units,id'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
