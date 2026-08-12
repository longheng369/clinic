<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('PRAGMA foreign_keys = OFF');

        DB::statement('ALTER TABLE medication_administrations RENAME TO medication_orders');

        DB::statement('ALTER TABLE medication_doses RENAME COLUMN medication_administration_id TO medication_order_id');

        DB::statement('ALTER TABLE medication_doses RENAME TO medication_administrations');

        DB::table('medication_audits')
            ->where('auditable_type', 'App\\Models\\MedicationAdministration')
            ->update(['auditable_type' => 'App\\Models\\MedicationOrder']);

        DB::table('medication_audits')
            ->where('auditable_type', 'App\\Models\\MedicationDose')
            ->update(['auditable_type' => 'App\\Models\\MedicationAdministration']);

        DB::statement('PRAGMA foreign_keys = ON');
    }

    public function down(): void
    {
        DB::statement('PRAGMA foreign_keys = OFF');

        DB::statement('ALTER TABLE medication_administrations RENAME TO medication_doses');

        DB::statement('ALTER TABLE medication_doses RENAME COLUMN medication_order_id TO medication_administration_id');

        DB::statement('ALTER TABLE medication_orders RENAME TO medication_administrations');

        DB::table('medication_audits')
            ->where('auditable_type', 'App\\Models\\MedicationAdministration')
            ->update(['auditable_type' => 'App\\Models\\MedicationDose']);

        DB::table('medication_audits')
            ->where('auditable_type', 'App\\Models\\MedicationOrder')
            ->update(['auditable_type' => 'App\\Models\\MedicationAdministration']);

        DB::statement('PRAGMA foreign_keys = ON');
    }
};
