<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medication_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('medicine_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('route_id')->nullable()->constrained('medication_routes')->nullOnDelete();
            $table->decimal('dosage', 8, 2);
            $table->string('unit');
            $table->string('interval');
            $table->unsignedInteger('duration')->nullable();
            $table->string('status')->default('active');
            $table->unsignedInteger('cycle_no')->default(1);
            $table->text('notes')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('stopped_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medication_orders');
    }
};
