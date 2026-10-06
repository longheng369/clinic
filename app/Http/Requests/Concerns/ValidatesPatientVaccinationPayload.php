<?php

namespace App\Http\Requests\Concerns;

use App\Models\Vaccine;

trait ValidatesPatientVaccinationPayload
{
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $patient = $this->route('patient');
            $vaccine = Vaccine::find($this->input('vaccine_id'));
            $doseNumber = $this->input('dose_number');

            if (! $patient || ! $vaccine || $doseNumber === null || $doseNumber === '') {
                return;
            }

            $totalDoses = $patient->nextDoseForVaccine($vaccine)['total_doses'];

            if ($totalDoses > 0 && (int) $doseNumber > $totalDoses) {
                $validator->errors()->add(
                    'dose_number',
                    "The dose number must not be greater than {$totalDoses}."
                );
            }

            $highestDose = $patient->vaccinations()
                ->where('vaccine_id', $this->input('vaccine_id'))
                ->when($this->route('vaccination'), fn ($query, $vaccination) => $query->whereKeyNot($vaccination))
                ->max('dose_number');

            if ((int) $highestDose >= (int) $doseNumber) {

                $validator->errors()->add(
                    'dose_number',
                    "The dose number must not be lower than the recorded dose {$highestDose}."
                );
            }
        });
    }
}
