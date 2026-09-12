<?php

namespace Database\Seeders;

use App\Models\LapTest;
use App\Models\MedicineInstruction;
use App\Models\MedicationRoute;
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

        $lapTests = [
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

        foreach ($lapTests as $lapTest) {
            LapTest::firstOrCreate(
                ['name' => $lapTest['name']],
                $lapTest + ['description' => null]
            );
        }

        foreach (LapTest::all() as $lapTest) {
            DB::table('paraclinic_request_tests')
                ->where('test_name', $lapTest->name)
                ->whereNull('lab_test_id')
                ->update(['lab_test_id' => $lapTest->id]);
        }
    }
}
