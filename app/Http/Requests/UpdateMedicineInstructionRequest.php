<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMedicineInstructionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('medicine_instructions')->ignore($this->medicineInstruction)],
            'description' => ['nullable', 'string'],
        ];
    }
}
