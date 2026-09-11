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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('khmer_first_name');
            $table->string('khmer_last_name');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('date_of_birth');
            $table->integer('address')->nullable();
            $table->string('blood_group')->nullable();
            $table->string('phone_number');
            $table->string('gender');
            $table->string('allergy')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedBigInteger('last_modifier')->nullable();
            $table->foreign('last_modifier')->references('id')->on('users')->onDelete('set null');
            $table->string('national_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['phone_number', 'national_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
