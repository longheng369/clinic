<?php

namespace Database\Seeders;

use App\Models\LapTest;
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

        $routes = [
            ['code' => 'PO', 'name' => 'PO (Oral)'],
            ['code' => 'IV', 'name' => 'IV (Intravenous)'],
            ['code' => 'IM', 'name' => 'IM (Intramuscular)'],
            ['code' => 'SC', 'name' => 'SC (Subcutaneous)'],
            ['code' => 'SL', 'name' => 'SL (Sublingual)'],
            ['code' => 'PR', 'name' => 'PR (Rectal)'],
            ['code' => 'Topical', 'name' => 'Topical'],
            ['code' => 'Inhalation', 'name' => 'Inhalation'],
            ['code' => 'Otic', 'name' => 'Otic (Ear)'],
            ['code' => 'Ophthalmic', 'name' => 'Ophthalmic (Eye)'],
        ];

        foreach ($routes as $route) {
            MedicationRoute::firstOrCreate(['code' => $route['code']], $route);
        }

        $lapTests = [
            ['value' => 'CBC', 'name' => 'CBC', 'price' => 0],
            ['value' => 'BLOOD-SUGAR', 'name' => 'Blood Sugar', 'price' => 0],
            ['value' => 'LIPID-PROFILE', 'name' => 'Lipid Profile', 'price' => 0],
            ['value' => 'LIVER-FUNCTION', 'name' => 'Liver Function', 'price' => 0],
            ['value' => 'RENAL-FUNCTION', 'name' => 'Renal Function', 'price' => 0],
            ['value' => 'URINALYSIS', 'name' => 'Urinalysis', 'price' => 0],
            ['value' => 'ECG', 'name' => 'ECG', 'price' => 0],
            ['value' => 'ECHOCARDIOGRAM', 'name' => 'Echocardiogram', 'price' => 0],
            ['value' => 'STRESS-TEST', 'name' => 'Stress Test', 'price' => 0],
            ['value' => 'HOLTER-MONITOR', 'name' => 'Holter Monitor', 'price' => 0],
            ['value' => 'CHEST-XRAY', 'name' => 'Chest X-Ray', 'price' => 0],
            ['value' => 'ABDOMINAL-XRAY', 'name' => 'Abdominal X-Ray', 'price' => 0],
            ['value' => 'ULTRASOUND', 'name' => 'Ultrasound', 'price' => 0],
            ['value' => 'CT-SCAN', 'name' => 'CT Scan', 'price' => 0],
            ['value' => 'MRI', 'name' => 'MRI', 'price' => 0],
            ['value' => 'MAMMOGRAPHY', 'name' => 'Mammography', 'price' => 0],
            ['value' => 'BIOPSY', 'name' => 'Biopsy', 'price' => 0],
            ['value' => 'HISTOPATHOLOGY', 'name' => 'Histopathology', 'price' => 0],
            ['value' => 'CYTOLOGY', 'name' => 'Cytology', 'price' => 0],
            ['value' => 'OTHER', 'name' => 'Other', 'price' => 0],
        ];

        foreach ($lapTests as $lapTest) {
            LapTest::firstOrCreate(
                ['value' => $lapTest['value']],
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
