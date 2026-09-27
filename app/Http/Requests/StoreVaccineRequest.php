<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesVaccinePayload;
use Illuminate\Foundation\Http\FormRequest;

class StoreVaccineRequest extends FormRequest
{
    use ValidatesVaccinePayload;

    public function rules(): array
    {
        return $this->vaccineRules([
            'required',
            'string',
            'min:2',
            'max:255',
            'unique:vaccines,name',
        ]);
    }
}
