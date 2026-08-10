<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prescription_items', fn (Blueprint $table) => $table->string('instruction', 255)->nullable()->after('notes'));
    }

    public function down(): void
    {
        Schema::table('prescription_items', fn (Blueprint $table) => $table->dropColumn('instruction'));
    }
};
