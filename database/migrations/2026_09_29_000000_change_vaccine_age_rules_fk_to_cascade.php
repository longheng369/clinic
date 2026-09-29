<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vaccine_age_rules', function (Blueprint $table) {
            $table->dropForeign(['vaccine_id']);
            $table->foreign('vaccine_id')->references('id')->on('vaccines')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('vaccine_age_rules', function (Blueprint $table) {
            $table->dropForeign(['vaccine_id']);
            $table->foreign('vaccine_id')->references('id')->on('vaccines')->restrictOnDelete();
        });
    }
};
