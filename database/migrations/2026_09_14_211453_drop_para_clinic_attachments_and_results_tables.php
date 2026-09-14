<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('para_clinic_attachments');
        Schema::dropIfExists('para_clinic_results');
    }

    public function down(): void
    {
        // Cannot reverse - tables dropped permanently
    }
};
