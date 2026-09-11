<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consultations', function (Blueprint $table) {
            if (Schema::hasColumn('consultations', 'psycology_symptoms')) {
                $table->renameColumn('psycology_symptoms', 'psychology_symptoms');
                $table->renameColumn('psycology_others_note', 'psychology_others_note');
            }
        });
    }

    public function down(): void
    {
        Schema::table('consultations', function (Blueprint $table) {
            if (Schema::hasColumn('consultations', 'psychology_symptoms')) {
                $table->renameColumn('psychology_symptoms', 'psycology_symptoms');
                $table->renameColumn('psychology_others_note', 'psycology_others_note');
            }
        });
    }
};