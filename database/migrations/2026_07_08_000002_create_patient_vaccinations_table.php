<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_vaccinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vaccine_id')->constrained()->cascadeOnDelete();
            $table->integer('dose_number');
            $table->date('administered_date');
            $table->text('notes')->nullable();
            $table->foreignId('administered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['patient_id', 'vaccine_id', 'dose_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_vaccinations');
    }
};
