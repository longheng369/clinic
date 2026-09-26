<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('vaccine_dose_rules');
    }

    public function down(): void
    {
        Schema::create('vaccine_dose_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vaccine_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('dose_number');
            $table->string('age_unit')->default('month');
            $table->unsignedInteger('min_age');
            $table->unsignedInteger('max_age');
            $table->double('amount')->unsigned();
            $table->foreignId('unit_id')->constrained()->restrictOnDelete();
            $table->timestamps();
        });
    }
};
