<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('paraclinic_requests', function (Blueprint $table) {
            $table->dropForeign(['visit_id']);
            $table->dropColumn('visit_id');
        });

        Schema::table('paraclinic_requests', function (Blueprint $table) {
            $table->unsignedBigInteger('visit_id')->nullable()->after('doctor_id');
        });
    }

    public function down(): void
    {
        Schema::table('paraclinic_requests', function (Blueprint $table) {
            $table->dropColumn('visit_id');
        });

        Schema::table('paraclinic_requests', function (Blueprint $table) {
            $table->foreignId('visit_id')->nullable()->constrained()->nullOnDelete();
        });
    }
};
