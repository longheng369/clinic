<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('para_clinic_request_tests', function ($table) {
            $table->renameColumn('paraclinic_request_id', 'para_clinic_request_id');
        });
    }

    public function down(): void
    {
        Schema::table('para_clinic_request_tests', function ($table) {
            $table->renameColumn('para_clinic_request_id', 'paraclinic_request_id');
        });
    }
};
