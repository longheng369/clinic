<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prescription_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prescription_id')->constrained()->cascadeOnDelete();
            $table->foreignId('medicine_id')->constrained()->cascadeOnDelete();
            $table->foreignId('route_id')->nullable()->constrained('medication_routes')->nullOnDelete();
            $table->foreignId('unit_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('morning', 8, 2)->nullable();
            $table->decimal('afternoon', 8, 2)->nullable();
            $table->decimal('evening', 8, 2)->nullable();
            $table->decimal('night', 8, 2)->nullable();
            $table->integer('number_of_day')->nullable();
            $table->decimal('quantity', 8, 2)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('medicine_instruction_id')->nullable()->constrained('medicine_instructions')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prescription_items');
    }
};
