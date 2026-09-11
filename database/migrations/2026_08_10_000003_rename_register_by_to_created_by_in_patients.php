<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('patients', 'register_by') && !Schema::hasColumn('patients', 'created_by')) {
            Schema::table('patients', function ($table) {
                $table->dropForeign(['register_by']);
            });

            Schema::table('patients', function ($table) {
                $table->renameColumn('register_by', 'created_by');
            });

            Schema::table('patients', function ($table) {
                $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('patients', 'created_by')) {
            Schema::table('patients', function ($table) {
                $table->dropForeign(['created_by']);
            });

            Schema::table('patients', function ($table) {
                $table->renameColumn('created_by', 'register_by');
            });

            Schema::table('patients', function ($table) {
                $table->foreign('register_by')->references('id')->on('users')->onDelete('set null');
            });
        }
    }
};
