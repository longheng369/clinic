<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\ParaclinicRequest;
use App\Models\Patient;
use App\Models\PatientAttachment;
use App\Models\Vaccine;
use App\Models\Visit;
use Carbon\Carbon;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        return Inertia::render('patients/index', [
            'patients' => Patient::latest()
                ->when($search, fn ($query) => $query
                    ->where('khmer_first_name', 'like', "%{$search}%")
                    ->orWhere('khmer_last_name', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%"))
                ->paginate(10)
                ->withQueryString(),
            'search' => $search,
        ]);
    }

    public function store(StorePatientRequest $request)
    {
        Patient::create(array_merge(
            $request->validated(),
            ['register_by' => auth()->id()]
        ));

        return redirect()->route('patients.index')
            ->with('success', 'Patient created.');
    }

    public function edit(Patient $patient)
    {
        return Inertia::render('patients/edit', [
            'patient' => $patient,
        ]);
    }

    public function show(Patient $patient)
    {
        $consultations = $patient->consultations()->with('recordedBy')->latest()->paginate(10)->withQueryString();

        $surveillances = $patient->surveillances()->with('recordedBy')->latest()->paginate(10)->withQueryString();

        $paraclinicRequests = $patient->paraclinicRequests()
            ->with(['doctor', 'tests'])
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($r) => [
                'id' => $r->id,
                'request_number' => $r->request_number,
                'doctor' => $r->doctor ? ['id' => $r->doctor->id, 'name' => $r->doctor->name] : null,
                'external_facility_name' => $r->external_facility_name,
                'request_date' => $r->request_date,
                'status' => $r->status,
                'payment_status' => $r->payment_status,
                'total_amount' => (float) $r->total_amount,
            ]);

        return Inertia::render('patients/show', [
            'patient' => $patient,
            'consultations' => $consultations->through(fn ($c) => [
                'id' => $c->id,
                'weight' => $c->weight ? (float) $c->weight : null,
                'chief_complaint' => $c->chief_complaint,
                'diagnosis' => $c->diagnosis,
                'fee' => $c->fee ? (float) $c->fee : null,
                'recorded_by' => $c->recordedBy?->name,
                'created_at' => $c->created_at,
            ]),
            'attachments' => $patient->attachments()->with('uploadedBy')->latest()->get(),
            'surveillances' => $surveillances->through(fn ($s) => [
                'id' => $s->id,
                'systolic' => $s->systolic,
                'diastolic' => $s->diastolic,
                'pulse' => $s->pulse,
                'temperature' => (float) $s->temperature,
                'rr' => $s->rr,
                'spo2' => $s->spo2,
                'o2_supply' => $s->o2_supply,
                'recorded_by' => $s->recordedBy?->name,
                'created_at' => $s->created_at,
            ]),
            'paraclinicRequests' => $paraclinicRequests,
            'medicationAdministrations' => Visit::where('patient_id', $patient->id)
                ->where('status', 'active')
                ->latest()
->first()
                ?->medicationAdministrations()
                ->with(['medicine', 'recordedBy'])
                ->latest()
                ->paginate(10)
                ->through(fn ($m) => [
                    'id' => $m->id,
                    'medicine' => $m->medicine ? ['id' => $m->medicine->id, 'name' => $m->medicine->name] : null,
                    'route' => $m->route,
                    'dosage' => (float) $m->dosage,
                    'unit' => $m->unit,
                    'interval' => $m->interval,
                    'status' => $m->status,
                    'notes' => $m->notes,
                    'recorded_by' => $m->recordedBy?->name,
                    'created_at' => $m->created_at,
                ])
                ?? ['data' => [], 'current_page' => 1, 'last_page' => 1, 'per_page' => 10, 'total' => 0, 'from' => null, 'to' => null],
            'vaccinations' => $patient->vaccinations()
                ->with(['vaccine', 'administeredBy'])
                ->latest()
                ->paginate(10)
                ->through(fn ($v) => [
                    'id' => $v->id,
                    'vaccine' => $v->vaccine ? ['id' => $v->vaccine->id, 'name' => $v->vaccine->name] : null,
                    'dose_number' => $v->dose_number,
                    'administered_date' => $v->administered_date,
                    'notes' => $v->notes,
                    'administered_by' => $v->administeredBy?->name,
                    'created_at' => $v->created_at,
                ]),
            'vaccines' => Vaccine::orderBy('name')->get(['id', 'name']),
            'vaccineCard' => Vaccine::orderBy('name')->get(['id', 'name', 'rules'])->map(fn ($v) => array_merge(
                ['vaccine' => ['id' => $v->id, 'name' => $v->name]],
                $patient->nextDoseForVaccine($v),
            )),
            'vaccinationAlerts' => Vaccine::orderBy('name')->get(['id', 'name', 'rules'])->map(fn ($v) => array_merge(
                ['vaccine' => ['id' => $v->id, 'name' => $v->name]],
                $patient->nextDoseForVaccine($v),
            ))->filter(fn ($item) => $item['next_dose_due_date'] !== null && Carbon::parse($item['next_dose_due_date'])->lte(Carbon::now()->addDays(7)))->values(),
            'medicines' => Medicine::orderBy('name')->get(['id', 'name']),
            'activeVisits' => Visit::where('patient_id', $patient->id)
                ->where('status', 'active')
                ->with('recordedBy')
                ->latest()
                ->get()
                ->map(fn ($v) => [
                    'id' => $v->id,
                    'type' => $v->type,
                    'visit_date' => $v->visit_date,
                    'recorded_by' => $v->recordedBy?->name,
                ]),
            'visitHistory' => Visit::where('patient_id', $patient->id)
                ->where('status', 'closed')
                ->with('recordedBy')
                ->latest()
                ->paginate(5)
                ->through(fn ($v) => [
                    'id' => $v->id,
                    'type' => $v->type,
                    'visit_date' => $v->visit_date,
                    'recorded_by' => $v->recordedBy?->name,
                    'closed_at' => $v->updated_at,
                ]),
        ]);
    }

    public function update(UpdatePatientRequest $request, Patient $patient)
    {
        $patient->update(array_merge(
            $request->validated(),
            ['last_modifier' => auth()->id()]
        ));

        return redirect()->route('patients.index')
            ->with('success', 'Patient updated.');
    }

    public function destroy(Patient $patient)
    {
        $patient->delete();

        return redirect()->route('patients.index')
            ->with('success', 'Patient deleted.');
    }

    public function uploadAttachment(Request $request, Patient $patient)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:20480'],
        ]);

        $file = $request->file('file');
        $path = $file->store('patient-attachments');

        $patient->attachments()->create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'uploaded_by' => auth()->id(),
        ]);

        return back()->with('success', 'File uploaded.');
    }

    public function deleteAttachment(Patient $patient, PatientAttachment $attachment)
    {
        Storage::delete($attachment->file_path);
        $attachment->delete();

        return back()->with('success', 'File deleted.');
    }

    public function viewAttachment(PatientAttachment $attachment)
    {
        abort_if(!Storage::exists($attachment->file_path), 404);

        return response()->stream(function () use ($attachment) {
            echo Storage::get($attachment->file_path);
        }, 200, [
            'Content-Type' => $attachment->file_type,
            'Content-Disposition' => 'inline; filename="'.$attachment->file_name.'"',
        ]);
    }
}
