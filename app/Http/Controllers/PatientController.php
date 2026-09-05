<?php

namespace App\Http\Controllers;

use App\Helpers\GazetteerHelper;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Medicine;
use App\Models\MedicineInstruction;
use App\Models\MedicationRoute;
use App\Models\Patient;
use App\Models\PatientAttachment;
use App\Models\Unit;
use App\Models\Vaccine;
use App\Models\Visit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        return Inertia::render('patients/index', [
            'patients' => Patient::query()
                ->latest()
                ->when($search, fn ($query) => $query
                    ->where('khmer_first_name', 'like', "%{$search}%")
                    ->orWhere('khmer_last_name', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%"))
                ->paginate(20)
                ->withQueryString(),
            'search' => $search,
        ]);
    }

    public function store(StorePatientRequest $request)
    {
        Patient::create($request->validated());

        return redirect()->route('patients.index')
            ->with('success', 'Patient created.');
    }

    public function show(Request $request, Patient $patient)
    {
        $selectedVisitId = $request->query('visit');
        $gazetteer = GazetteerHelper::getGazetteer($patient->address !== null ? (string) $patient->address : null);

        $patient->province = [
            'name_in_khmer' => $gazetteer['province']?->name_in_khmer,
            'name_in_latin' => $gazetteer['province']?->name_in_latin,
            'code' => $gazetteer['province']?->code,
        ];
        $patient->district = [
            'name_in_khmer' => $gazetteer['district']?->name_in_khmer,
            'name_in_latin' => $gazetteer['district']?->name_in_latin,
            'code' => $gazetteer['district']?->code,
        ];
        $patient->commune = [
            'name_in_khmer' => $gazetteer['commune']?->name_in_khmer,
            'name_in_latin' => $gazetteer['commune']?->name_in_latin,
            'code' => $gazetteer['commune']?->code,
        ];
        $patient->village = [
            'name_in_khmer' => $gazetteer['village']?->name_in_khmer,
            'name_in_latin' => $gazetteer['village']?->name_in_latin,
            'code' => $gazetteer['village']?->code,
        ];

        $allVisits = $patient->visits()->with('createdBy')->latest()->get();

        $selectedVisit = $selectedVisitId
            ? $patient->visits()
                ->with('createdBy')
                ->whereKey($selectedVisitId)
                ->first()
            : null;

        $selectedVisit ??= $patient->visits()
            ->with('createdBy')
            ->where('status', 'active')
            ->latest()
            ->first();

        $selectedVisitId = $selectedVisit?->id;

        return Inertia::render('patients/show', [
            'patient' => $patient,
            'selectedVisit' => $selectedVisit,
            'allVisits' => $allVisits,
            'consultations' => Inertia::defer(function () use ($patient, $selectedVisitId) {
                return $patient->consultations()
                    ->with('createdBy')
                    ->when($selectedVisitId, fn ($q) => $q->where('visit_id', $selectedVisitId))
                    ->latest()
                    ->paginate(10)
                    ->withQueryString()
                    ->through(fn ($c) => [
                        'id' => $c->id,
                        'weight' => $c->weight ? (float) $c->weight : null,
                        'chief_complaint' => $c->chief_complaint,
                        'diagnosis' => $c->diagnosis,
                        'fee' => $c->fee ? (float) $c->fee : null,
                        'created_by' => $c->createdBy?->name,
                        'created_at' => $c->created_at,
                    ]);
            }, 'consultations'),
            'surveillance' => Inertia::defer(function () use ($patient, $selectedVisitId) {
                return $patient->surveillance()
                    ->with('createdBy')
                    ->when($selectedVisitId, fn ($q) => $q->where('visit_id', $selectedVisitId))
                    ->latest()
                    ->paginate(10)
                    ->withQueryString()
                    ->through(fn ($s) => [
                        'id' => $s->id,
                        'systolic' => $s->systolic,
                        'diastolic' => $s->diastolic,
                        'pulse' => $s->pulse,
                        'temperature' => (float) $s->temperature,
                        'rr' => $s->rr,
                        'spo2' => $s->spo2,
                        'o2_supply' => $s->o2_supply,
                        'note' => $s->note,
                        'created_by' => $s->createdBy?->name,
                        'created_at' => $s->created_at,
                    ]);
            }, 'surveillance'),
            'paraClinicRequests' => Inertia::defer(function () use ($patient, $selectedVisitId) {
                return $patient->paraClinicRequests()
                    ->with(['doctor', 'tests'])
                    ->when($selectedVisitId, fn ($q) => $q->where('visit_id', $selectedVisitId))
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
                        'fee' => (float) $r->fee,
                    ]);
            }, 'paraClinicRequests'),
            'medicationOrders' => Inertia::defer(function () use ($selectedVisit) {
                if (! $selectedVisit) {
                    return ['data' => [], 'current_page' => 1, 'last_page' => 1, 'per_page' => 10, 'total' => 0, 'from' => 0, 'to' => 0];
                }

                return $selectedVisit->medicationOrders()
                    ->with(['medicine', 'createdBy', 'administrations' => fn ($q) => $q->orderBy('scheduled_at')])
                    ->latest()
                    ->paginate(10)
                    ->withQueryString()
                    ->through(fn ($m) => [
                        'id' => $m->id,
                        'medicine' => $m->medicine ? ['id' => $m->medicine->id, 'name' => $m->medicine->name, 'unit_price' => $m->medicine->unit_price ? (float) $m->medicine->unit_price : null] : null,
                        'route' => $m->route,
                        'dosage' => (float) $m->dosage,
                        'unit' => $m->unit,
                        'interval' => $m->interval,
                        'duration' => $m->duration,
                        'cycle_no' => $m->cycle_no,
                        'status' => $m->status,
                        'starts_at' => $m->starts_at?->toISOString(),
                        'notes' => $m->notes,
                        'created_by' => $m->createdBy?->name,
                        'created_at' => $m->created_at,
                        'administrations' => $m->administrations->map(fn ($a) => [
                            'id' => $a->id,
                            'cycle_no' => $a->cycle_no,
                            'administration_no' => $a->administration_no,
                            'total_administrations' => $a->total_administrations,
                            'scheduled_at' => $a->scheduled_at->toISOString(),
                            'administered_at' => $a->administered_at?->toISOString(),
                            'status' => $a->status,
                            'administered_by' => $a->administeredBy?->name,
                            'unit_price' => $a->unit_price ? (float) $a->unit_price : null,
                            'reason' => $a->reason,
                            'note' => $a->note,
                        ])->values(),
                    ]);
            }, 'medication'),
            'activeVisits' => Inertia::defer(function () use ($patient) {
                return Visit::where('patient_id', $patient->id)
                    ->where('status', 'active')
                    ->with('createdBy')
                    ->latest()
                    ->get()
                    ->map(fn ($v) => [
                        'id' => $v->id,
                        'type' => $v->type,
                        'visit_date' => $v->visit_date,
                        'created_by' => $v->createdBy?->name,
                    ]);
            }, 'medication'),
            'medicines' => Inertia::defer(fn () => Medicine::with('unit')->orderBy('name')->get(['id', 'name', 'unit_id', 'dosage']), 'medicines'),
            'units' => Inertia::defer(fn () => Unit::orderBy('name')->get(['id', 'name']), 'medicines'),
            'medicationRoutes' => Inertia::defer(fn () => MedicationRoute::orderBy('name')->get(['id', 'code', 'name']), 'medicines'),
            'medicineInstructions' => Inertia::defer(fn () => MedicineInstruction::orderBy('name')->get(['id', 'code', 'name']), 'medicines'),
            'prescription' => Inertia::defer(function () use ($selectedVisit) {
                if (! $selectedVisit) {
                    return null;
                }

                $prescription = $selectedVisit->prescriptions()
                    ->with(['items.medicine', 'items.unit', 'createdBy'])
                    ->latest()
                    ->first();

                if (! $prescription) {
                    return null;
                }

                return [
                    'id' => $prescription->id,
                    'visit_id' => $prescription->visit_id,
                    'notes' => $prescription->notes,
                    'created_by' => $prescription->createdBy?->name,
                    'created_at' => $prescription->created_at,
                    'items' => $prescription->items->map(fn ($i) => [
                        'id' => $i->id,
                        'medicine' => $i->medicine ? ['id' => $i->medicine->id, 'name' => $i->medicine->name] : null,
                        'route' => $i->route,
                        'unit' => $i->unit ? ['id' => $i->unit->id, 'name' => $i->unit->name] : null,
                        'morning' => $i->morning !== null ? (float) $i->morning : null,
                        'afternoon' => $i->afternoon !== null ? (float) $i->afternoon : null,
                        'evening' => $i->evening !== null ? (float) $i->evening : null,
                        'night' => $i->night !== null ? (float) $i->night : null,
                        'number_of_day' => $i->number_of_day,
                        'quantity' => $i->quantity ? (float) $i->quantity : null,
                        'notes' => $i->notes,
                        'instruction' => $i->instruction,
                    ])->values(),
                ];
            }, 'prescription'),
            'consultationDiagnoses' => Inertia::defer(function () use ($selectedVisit) {
                if (! $selectedVisit) {
                    return [];
                }

                return $selectedVisit->consultations()
                    ->whereNotNull('diagnosis')
                    ->where('diagnosis', '!=', '')
                    ->latest()
                    ->pluck('diagnosis')
                    ->unique()
                    ->values();
            }, 'prescription'),
            'vaccinations' => Inertia::defer(function () use ($patient) {
                return $patient->vaccinations()
                    ->with(['vaccine', 'administeredBy'])
                    ->latest()
                    ->paginate(10)
                    ->withQueryString()
                    ->through(fn ($v) => [
                        'id' => $v->id,
                        'vaccine' => $v->vaccine ? ['id' => $v->vaccine->id, 'name' => $v->vaccine->name] : null,
                        'dose_number' => $v->dose_number,
                        'administered_date' => $v->administered_date,
                        'notes' => $v->notes,
                        'administered_by' => $v->administeredBy?->name,
                        'created_at' => $v->created_at,
                    ]);
            }, 'vaccination'),
            'vaccines' => Inertia::defer(fn () => Vaccine::orderBy('name')->get(['id', 'name']), 'vaccination'),
            'vaccineCard' => Inertia::defer(function () use ($patient) {
                return Vaccine::orderBy('name')->get(['id', 'name', 'rules'])->map(fn ($v) => array_merge(
                    ['vaccine' => ['id' => $v->id, 'name' => $v->name]],
                    $patient->nextDoseForVaccine($v),
                ));
            }, 'vaccination'),
            'vaccinationAlerts' => Inertia::defer(function () use ($patient) {
                return Vaccine::orderBy('name')->get(['id', 'name', 'rules'])->map(fn ($v) => array_merge(
                    ['vaccine' => ['id' => $v->id, 'name' => $v->name]],
                    $patient->nextDoseForVaccine($v),
                ))->filter(fn ($item) => $item['next_dose_due_date'] !== null && Carbon::parse($item['next_dose_due_date'])->lte(Carbon::now()->addDays(7)))->values();
            }, 'vaccination'),
            'attachments' => Inertia::defer(function () use ($patient, $selectedVisit) {
                return $selectedVisit
                    ? $selectedVisit->attachments()->with('uploadedBy')->latest()->get()
                    : $patient->attachments()->with('uploadedBy')->latest()->get();
            }, 'attachment'),
            'billing' => Inertia::defer(fn () => $selectedVisit?->billingSummary(), 'billing'),
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
            'file' => [
                'required',
                'file',
                'max:20480',
                'mimes:jpg,jpeg,png,gif,webp,bmp,pdf,doc,docx,xls,xlsx,ppt,pptx,csv,txt,zip',
            ],
            'visit_id' => ['nullable', 'integer', 'exists:visits,id'],
        ], [
            'file.required' => 'Please choose a file to upload.',
            'file.max' => 'The file is too large. Maximum allowed size is 20 MB.',
            'file.mimes' => 'This file type is not supported. Allowed types: images (JPG, PNG, GIF, WEBP, BMP), PDF, Office documents (Word, Excel, PowerPoint), CSV, TXT, and ZIP.',
        ]);

        $file = $request->file('file');
        $path = $file->store('patient-attachments');

        $patient->attachments()->create([
            'visit_id' => $request->input('visit_id'),
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
        abort_if(! Storage::exists($attachment->file_path), 404);

        return response()->stream(function () use ($attachment) {
            echo Storage::get($attachment->file_path);
        }, 200, [
            'Content-Type' => $attachment->file_type,
            'Content-Disposition' => 'inline; filename="'.$attachment->file_name.'"',
        ]);
    }

    public function serverAutocomplete(Request $request)
    {
        $q = $request->query('search');

        return Patient::where('khmer_first_name', 'like', "%{$q}%")
            ->orWhere('khmer_last_name', 'like', "%{$q}%")
            ->orWhere('first_name', 'like', "%{$q}%")
            ->orWhere('last_name', 'like', "%{$q}%")
            ->orWhere('phone_number', 'like', "%{$q}%")
            ->limit(25)
            ->get()
            ->map(fn ($p) => [
                'value' => $p->id,
                'label' => "{$p->khmer_first_name} {$p->khmer_last_name}",
            ]);
    }
}
