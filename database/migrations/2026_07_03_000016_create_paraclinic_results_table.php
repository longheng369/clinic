<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paraclinic_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paraclinic_request_id')->constrained()->cascadeOnDelete();
            $table->date('result_date')->nullable();
            $table->text('result_summary')->nullable();
            $table->text('doctor_interpretation')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paraclinic_results');
    }
};
