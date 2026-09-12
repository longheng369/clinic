<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paraclinic_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number')->unique();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('visit_id')->nullable()->constrained()->nullOnDelete();
            $table->string('external_facility_name')->nullable();
            $table->date('request_date');
            $table->text('clinical_reason')->nullable();
            $table->string('provisional_diagnosis')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('Draft');
            $table->decimal('fee', 10, 2)->default(0);
            $table->string('payment_status')->default('Unpaid');
            $table->date('payment_date')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paraclinic_requests');
    }
};
