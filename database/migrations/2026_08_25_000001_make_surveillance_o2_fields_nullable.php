<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('patient_surveillance', function (Blueprint $table) {
            $table->integer('spo2')->nullable()->change();
            $table->string('o2_supply')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('patient_surveillance', function (Blueprint $table) {
            $table->integer('spo2')->nullable(false)->change();
            $table->string('o2_supply')->nullable(false)->change();
        });
    }
};
