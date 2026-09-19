<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreParaClinicRequest;
use App\Http\Requests\UpdateParaClinicRequest;
use App\Models\ParaClinicRequest;
use App\Models\DiagnosticTest;
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

        $data['request_date'] = Carbon::createFromFormat(
            'd-m-Y H:i',
            $data['request_date']
        )->format('Y-m-d H:i');

        $diagnosticTestIds = $request->input('tests', []);

        DB::transaction(function () use (&$data, $diagnosticTestIds) {
            $today = now()->startOfDay();
            $prefix = 'PARA-' . $today->format('Ymd') . '-';

            $lastSequence = ParaClinicRequest::where('request_number', 'like', $prefix . '%')
                    ->lockForUpdate()
                    ->pluck('request_number')
                    ->map(fn ($n) => (int) substr($n, -4))
                    ->push(0)
                    ->max() + 1;

            $data['request_number'] = $prefix . str_pad($lastSequence, 4, '0', STR_PAD_LEFT);

            $paraClinicRequest = ParaClinicRequest::create($data);

            $this->syncTests($paraClinicRequest, $diagnosticTestIds);

            $data['fee'] = $paraClinicRequest->tests()->sum('price');
            $paraClinicRequest->update(['fee' => $data['fee']]);
        });

        return back()->with('success', 'Paraclinic request created.');
    }

    public function update(UpdateParaClinicRequest $request, ParaClinicRequest $paraClinicRequest)
    {
        $data = $request->safe()->except(['tests']);
        $data['request_date'] = Carbon::createFromFormat('d-m-Y H:i', $data['request_date'])->format('Y-m-d H:i');

        $diagnosticTestIds = $request->input('tests', []);

        DB::transaction(function () use ($paraClinicRequest, $data, $diagnosticTestIds) {
            $paraClinicRequest->update($data);

            $this->syncTests($paraClinicRequest, $diagnosticTestIds);

            $fee = $paraClinicRequest->tests()->sum('price');
            $paraClinicRequest->update(['fee' => $fee]);
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
        $paraClinicRequest->tests()->delete();

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
