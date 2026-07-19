<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MissedDoseRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
