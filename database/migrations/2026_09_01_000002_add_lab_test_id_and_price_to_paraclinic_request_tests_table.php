<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('paraclinic_request_tests', function (Blueprint $table) {
            $table->foreignId('lab_test_id')->nullable()->after('paraclinic_request_id')
                ->constrained('lap_tests')->nullOnDelete();
            $table->decimal('price', 10, 2)->nullable()->after('instruction');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paraclinic_request_tests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('lab_test_id');
            $table->dropColumn('price');
        });
    }
};
