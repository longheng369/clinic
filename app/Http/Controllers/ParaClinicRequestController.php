<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreParaClinicRequest;
use App\Http\Requests\UpdateParaclinicRequest;
use App\Models\ParaClinicRequest;
use App\Models\DiagnosticTest;
use App\Models\ParaClinicRequestTest;
use Carbon\Carbon;
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
            'patient_id' => $paraClinicRequest->patient_id,
            'visit_id' => $paraClinicRequest->visit_id,
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
                'diagnostic_test_id' => $t->diagnostic_test_id,
                'test_name' => $t->test_name,
                'test_category' => $t->test_category,
                'price' => (float) $t->price,
            ]),
            'created_by' => $paraClinicRequest->createdBy?->name,
            'created_at' => \Carbon\Carbon::parse($paraClinicRequest->created_at)->format('d-m-Y H:i'),
            'updated_at' => \Carbon\Carbon::parse($paraClinicRequest->updated_at)->format('d-m-Y H:i'),
        ]);
    }

    public function store(StoreParaClinicRequest $request)
    {
        $data = $request->safe()->except(['tests']);

        $data['fee'] = (float) ($data['fee'] ?? 0);
        $data['request_date'] = Carbon::createFromFormat(
            'd-m-Y H:i',
            $data['request_date']
        )->format('Y-m-d H:i');

        $diagnosticTestIds = $request->input('tests', []);

        DB::transaction(function () use ($data, $diagnosticTestIds) {
            $today = now()->startOfDay();

            $count = ParaClinicRequest::whereDate('created_at', $today)
                    ->lockForUpdate()
                    ->count() + 1;

            $data['request_number'] = 'PARA-' .
                $today->format('Ymd') . '-' .
                str_pad($count, 4, '0', STR_PAD_LEFT);

            $paraClinicRequest = ParaClinicRequest::create($data);

            $this->syncTests($paraClinicRequest, $diagnosticTestIds);
        });

        return back()->with('success', 'Paraclinic request created.');
    }

    public function update(UpdateParaclinicRequest $request, ParaclinicRequest $paraclinicRequest)
    {
        $data = $request->safe()->except(['tests']);
        $data['fee'] = (float) ($data['fee'] ?? 0);
        $data['request_date'] = \Carbon\Carbon::createFromFormat('d-m-Y H:i', $data['request_date'])->format('Y-m-d H:i');

        $diagnosticTestIds = $request->input('tests', []);

        DB::transaction(function () use ($paraclinicRequest, $data, $diagnosticTestIds) {
            $paraclinicRequest->update($data);
            $paraclinicRequest->tests()->delete();

            $this->syncTests($paraclinicRequest, $diagnosticTestIds);
        });

        return back()->with('success', 'Paraclinic request updated.');
    }

    public function destroy(ParaclinicRequest $paraClinicRequest)
    {
        $paraClinicRequest->delete();

        return back()->with('success', 'Paraclinic request deleted.');
    }

    /**
     * Snapshot the selected diagnostic tests onto the request.
     */
    private function syncTests(ParaClinicRequest $paraClinicRequest, array $diagnosticTestIds): void
    {
        $diagnosticTests = DiagnosticTest::whereIn('id', $diagnosticTestIds)->get();

        foreach ($diagnosticTests as $diagnosticTest) {
            $paraClinicRequest->tests()->create([
                'diagnostic_test_id' => $diagnosticTest->id,
                'test_category' => 'Laboratory',
                'test_name' => $diagnosticTest->name,
                'price' => (float) $diagnosticTest->price,
            ]);
        }
    }
}
