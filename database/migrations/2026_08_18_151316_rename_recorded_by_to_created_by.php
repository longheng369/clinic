<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['consultations', 'patient_surveillance'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropForeign(['recorded_by']);
                $table->renameColumn('recorded_by', 'created_by');
                $table->foreign('created_by')
                    ->references('id')
                    ->on('users')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        foreach (['consultations', 'patient_surveillance'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropForeign(['created_by']);
                $table->renameColumn('created_by', 'recorded_by');
                $table->foreign('recorded_by')
                    ->references('id')
                    ->on('users')
                    ->nullOnDelete();
            });
        }
    }
};
