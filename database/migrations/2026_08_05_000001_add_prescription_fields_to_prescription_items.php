<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('prescription_items', 'route')) {
            Schema::table('prescription_items', fn (Blueprint $table) => $table->string('route')->nullable());
        }

        if (! Schema::hasColumn('prescription_items', 'dosage')) {
            Schema::table('prescription_items', fn (Blueprint $table) => $table->decimal('dosage', 8, 2)->nullable());
        }

        if (! Schema::hasColumn('prescription_items', 'unit')) {
            Schema::table('prescription_items', fn (Blueprint $table) => $table->string('unit')->nullable());
        }

        if (! Schema::hasColumn('prescription_items', 'frequency')) {
            Schema::table('prescription_items', fn (Blueprint $table) => $table->string('frequency')->nullable());
        }
    }

    public function down(): void
    {
        // These columns may have been created by the original table migration.
    }
};
