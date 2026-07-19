<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('medication_administrations')
            ->where('status', 'stopped')
            ->update(['status' => 'discontinued']);

        DB::table('medication_administrations')
            ->where('status', 'prescribed')
            ->update(['status' => 'active']);
    }

    public function down(): void
    {
        DB::table('medication_administrations')
            ->where('status', 'discontinued')
            ->update(['status' => 'stopped']);
    }
};
