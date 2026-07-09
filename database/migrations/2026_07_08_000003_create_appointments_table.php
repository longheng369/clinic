<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->date('appointment_date');
            $table->time('appointment_time')->nullable();
            $table->string('type')->default('consultation'); // consultation, vaccination, follow_up, checkup, other
            $table->string('status')->default('scheduled'); // scheduled, completed, cancelled, no_show
            $table->text('notes')->nullable();
            $table->json('vaccine_alerts')->nullable(); // snapshot of vaccine due alerts at creation time
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
