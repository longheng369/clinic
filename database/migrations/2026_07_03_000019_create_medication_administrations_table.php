<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medication_administrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medication_order_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('cycle_no')->default(1);
            $table->unsignedInteger('administration_no')->nullable();
            $table->unsignedInteger('total_administrations')->nullable();
            $table->timestamp('scheduled_at');
            $table->timestamp('administered_at')->nullable();
            $table->string('status')->default('pending');
            $table->foreignId('administered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('unit_price', 10, 2)->nullable();
            $table->text('reason')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index(['medication_order_id', 'scheduled_at']);
            $table->index(['status', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medication_administrations');
    }
};
