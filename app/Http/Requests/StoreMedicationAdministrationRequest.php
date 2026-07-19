<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicationAdministrationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'visit_id' => ['required', 'exists:visits,id'],
            'medicine_id' => ['required', 'exists:medicines,id'],
            'route' => ['required', 'string', 'max:255'],
            'dosage' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:255'],
            'interval' => ['required', 'string', 'in:QD,BID,TID,QID,QHS,PRN'],
            'duration' => ['required', 'integer', 'min:1', 'max:365'],
            'starts_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
