<?php

namespace Database\Seeders;

use App\Models\DiagnosticTest;
use App\Models\MedicineInstruction;
use App\Models\MedicationRoute;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => 'password']
        );

        User::firstOrCreate(
            ['email' => 'longheng@gmail.com'],
            [
                'name' => 'Longheng',
                'password' => 'password',
            ]
        );

        User::firstOrCreate(
            ['email' => 'phandy@gmail.com'],
            [
                'name' => 'Phandy',
                'password' => 'password',
            ]
        );

        $routes = [
            ['name' => 'PO (Oral)'],
            ['name' => 'IV (Intravenous)'],
            ['name' => 'IM (Intramuscular)'],
            ['name' => 'SC (Subcutaneous)'],
            ['name' => 'SL (Sublingual)'],
            ['name' => 'PR (Rectal)'],
            ['name' => 'Topical'],
            ['name' => 'Inhalation'],
            ['name' => 'Otic (Ear)'],
            ['name' => 'Ophthalmic (Eye)'],
        ];

        foreach ($routes as $route) {
            MedicationRoute::firstOrCreate(['name' => $route['name']], $route);
        }

        $medicineInstructions = [
            ['name' => 'មុនបាយ'],
            ['name' => 'អំឡុងពេលអាហារ'],
            ['name' => 'ក្រោយបាយ'],
            ['name' => 'មុនចូលគេង'],
            ['name' => 'ពេលព្រឹក'],
            ['name' => 'ពេលថ្ងៃ'],
            ['name' => 'ពេលល្ងាច'],
            ['name' => 'ពេលយប់'],
            ['name' => 'ពេលឃ្លាន'],
            ['name' => 'ជាមួយទឹកច្រើន'],
            ['name' => 'ផឹកជាមួយទឹក'],
            ['name' => 'មិនត្រូវលេប'],
            ['name' => 'សម្រាប់លាបខាងក្រៅ'],
            ['name' => 'សម្រាប់លាង'],
            ['name' => 'ប្រើតាមតម្រូវការ'],
            ['name' => 'ប្រើតាមវេជ្ជបញ្ជា'],
        ];

        foreach ($medicineInstructions as $instruction) {
            MedicineInstruction::firstOrCreate($instruction);
        }

        $diagnosticTests = [
            ['name' => 'CBC', 'price' => 0],
            ['name' => 'Blood Sugar', 'price' => 0],
            ['name' => 'Lipid Profile', 'price' => 0],
            ['name' => 'Liver Function', 'price' => 0],
            ['name' => 'Renal Function', 'price' => 0],
            ['name' => 'Urinalysis', 'price' => 0],
            ['name' => 'ECG', 'price' => 0],
            ['name' => 'Echocardiogram', 'price' => 0],
            ['name' => 'Stress Test', 'price' => 0],
            ['name' => 'Holter Monitor', 'price' => 0],
            ['name' => 'Chest X-Ray', 'price' => 0],
            ['name' => 'Abdominal X-Ray', 'price' => 0],
            ['name' => 'Ultrasound', 'price' => 0],
            ['name' => 'CT Scan', 'price' => 0],
            ['name' => 'MRI', 'price' => 0],
            ['name' => 'Mammography', 'price' => 0],
            ['name' => 'Biopsy', 'price' => 0],
            ['name' => 'Histopathology', 'price' => 0],
            ['name' => 'Cytology', 'price' => 0],
            ['name' => 'Other', 'price' => 0],
        ];

        foreach ($diagnosticTests as $diagnosticTest) {
            DiagnosticTest::firstOrCreate(
                ['name' => $diagnosticTest['name']],
                $diagnosticTest + ['description' => null]
            );
        }

        foreach (DiagnosticTest::all() as $diagnosticTest) {
            DB::table('para_clinic_request_tests')
                ->where('test_name', $diagnosticTest->name)
                ->whereNull('diagnostic_test_id')
                ->update(['diagnostic_test_id' => $diagnosticTest->id]);
        }

        $units = [
            ['name' => 'mg', 'description' => 'Milligrams'],
            ['name' => 'g', 'description' => 'Grams'],
            ['name' => 'mcg', 'description' => 'Micrograms'],
            ['name' => 'mL', 'description' => 'Milliliters'],
            ['name' => 'L', 'description' => 'Liters'],
            ['name' => 'IU', 'description' => 'International Units'],
            ['name' => 'tablet', 'description' => 'Tablets'],
            ['name' => 'capsule', 'description' => 'Capsules'],
            ['name' => 'drop', 'description' => 'Drops'],
            ['name' => 'ampoule', 'description' => 'Ampoules'],
            ['name' => 'vial', 'description' => 'Vials'],
            ['name' => 'patch', 'description' => 'Patches'],
            ['name' => 'suppository', 'description' => 'Suppositories'],
            ['name' => 'puff', 'description' => 'Puffs (inhaler)'],
            ['name' => 'tube', 'description' => 'Tubes (topical)'],
            ['name' => 'bottle', 'description' => 'Bottles'],
            ['name' => 'sachet', 'description' => 'Sachets'],
            ['name' => 'sheet', 'description' => 'Sheets'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate(['name' => $unit['name']], $unit);
        }
    }
}
