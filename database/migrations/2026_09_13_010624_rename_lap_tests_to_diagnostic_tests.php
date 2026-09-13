<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('lap_tests', 'diagnostic_tests');

        Schema::table('paraclinic_request_tests', function (Blueprint $table) {
            $table->renameColumn('lab_test_id', 'diagnostic_test_id');
        });
    }

    public function down(): void
    {
        Schema::table('paraclinic_request_tests', function (Blueprint $table) {
            $table->renameColumn('diagnostic_test_id', 'lab_test_id');
        });

        Schema::rename('diagnostic_tests', 'lap_tests');
    }
};
