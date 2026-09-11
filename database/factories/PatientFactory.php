<?php

namespace Database\Factories;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Patient>
 */
class PatientFactory extends Factory
{
    protected $model = Patient::class;

    public function definition(): array
    {
        $khmerFirstNames = ['សុខ', 'ម៉ាលី', 'ដារ៉ា', 'បូរ៉ា', 'ចន្ថា', 'រដ្ឋា', 'ស្រីពេជ្រ', 'គឹមហួត', 'សុភ័ណ្ណ', 'វណ្ណា'];
        $khmerLastNames = ['ចាន់', 'សុខ', 'គឹម', 'លី', 'ហេង', 'សំ', 'ឈុន', 'អ៊ុង', 'អ៊ាង', 'តូច'];

        $englishFirstNames = ['John', 'David', 'Sarah', 'Emily', 'Michael', 'Jessica', 'Daniel', 'Sophia', 'James', 'Emma'];
        $englishLastNames = ['Smith', 'Brown', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris'];

        $bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null];

        return [
            'khmer_first_name' => fake()->randomElement($khmerFirstNames),
            'khmer_last_name'  => fake()->randomElement($khmerLastNames),
            'first_name'       => fake()->randomElement($englishFirstNames),
            'last_name'        => fake()->randomElement($englishLastNames),
            'date_of_birth'    => fake()->date(),
            'blood_group'      => fake()->randomElement($bloodGroups),
            'phone_number'     => fake()->unique()->numerify('0########'),
            'gender'           => fake()->randomElement(['male', 'female']),
            'allergy'          => fake()->optional()->randomElement(['Penicillin', 'Peanuts', 'Latex', 'Sulfa', null, null]),
            'national_id'      => fake()->optional()->numerify('##########'),
            'created_by'       => User::inRandomOrder()->first()?->id,
        ];
    }
}
