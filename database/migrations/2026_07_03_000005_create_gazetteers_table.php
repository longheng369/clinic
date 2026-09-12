<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gazetteers', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->integer('code')->index();
            $table->string('name_in_khmer');
            $table->string('name_in_latin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gazetteers');
    }
};
