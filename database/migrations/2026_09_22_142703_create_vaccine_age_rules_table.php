<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vaccine_age_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vaccine_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('min_age')->default(0);
            $table->string('min_age_unit')->default('month');
            $table->unsignedInteger('max_age')->nullable();
            $table->string('max_age_unit')->default('month');
            $table->json('dose_rules');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vaccine_age_rules');
    }
};
