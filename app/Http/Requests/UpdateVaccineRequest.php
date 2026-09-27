<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesVaccinePayload;
use App\Models\Vaccine;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVaccineRequest extends FormRequest
{
    use ValidatesVaccinePayload;

    public function rules(): array
    {
        $vaccine = $this->route('vaccine');
        $vaccineId = $vaccine instanceof Vaccine ? $vaccine->id : $vaccine;

        return array_merge(
            $this->vaccineRules([
                'required',
                'string',
                'min:2',
                'max:255',
                Rule::unique('vaccines', 'name')->ignore($vaccineId),
            ]),
            [
                'age_rules.*.id' => [
                    'nullable',
                    'integer',
                    Rule::exists('vaccine_age_rules', 'id')->where('vaccine_id', $vaccineId),
                ],
            ],
        );
    }
}
