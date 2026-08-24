<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreParaclinicRequest;
use App\Http\Requests\UpdateParaclinicRequest;
use App\Models\ParaclinicAttachment;
use App\Models\ParaclinicRequest;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ParaClinicRequestController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $paymentStatus = $request->query('payment_status');
        $patientId = $request->query('patient_id');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $requests = ParaclinicRequest::with(['patient', 'doctor', 'tests'])
            ->latest()
            ->when($search, fn ($q) => $q
                ->where('request_number', 'like', "%{$search}%")
                ->orWhereHas('patient', fn ($q) => $q
                    ->where('khmer_first_name', 'like', "%{$search}%")
                    ->orWhere('khmer_last_name', 'like', "%{$search}%")))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($paymentStatus, fn ($q) => $q->where('payment_status', $paymentStatus))
            ->when($patientId, fn ($q) => $q->where('patient_id', $patientId))
            ->when($dateFrom, fn ($q) => $q->whereDate('request_date', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('request_date', '<=', $dateTo))
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($r) => [
                'id' => $r->id,
                'request_number' => $r->request_number,
                'patient' => $r->patient ? [
                    'id' => $r->patient->id,
                    'khmer_first_name' => $r->patient->khmer_first_name,
                    'khmer_last_name' => $r->patient->khmer_last_name,
                ] : null,
                'doctor' => $r->doctor ? [
                    'id' => $r->doctor->id,
                    'name' => $r->doctor->name,
                ] : null,
                'external_facility_name' => $r->external_facility_name,
                'request_date' => $r->request_date,
                'status' => $r->status,
                'payment_status' => $r->payment_status,
                'total_amount' => (float) $r->total_amount,
                'tests_count' => $r->tests->count(),
            ]);

        $patient = $patientId ? Patient::find($patientId) : null;

        return Inertia::render('para-clinic-requests/index', [
            'requests' => $requests,
            'search' => $search,
            'filters' => [
                'status' => $status,
                'payment_status' => $paymentStatus,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'patient' => $patient ? [
                'id' => $patient->id,
                'khmer_first_name' => $patient->khmer_first_name,
                'khmer_last_name' => $patient->khmer_last_name,
            ] : null,
        ]);
    }

    public function store(StoreParaclinicRequest $request)
    {
        $today = now();
        $count = ParaclinicRequest::whereDate('created_at', $today)->count() + 1;
        $requestNumber = 'PARA-'.$today->format('Ymd').'-'.str_pad($count, 4, '0', STR_PAD_LEFT);

        $data = $request->safe()->except(['tests']);
        $data['subtotal'] = (float) ($data['subtotal'] ?? 0);
        $data['total_amount'] = (float) ($data['total_amount'] ?? 0);

        $paraclinicRequest = ParaclinicRequest::create(array_merge(
            $data,
            [
                'request_number' => $requestNumber,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]
        ));

        foreach ($request->input('tests', []) as $test) {
            $paraclinicRequest->tests()->create($test);
        }

        return redirect()->route('para-clinic-requests.index')
            ->with('success', 'Paraclinic request created.');
    }

    public function show(ParaclinicRequest $paraclinicRequest)
    {
        $paraclinicRequest->load([
            'patient',
            'doctor',
            'tests',
            'results.reviewedBy',
            'attachments.uploadedBy',
            'createdBy',
            'updatedBy',
        ]);

        return Inertia::render('para-clinic-requests/show', [
            'request' => [
                'id' => $paraclinicRequest->id,
                'request_number' => $paraclinicRequest->request_number,
                'patient' => $paraclinicRequest->patient ? [
                    'id' => $paraclinicRequest->patient->id,
                    'khmer_first_name' => $paraclinicRequest->patient->khmer_first_name,
                    'khmer_last_name' => $paraclinicRequest->patient->khmer_last_name,
                    'phone_number' => $paraclinicRequest->patient->phone_number,
                    'gender' => $paraclinicRequest->patient->gender,
                ] : null,
                'doctor' => $paraclinicRequest->doctor ? [
                    'id' => $paraclinicRequest->doctor->id,
                    'name' => $paraclinicRequest->doctor->name,
                ] : null,
                'visit_id' => $paraclinicRequest->visit_id,
                'external_facility_name' => $paraclinicRequest->external_facility_name,
                'request_date' => $paraclinicRequest->request_date,
                'clinical_reason' => $paraclinicRequest->clinical_reason,
                'provisional_diagnosis' => $paraclinicRequest->provisional_diagnosis,
                'notes' => $paraclinicRequest->notes,
                'status' => $paraclinicRequest->status,
                'subtotal' => (float) $paraclinicRequest->subtotal,
                'total_amount' => (float) $paraclinicRequest->total_amount,
                'payment_status' => $paraclinicRequest->payment_status,
                'payment_date' => $paraclinicRequest->payment_date,
                'tests' => $paraclinicRequest->tests->map(fn ($t) => [
                    'id' => $t->id,
                    'test_category' => $t->test_category,
                    'test_name' => $t->test_name,
                    'priority' => $t->priority,
                    'instruction' => $t->instruction,
                ]),
                'results' => $paraclinicRequest->results->map(fn ($r) => [
                    'id' => $r->id,
                    'result_date' => $r->result_date,
                    'result_summary' => $r->result_summary,
                    'doctor_interpretation' => $r->doctor_interpretation,
                    'reviewed_by' => $r->reviewedBy?->name,
                    'reviewed_at' => $r->reviewed_at,
                    'created_at' => $r->created_at,
                ]),
                'attachments' => $paraclinicRequest->attachments->map(fn ($a) => [
                    'id' => $a->id,
                    'file_name' => $a->file_name,
                    'file_path' => $a->file_path,
                    'mime_type' => $a->mime_type,
                    'file_size' => $a->file_size,
                    'uploaded_by' => $a->uploadedBy?->name,
                    'created_at' => $a->created_at,
                ]),
                'created_by' => $paraclinicRequest->createdBy?->name,
                'created_at' => $paraclinicRequest->created_at,
                'updated_at' => $paraclinicRequest->updated_at,
            ],
        ]);
    }

    public function update(UpdateParaclinicRequest $request, ParaclinicRequest $paraclinicRequest)
    {
        $data = $request->safe()->except(['tests']);
        $data['subtotal'] = (float) ($data['subtotal'] ?? 0);
        $data['total_amount'] = (float) ($data['total_amount'] ?? 0);

        $paraclinicRequest->update(array_merge(
            $data,
            ['updated_by' => auth()->id()]
        ));

        $paraclinicRequest->tests()->delete();
        foreach ($request->input('tests', []) as $test) {
            $paraclinicRequest->tests()->create($test);
        }

        return back()->with('success', 'Paraclinic request updated.');
    }

    public function destroy(ParaclinicRequest $paraclinicRequest)
    {
        $paraclinicRequest->delete();

        return redirect()->route('para-clinic-requests.index')
            ->with('success', 'Paraclinic request deleted.');
    }

    public function uploadAttachment(Request $request, ParaclinicRequest $paraclinicRequest)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:20480'],
        ]);

        $file = $request->file('file');
        $path = $file->store('paraclinic-attachments');

        $paraclinicRequest->attachments()->create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'uploaded_by' => auth()->id(),
        ]);

        return back()->with('success', 'File uploaded.');
    }

    public function deleteAttachment(ParaclinicRequest $paraclinicRequest, ParaclinicAttachment $attachment)
    {
        Storage::delete($attachment->file_path);
        $attachment->delete();

        return back()->with('success', 'File deleted.');
    }

    public function viewAttachment(ParaclinicAttachment $attachment)
    {
        abort_if(! Storage::exists($attachment->file_path), 404);

        return response()->stream(function () use ($attachment) {
            echo Storage::get($attachment->file_path);
        }, 200, [
            'Content-Type' => $attachment->mime_type,
            'Content-Disposition' => 'inline; filename="'.$attachment->file_name.'"',
        ]);
    }

    public function updateStatus(Request $request, ParaclinicRequest $paraclinicRequest)
    {
        $request->validate([
            'status' => ['required', 'in:Draft,Requested,Waiting Result,Result Received,Reviewed,Completed,Cancelled'],
        ]);

        $paraclinicRequest->update([
            'status' => $request->status,
            'updated_by' => auth()->id(),
        ]);

        return back()->with('success', 'Status updated to '.$request->status.'.');
    }

    public function storeResult(Request $request, ParaclinicRequest $paraclinicRequest)
    {
        $request->validate([
            'result_summary' => ['nullable', 'string'],
            'doctor_interpretation' => ['nullable', 'string'],
        ]);

        $paraclinicRequest->results()->create([
            'result_date' => now()->toDateString(),
            'result_summary' => $request->result_summary,
            'doctor_interpretation' => $request->doctor_interpretation,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        if ($paraclinicRequest->status === 'Waiting Result') {
            $paraclinicRequest->update(['status' => 'Result Received', 'updated_by' => auth()->id()]);
        }

        return back()->with('success', 'Result saved.');
    }

    public function searchDoctors(Request $request)
    {
        $q = $request->query('q');

        return User::where('name', 'like', "%{$q}%")
            ->limit(25)
            ->get(['id', 'name']);
    }

    public function searchPatients(Request $request)
    {
        $q = $request->query('q');

        return Patient::where('khmer_first_name', 'like', "%{$q}%")
            ->orWhere('khmer_last_name', 'like', "%{$q}%")
            ->orWhere('first_name', 'like', "%{$q}%")
            ->orWhere('last_name', 'like', "%{$q}%")
            ->orWhere('phone_number', 'like', "%{$q}%")
            ->limit(25)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => "{$p->khmer_first_name} {$p->khmer_last_name}",
            ]);
    }
}
