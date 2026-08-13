<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Medicine;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Medicine>
 */
class MedicineFactory extends Factory
{
    protected $model = Medicine::class;

    public function definition(): array
    {
        $medicineNames = [
            'Paracetamol',
            'Ibuprofen',
            'Amoxicillin',
            'Cetirizine',
            'Omeprazole',
            'Metformin',
            'Amlodipine',
            'Loratadine',
            'Azithromycin',
            'Ciprofloxacin',
            'Diclofenac',
            'Aspirin',
            'Simvastatin',
            'Atorvastatin',
            'Losartan',
            'Metoprolol',
            'Ranitidine',
            'Dextromethorphan',
            'Salbutamol',
            'Prednisolone',
            'Levothyroxine',
            'Clopidogrel',
            'Warfarin',
            'Furosemide',
            'Hydrochlorothiazide',
            'Gabapentin',
            'Tramadol',
            'Codeine',
            'Morphine',
            'Insulin',
            'Multivitamin',
            'Vitamin C',
            'Vitamin D',
            'Ferrous Sulfate',
            'Folic Acid',
            'Calcium Carbonate',
            'Zinc Sulfate',
            'Betamethasone',
            'Hydrocortisone',
            'Clotrimazole',
            'Fluconazole',
            'Mebendazole',
        ];

        $types = ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'suspension', 'suppository'];
        $dosages = ['100mg', '250mg', '500mg', '1g', '5mg', '10mg', '20mg', '5ml', '10ml', '100ml'];

        return [
            'name'        => fake()->unique()->randomElement($medicineNames) . ' ' . fake()->unique()->numberBetween(1000, 9999),
            'type'        => fake()->randomElement($types),
            'description' => fake()->optional()->sentence(),
            'dosage'      => fake()->randomElement($dosages),
            'unit_id'     => Unit::inRandomOrder()->value('id'),
            'category_id' => Category::inRandomOrder()->value('id'),
            'unit_price'  => fake()->randomFloat(2, 1, 500),
        ];
    }
}
