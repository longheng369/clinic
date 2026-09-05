<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // unit_id currently stores unit *names* (varchar). Convert it to a
        // real foreign key by matching those names against the units table.
        $units = DB::table('units')->pluck('id', 'name');

        foreach (DB::table('prescription_items')->get() as $item) {
            $unitId = null;

            if (is_numeric($item->unit_id)) {
                $unitId = (int) $item->unit_id;
            } elseif (isset($units[$item->unit_id])) {
                $unitId = $units[$item->unit_id];
            } elseif ($item->unit_id !== null && $item->unit_id !== '') {
                $unitId = DB::table('units')->insertGetId([
                    'name' => $item->unit_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('prescription_items')
                ->where('id', $item->id)
                ->update(['unit_id' => $unitId]);
        }

        // Rebuild the column as a nullable integer FK to units.
        Schema::table('prescription_items', function (Blueprint $table) {
            $table->unsignedBigInteger('unit_id')->nullable()->change();
            $table->foreign('unit_id')->references('id')->on('units')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('prescription_items', function (Blueprint $table) {
            $table->dropForeign(['unit_id']);
            $table->string('unit_id')->nullable()->change();
        });
    }
};
