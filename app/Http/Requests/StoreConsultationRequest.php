<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreConsultationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'visit_id' => ['required', 'integer', 'exists:visits,id'],
            'weight' => ['nullable', 'numeric', 'min:0', 'max:500'],
            'chief_complaint' => ['required', 'string', 'max:65535'],
            'respiratory_system_symptoms' => ['nullable', 'array'],
            'respiratory_system_others_note' => ['nullable', 'string', 'max:65535'],
            'cardiovascular_symptoms' => ['nullable', 'array'],
            'cardiovascular_others_note' => ['nullable', 'string', 'max:65535'],
            'neurological_symptoms' => ['nullable', 'array'],
            'neurological_others_note' => ['nullable', 'string', 'max:65535'],
            'musculoskeletal_symptoms' => ['nullable', 'array'],
            'musculoskeletal_others_note' => ['nullable', 'string', 'max:65535'],
            'digestive_symptoms' => ['nullable', 'array'],
            'digestive_others_note' => ['nullable', 'string', 'max:65535'],
            'renal_reproductive_symptoms' => ['nullable', 'array'],
            'renal_reproductive_others_note' => ['nullable', 'string', 'max:65535'],
            'skin_symptoms' => ['nullable', 'array'],
            'skin_others_note' => ['nullable', 'string', 'max:65535'],
            'eye_symptoms' => ['nullable', 'array'],
            'eye_others_note' => ['nullable', 'string', 'max:65535'],
            'ear_symptoms' => ['nullable', 'array'],
            'ear_others_note' => ['nullable', 'string', 'max:65535'],
            'nose_symptoms' => ['nullable', 'array'],
            'nose_others_note' => ['nullable', 'string', 'max:65535'],
            'throat_symptoms' => ['nullable', 'array'],
            'throat_others_note' => ['nullable', 'string', 'max:65535'],
            'psycology_symptoms' => ['nullable', 'array'],
            'psycology_others_note' => ['nullable', 'string', 'max:65535'],
            'diagnosis' => ['nullable', 'string', 'max:65535'],
            'note' => ['nullable', 'string', 'max:65535'],
            'fee' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
