<?php

use App\Models\MedicineInstruction;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prescription_items', function (Blueprint $table) {
            $table->foreignId('medicine_instruction_id')
                ->nullable()
                ->after('notes')
                ->constrained('medicine_instructions')
                ->nullOnDelete();
        });

        DB::table('prescription_items')
            ->whereNotNull('instruction')
            ->orderBy('id')
            ->each(function ($item) {
                $instruction = MedicineInstruction::query()
                    ->where('code', $item->instruction)
                    ->first();

                if ($instruction) {
                    DB::table('prescription_items')
                        ->where('id', $item->id)
                        ->update(['medicine_instruction_id' => $instruction->id]);
                }
            });

        Schema::table('prescription_items', function (Blueprint $table) {
            $table->dropColumn('instruction');
        });

        Schema::table('medicine_instructions', function (Blueprint $table) {
            $table->dropColumn('code');
        });
    }

    public function down(): void
    {
        Schema::table('medicine_instructions', function (Blueprint $table) {
            $table->string('code')->unique()->after('id');
        });

        Schema::table('prescription_items', function (Blueprint $table) {
            $table->string('instruction', 255)->nullable()->after('notes');
        });

        DB::table('prescription_items')
            ->whereNotNull('medicine_instruction_id')
            ->orderBy('id')
            ->each(function ($item) {
                $instruction = MedicineInstruction::find($item->medicine_instruction_id);

                if ($instruction) {
                    DB::table('prescription_items')
                        ->where('id', $item->id)
                        ->update(['instruction' => $instruction->code]);
                }
            });

        Schema::table('prescription_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('medicine_instruction_id');
        });
    }
};
