<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->default(0)->after('status');
            $table->decimal('discount', 10, 2)->default(0)->after('subtotal');
            $table->decimal('total_amount', 10, 2)->default(0)->after('discount');
            $table->decimal('paid_amount', 10, 2)->default(0)->after('total_amount');
            $table->string('payment_status')->default('Unpaid')->after('paid_amount');
            $table->timestamp('payment_date')->nullable()->after('payment_status');
        });
    }

    public function down(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->dropColumn(['subtotal', 'discount', 'total_amount', 'paid_amount', 'payment_status', 'payment_date']);
        });
    }
};
