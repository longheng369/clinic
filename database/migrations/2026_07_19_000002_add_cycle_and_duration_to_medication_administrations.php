<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medication_administrations', function (Blueprint $table) {
            $table->unsignedInteger('cycle_no')->default(1)->after('status');
            $table->unsignedInteger('duration')->nullable()->after('interval');
        });
    }

    public function down(): void
    {
        Schema::table('medication_administrations', function (Blueprint $table) {
            $table->dropColumn(['duration', 'cycle_no']);
        });
    }
};
