<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('prescription_items', 'duration_days') && !Schema::hasColumn('prescription_items', 'number_of_day')) {
            Schema::table('prescription_items', fn ($table) => $table->renameColumn('duration_days', 'number_of_day'));
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('prescription_items', 'number_of_day')) {
            Schema::table('prescription_items', fn ($table) => $table->renameColumn('number_of_day', 'duration_days'));
        }
    }
};
