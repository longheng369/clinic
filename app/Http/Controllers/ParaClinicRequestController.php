<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreParaclinicRequest;
use App\Http\Requests\UpdateParaclinicRequest;
use App\Models\ParaclinicRequest;
use App\Models\DiagnosticTest;
use Illuminate\Support\Facades\DB;

class ParaClinicRequestController extends Controller
{
    public function store(StoreParaclinicRequest $request)
    {
        $requestNumber = DB::transaction(function () use ($request) {
            $today = now()->startOfDay();
            $count = ParaclinicRequest::whereDate('created_at', $today)->lockForUpdate()->count() + 1;
            return 'PARA-'.$today->format('Ymd').'-'.str_pad($count, 4, '0', STR_PAD_LEFT);
        });

        $data = $request->safe()->except(['tests']);
        $data['fee'] = (float) ($data['fee'] ?? 0);
        $data['request_date'] = \Carbon\Carbon::createFromFormat('d-m-Y', $data['request_date'])->format('Y-m-d');

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
        $data['request_date'] = \Carbon\Carbon::createFromFormat('d-m-Y', $data['request_date'])->format('Y-m-d');

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
