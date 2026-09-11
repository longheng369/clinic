<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medication_doses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medication_administration_id')->constrained()->cascadeOnDelete();
            $table->timestamp('scheduled_at');
            $table->timestamp('administered_at')->nullable();
            $table->string('status')->default('pending');
            $table->foreignId('administered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('unit_price', 10, 2)->nullable();
            $table->text('skip_reason')->nullable();
            $table->timestamps();

            $table->index(['medication_administration_id', 'scheduled_at']);
            $table->index(['status', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medication_doses');
    }
};
