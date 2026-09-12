<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paraclinic_request_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paraclinic_request_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lab_test_id')->nullable()->constrained('lap_tests')->nullOnDelete();
            $table->string('test_category');
            $table->string('test_name');
            $table->string('priority')->default('Routine');
            $table->text('instruction')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paraclinic_request_tests');
    }
};
