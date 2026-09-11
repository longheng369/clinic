<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('paraclinic_requests', function (Blueprint $table) {
            $table->decimal('fee', 10, 2)->default(0)->after('status');
        });

        DB::statement('UPDATE paraclinic_requests SET fee = subtotal');

        Schema::table('paraclinic_requests', function (Blueprint $table) {
            $table->dropColumn(['subtotal', 'total_amount']);
        });

        Schema::table('visits', function (Blueprint $table) {
            $table->decimal('fee', 10, 2)->default(0)->after('status');
        });

        DB::statement('UPDATE visits SET fee = subtotal');

        Schema::table('visits', function (Blueprint $table) {
            $table->dropColumn(['subtotal', 'total_amount']);
        });
    }

    public function down(): void
    {
        Schema::table('paraclinic_requests', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->default(0)->after('status');
            $table->decimal('total_amount', 10, 2)->default(0)->after('subtotal');
        });

        DB::statement('UPDATE paraclinic_requests SET subtotal = fee, total_amount = fee');

        Schema::table('paraclinic_requests', function (Blueprint $table) {
            $table->dropColumn('fee');
        });

        Schema::table('visits', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->default(0)->after('status');
            $table->decimal('total_amount', 10, 2)->default(0)->after('subtotal');
        });

        DB::statement('UPDATE visits SET subtotal = fee, total_amount = fee');

        Schema::table('visits', function (Blueprint $table) {
            $table->dropColumn('fee');
        });
    }
};
