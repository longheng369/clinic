<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreParaclinicRequest;
use App\Http\Requests\UpdateParaclinicRequest;
use App\Models\ParaClinicRequest;
use App\Models\DiagnosticTest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ParaClinicRequestController extends Controller
{
    public function show(ParaClinicRequest $paraClinicRequest): JsonResponse
    {
        $paraClinicRequest->load(['tests.diagnosticTest', 'createdBy', 'updatedBy']);

        return response()->json([
            'id' => $paraClinicRequest->id,
            'request_number' => $paraClinicRequest->request_number,
            'request_date' => \Carbon\Carbon::parse($paraClinicRequest->request_date)->format('d-m-Y H:i'),
            'external_facility_name' => $paraClinicRequest->external_facility_name,
            'clinical_reason' => $paraClinicRequest->clinical_reason,
            'provisional_diagnosis' => $paraClinicRequest->provisional_diagnosis,
            'notes' => $paraClinicRequest->notes,
            'status' => $paraClinicRequest->status,
            'fee' => (float) $paraClinicRequest->fee,
            'payment_status' => $paraClinicRequest->payment_status,
            'payment_date' => $paraClinicRequest->payment_date,
            'tests' => $paraClinicRequest->tests->map(fn ($t) => [
                'id' => $t->id,
                'test_name' => $t->test_name,
                'test_category' => $t->test_category,
                'priority' => $t->priority,
                'instruction' => $t->instruction,
                'price' => (float) $t->price,
            ]),
            'created_by' => $paraclinicRequest->createdBy?->name,
            'created_at' => \Carbon\Carbon::parse($paraclinicRequest->created_at)->format('d-m-Y H:i'),
            'updated_at' => \Carbon\Carbon::parse($paraclinicRequest->updated_at)->format('d-m-Y H:i'),
        ]);
    }

    public function store(StoreParaclinicRequest $request)
    {
        $requestNumber = DB::transaction(function () use ($request) {
            $today = now()->startOfDay();
            $count = ParaClinicRequest::whereDate('created_at', $today)->lockForUpdate()->count() + 1;
            return 'PARA-'.$today->format('Ymd').'-'.str_pad($count, 4, '0', STR_PAD_LEFT);
        });

        $data = $request->safe()->except(['tests']);
        $data['fee'] = (float) ($data['fee'] ?? 0);
        $data['request_date'] = \Carbon\Carbon::createFromFormat('d-m-Y H:i', $data['request_date'])->format('Y-m-d H:i');

        $paraclinicRequest = ParaclinicRequest::create(array_merge($data, [
            'request_number' => $requestNumber,
        ]));

        foreach ($request->input('tests', []) as $test) {
            $diagnosticTest = DiagnosticTest::find($test['diagnostic_test_id']);

            $paraclinicRequest->tests()->create([
                'diagnostic_test_id' => $diagnosticTest?->id,
                'test_category' => 'Laboratory',
                'test_name' => $diagnosticTest?->name ?? '',
                'price' => (float) ($diagnosticTest?->price ?? 0),
                'priority' => $test['priority'],
                'instruction' => $test['instruction'] ?? null,
            ]);
        }

        return back()->with('success', 'Paraclinic request created.');
    }

    public function update(UpdateParaclinicRequest $request, ParaclinicRequest $paraclinicRequest)
    {
        $data = $request->safe()->except(['tests']);
        $data['fee'] = (float) ($data['fee'] ?? 0);
        $data['request_date'] = \Carbon\Carbon::createFromFormat('d-m-Y H:i', $data['request_date'])->format('Y-m-d H:i');

        $paraclinicRequest->update($data);

        $paraclinicRequest->tests()->delete();
        foreach ($request->input('tests', []) as $test) {
            $diagnosticTest = DiagnosticTest::find($test['diagnostic_test_id']);

            $paraclinicRequest->tests()->create([
                'diagnostic_test_id' => $diagnosticTest?->id,
                'test_category' => 'Laboratory',
                'test_name' => $diagnosticTest?->name ?? '',
                'price' => (float) ($diagnosticTest?->price ?? 0),
                'priority' => $test['priority'],
                'instruction' => $test['instruction'] ?? null,
            ]);
        }

        return back()->with('success', 'Paraclinic request updated.');
    }

    public function destroy(ParaclinicRequest $paraclinicRequest)
    {
        $paraclinicRequest->delete();

        return back()->with('success', 'Paraclinic request deleted.');
    }
}
