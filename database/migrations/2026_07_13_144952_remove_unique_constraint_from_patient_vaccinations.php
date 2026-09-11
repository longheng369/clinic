<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('patient_vaccinations', function (Blueprint $table) {
            $table->dropUnique(['patient_id', 'vaccine_id', 'dose_number']);
            $table->index(['patient_id', 'vaccine_id']);
        });
    }

    public function down(): void
    {
        Schema::table('patient_vaccinations', function (Blueprint $table) {
            $table->dropIndex(['patient_id', 'vaccine_id']);
            $table->unique(['patient_id', 'vaccine_id', 'dose_number']);
        });
    }
};
