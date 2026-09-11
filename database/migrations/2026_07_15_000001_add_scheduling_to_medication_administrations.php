<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medication_administrations', function (Blueprint $table) {
            $table->timestamp('starts_at')->nullable()->after('interval');
            $table->timestamp('stopped_at')->nullable()->after('starts_at');
        });

        DB::table('medication_administrations')
            ->whereIn('status', ['provided', 'continued'])
            ->update(['status' => 'active']);
    }

    public function down(): void
    {
        Schema::table('medication_administrations', function (Blueprint $table) {
            $table->dropColumn(['stopped_at', 'starts_at']);
        });

        DB::table('medication_administrations')
            ->where('status', 'active')
            ->whereNotIn('id', function ($query) {
                $query->select('medication_administration_id')
                    ->from('medication_doses')
                    ->where('status', 'administered');
            })
            ->update(['status' => 'continued']);
    }
};
