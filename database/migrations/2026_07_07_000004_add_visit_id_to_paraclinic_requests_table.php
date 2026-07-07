<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('paraclinic_requests', function (Blueprint $table) {
            $table->foreign('visit_id')->references('id')->on('visits')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('paraclinic_requests', function (Blueprint $table) {
            $table->dropForeign(['visit_id']);
        });
    }
};
