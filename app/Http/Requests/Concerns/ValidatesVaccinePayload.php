<?php

namespace App\Http\Requests\Concerns;

trait ValidatesVaccinePayload
{
    /**
     * Rules shared by vaccine store and update requests.
     *
     * @param  array  $nameRules  Name rules, including uniqueness (ignore id on update).
     * @return array<string, array>
     */
    protected function vaccineRules(array $nameRules): array
    {
        return [
            'name' => [...$nameRules],
            'description' => ['nullable', 'string', 'max:2000'],
            'age_rules' => ['required', 'array', 'min:1', 'max:20'],
            'age_rules.*.min_age' => ['required', 'integer', 'min:0', 'max:100000'],
            'age_rules.*.min_age_unit' => ['required', 'string', 'in:day,month,year'],
            'age_rules.*.max_age' => ['nullable', 'integer', 'min:0', 'max:100000'],
            'age_rules.*.max_age_unit' => ['nullable', 'string', 'in:day,month,year'],
            'age_rules.*.dose_rules' => ['required', 'array', 'min:1', 'max:20'],
            'age_rules.*.dose_rules.*.amount' => ['required', 'numeric', 'gt:0'],
            'age_rules.*.dose_rules.*.amount_unit_id' => ['required', 'integer', 'exists:units,id'],
            'age_rules.*.dose_rules.*.interval_from_previous_dose' => ['nullable', 'integer', 'min:0', 'max:100000'],
            'age_rules.*.dose_rules.*.interval_from_previous_dose_unit' => ['nullable', 'string', 'in:day,month,year'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            foreach ((array) $this->input('age_rules', []) as $ageIndex => $ageRule) {
                if (! is_array($ageRule)) {
                    continue;
                }

                $this->validateAgeRange($validator, (int) $ageIndex, $ageRule);
                $this->validateDoseIntervals($validator, (int) $ageIndex, $ageRule);
            }
        });
    }

    private function validateAgeRange($validator, int $ageIndex, array $ageRule): void
    {
        $minAge = $ageRule['min_age'] ?? null;
        $minUnit = $ageRule['min_age_unit'] ?? null;
        $maxAge = $ageRule['max_age'] ?? null;
        $maxUnit = $ageRule['max_age_unit'] ?? null;
        $hasMaxAge = $maxAge !== null && $maxAge !== '';

        if ($hasMaxAge && ($maxUnit === null || $maxUnit === '')) {
            $validator->errors()->add(
                "age_rules.$ageIndex.max_age_unit",
                'The max age unit is required when max age is set.'
            );

            return;
        }

        if (! $hasMaxAge
            || $minAge === null
            || $minAge === ''
            || ! is_numeric($minAge)
            || ! is_numeric($maxAge)
            || ! $this->isAgeUnit($minUnit)
            || ! $this->isAgeUnit($maxUnit)
        ) {
            return;
        }

        if ($this->ageToDays($maxAge, $maxUnit) < $this->ageToDays($minAge, $minUnit)) {
            $validator->errors()->add(
                "age_rules.$ageIndex.max_age",
                'The max age must be greater than or equal to the min age.'
            );
        }
    }

    private function validateDoseIntervals($validator, int $ageIndex, array $ageRule): void
    {
        $doseRules = $ageRule['dose_rules'] ?? null;

        if (! is_array($doseRules)) {
            return;
        }

        foreach ($doseRules as $doseIndex => $doseRule) {
            if ($doseIndex === 0 || ! is_array($doseRule)) {
                continue;
            }

            $interval = $doseRule['interval_from_previous_dose'] ?? null;
            $intervalUnit = $doseRule['interval_from_previous_dose_unit'] ?? null;

            if ($interval === null || $interval === '') {
                $validator->errors()->add(
                    "age_rules.$ageIndex.dose_rules.$doseIndex.interval_from_previous_dose",
                    'The interval from previous dose is required.'
                );
            }

            if ($intervalUnit === null || $intervalUnit === '') {
                $validator->errors()->add(
                    "age_rules.$ageIndex.dose_rules.$doseIndex.interval_from_previous_dose_unit",
                    'The interval unit from previous dose is required.'
                );
            }
        }
    }

    private function isAgeUnit(mixed $unit): bool
    {
        return in_array($unit, ['day', 'month', 'year'], true);
    }

    private function ageToDays(int|float|string $age, string $unit): float
    {
        $factor = match ($unit) {
            'month' => 30,
            'year' => 365,
            default => 1,
        };

        return (float) $age * $factor;
    }
}
