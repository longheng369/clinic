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
        Schema::table('para_clinic_request_tests', function ($table) {
            $table->dropColumn(['priority', 'instruction']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('para_clinic_request_tests', function ($table) {
            $table->string('priority')->default('Routine');
            $table->text('instruction')->nullable();
        });
    }
};
