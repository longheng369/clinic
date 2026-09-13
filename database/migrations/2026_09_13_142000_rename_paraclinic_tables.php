<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $tables = [
        'paraclinic_requests',
        'paraclinic_request_tests',
        'paraclinic_results',
        'paraclinic_attachments',
    ];

    public function up(): void
    {
        // Drop all foreign keys referencing paraclinic_requests
        Schema::table('paraclinic_request_tests', fn (Blueprint $t) => $t->dropForeign(['paraclinic_request_id']));
        Schema::table('paraclinic_results', fn (Blueprint $t) => $t->dropForeign(['paraclinic_request_id']));
        Schema::table('paraclinic_attachments', fn (Blueprint $t) => $t->dropForeign(['paraclinic_request_id']));

        // Rename tables
        Schema::rename('paraclinic_requests', 'para_clinic_requests');
        Schema::rename('paraclinic_request_tests', 'para_clinic_request_tests');
        Schema::rename('paraclinic_results', 'para_clinic_results');
        Schema::rename('paraclinic_attachments', 'para_clinic_attachments');

        // Recreate foreign keys
        Schema::table('para_clinic_request_tests', fn (Blueprint $t) =>
            $t->foreign('paraclinic_request_id')->references('id')->on('para_clinic_requests')->cascadeOnDelete());
        Schema::table('para_clinic_results', fn (Blueprint $t) =>
            $t->foreign('paraclinic_request_id')->references('id')->on('para_clinic_requests')->cascadeOnDelete());
        Schema::table('para_clinic_attachments', fn (Blueprint $t) =>
            $t->foreign('paraclinic_request_id')->references('id')->on('para_clinic_requests')->cascadeOnDelete());
    }

    public function down(): void
    {
        Schema::table('para_clinic_request_tests', fn (Blueprint $t) => $t->dropForeign(['paraclinic_request_id']));
        Schema::table('para_clinic_results', fn (Blueprint $t) => $t->dropForeign(['paraclinic_request_id']));
        Schema::table('para_clinic_attachments', fn (Blueprint $t) => $t->dropForeign(['paraclinic_request_id']));

        Schema::rename('para_clinic_requests', 'paraclinic_requests');
        Schema::rename('para_clinic_request_tests', 'paraclinic_request_tests');
        Schema::rename('para_clinic_results', 'paraclinic_results');
        Schema::rename('para_clinic_attachments', 'paraclinic_attachments');

        Schema::table('paraclinic_request_tests', fn (Blueprint $t) =>
            $t->foreign('paraclinic_request_id')->references('id')->on('paraclinic_requests')->cascadeOnDelete());
        Schema::table('paraclinic_results', fn (Blueprint $t) =>
            $t->foreign('paraclinic_request_id')->references('id')->on('paraclinic_requests')->cascadeOnDelete());
        Schema::table('paraclinic_attachments', fn (Blueprint $t) =>
            $t->foreign('paraclinic_request_id')->references('id')->on('paraclinic_requests')->cascadeOnDelete());
    }
};
