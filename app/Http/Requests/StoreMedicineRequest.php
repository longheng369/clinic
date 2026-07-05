<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicineRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:medicines,name'],
            'type' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'dosage' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'unit_id' => ['nullable', 'exists:units,id'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
