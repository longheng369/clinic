<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('medication_doses')
            ->where('status', 'administered')
            ->update(['status' => 'provided']);

        DB::table('medication_doses')
            ->where('status', 'skipped')
            ->where('skip_reason', 'Order discontinued')
            ->update(['status' => 'cancelled']);

        DB::table('medication_doses')
            ->where('status', 'skipped')
            ->where('skip_reason', '!=', 'Order discontinued')
            ->update(['status' => 'missed']);

        Schema::table('medication_doses', function (Blueprint $table) {
            $table->unsignedInteger('cycle_no')->default(1)->after('medication_administration_id');
            $table->unsignedInteger('administration_no')->nullable()->after('cycle_no');
            $table->unsignedInteger('total_administrations')->nullable()->after('administration_no');
            $table->text('note')->nullable()->after('skip_reason');
            $table->renameColumn('skip_reason', 'reason');
        });
    }

    public function down(): void
    {
        Schema::table('medication_doses', function (Blueprint $table) {
            $table->renameColumn('reason', 'skip_reason');
            $table->dropColumn(['note', 'total_administrations', 'administration_no', 'cycle_no']);
        });

        DB::table('medication_doses')
            ->where('status', 'provided')
            ->update(['status' => 'administered']);

        DB::table('medication_doses')
            ->whereIn('status', ['missed', 'cancelled'])
            ->update(['status' => 'skipped']);
    }
};
