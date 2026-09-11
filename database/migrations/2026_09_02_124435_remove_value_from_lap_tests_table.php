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
        Schema::table('lap_tests', function (Blueprint $table) {
            $table->dropUnique('lap_tests_value_unique');
            $table->dropColumn('value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lap_tests', function (Blueprint $table) {
            $table->string('value')->unique();
        });
    }
};
