<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->decimal('weight', 5, 1)->nullable();
            $table->string('chief_complaint');
            $table->json('respiratory_system_symptoms')->nullable();
            $table->string('respiratory_system_others_note')->nullable();
            $table->json('cardiovascular_symptoms')->nullable();
            $table->string('cardiovascular_others_note')->nullable();
            $table->json('neurological_symptoms')->nullable();
            $table->string('neurological_others_note')->nullable();
            $table->json('musculoskeletal_symptoms')->nullable();
            $table->string('musculoskeletal_others_note')->nullable();
            $table->json('digestive_symptoms')->nullable();
            $table->string('digestive_others_note')->nullable();
            $table->json('renal_reproductive_symptoms')->nullable();
            $table->string('renal_reproductive_others_note')->nullable();
            $table->json('skin_symptoms')->nullable();
            $table->string('skin_others_note')->nullable();
            $table->json('eye_symptoms')->nullable();
            $table->string('eye_others_note')->nullable();
            $table->json('ear_symptoms')->nullable();
            $table->string('ear_others_note')->nullable();
            $table->json('nose_symptoms')->nullable();
            $table->string('nose_others_note')->nullable();
            $table->json('throat_symptoms')->nullable();
            $table->string('throat_others_note')->nullable();
            $table->json('psycology_symptoms')->nullable();
            $table->string('psycology_others_note')->nullable();
            $table->string('diagnosis')->nullable();
            $table->text('note')->nullable();
            $table->decimal('fee', 10, 2)->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};
