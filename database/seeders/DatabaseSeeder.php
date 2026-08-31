<?php

namespace Database\Seeders;

use App\Models\MedicationRoute;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
    }
}
