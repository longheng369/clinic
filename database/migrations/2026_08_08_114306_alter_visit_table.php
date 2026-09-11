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
        Schema::table('visits', function (Blueprint $table) {
            $table->dropColumn('visit_date');
            $table->dropForeign(['recorded_by']);
            $table->renameColumn('recorded_by', 'created_by');
            $table->foreign('created_by')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->renameColumn('created_by', 'recorded_by');
            $table->foreign('recorded_by')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
            $table->timestamp('visit_date')->nullable();
        });
    }
};
