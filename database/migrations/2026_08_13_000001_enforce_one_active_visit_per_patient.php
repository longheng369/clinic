<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement("ALTER TABLE visits ADD active_patient_id BIGINT UNSIGNED GENERATED ALWAYS AS (IF(status = 'active', patient_id, NULL)) STORED");
            Schema::table('visits', function (Blueprint $table) {
                $table->unique('active_patient_id', 'visits_one_active_per_patient');
            });

            return;
        }

        $quotedTable = $driver === 'pgsql' ? '"visits"' : 'visits';
        DB::statement("CREATE UNIQUE INDEX visits_one_active_per_patient ON {$quotedTable} (patient_id) WHERE status = 'active'");
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            Schema::table('visits', function (Blueprint $table) {
                $table->dropUnique('visits_one_active_per_patient');
                $table->dropColumn('active_patient_id');
            });

            return;
        }

        DB::statement('DROP INDEX visits_one_active_per_patient');
    }
};
