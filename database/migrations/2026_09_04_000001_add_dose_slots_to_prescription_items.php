<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prescription_items', function (Blueprint $table) {
            $table->decimal('morning', 8, 2)->nullable()->after('frequency');
            $table->decimal('afternoon', 8, 2)->nullable()->after('morning');
            $table->decimal('evening', 8, 2)->nullable()->after('afternoon');
            $table->decimal('night', 8, 2)->nullable()->after('evening');
        });
    }

    public function down(): void
    {
        Schema::table('prescription_items', function (Blueprint $table) {
            $table->dropColumn(['morning', 'afternoon', 'evening', 'night']);
        });
    }
};
