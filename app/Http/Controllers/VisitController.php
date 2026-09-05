<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Visit;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VisitController extends Controller
{
    public function store(Patient $patient)
    {
        if ($patient->visits()->where('status', 'active')->exists()) {
            return back()->with('error', 'This patient already has an active visit. Close it before starting a new one.');
        }

        try {
            $visit = DB::transaction(fn () => $patient->visits()->create([
                'type' => 'OPD',
                'status' => 'active',
                'created_by' => auth()->id(),
            ]));
        } catch (QueryException $exception) {
            if (str_contains($exception->getMessage(), 'visits_one_active_per_patient')) {
                return back()->with('error', 'This patient already has an active visit. Close it before starting a new one.');
            }

            throw $exception;
        }

        return redirect()->route('patients.show', [
            'patient' => $patient,
            'visit' => $visit->id,
        ])->with('success', 'New visit started.');
    }

    public function show(Visit $visit)
    {
        $visit->load([
            'patient',
            'createdBy',
            'consultations.createdBy',
            'medicationOrders.medicine',
            'medicationOrders.createdBy',
            'prescriptions.items.medicine',
            'prescriptions.items.unit',
            'prescriptions.createdBy',
            'surveillance.createdBy',
            'paraclinicRequests' => fn ($q) => $q->with(['doctor', 'tests']),
        ]);

        return Inertia::render('visits/show', [
            'visit' => [
                'id' => $visit->id,
                'patient_id' => $visit->patient_id,
                'type' => $visit->type,
                'status' => $visit->status,
                'visit_date' => $visit->visit_date,
                'created_by' => $visit->createdBy?->name,
                'created_at' => $visit->created_at,
                'updated_at' => $visit->updated_at,
            ],
            'patient' => [
                'id' => $visit->patient->id,
                'khmer_first_name' => $visit->patient->khmer_first_name,
                'khmer_last_name' => $visit->patient->khmer_last_name,
                'first_name' => $visit->patient->first_name,
                'last_name' => $visit->patient->last_name,
                'phone_number' => $visit->patient->phone_number,
                'gender' => $visit->patient->gender,
            ],
            'consultations' => $visit->consultations->map(fn ($c) => [
                'id' => $c->id,
                'chief_complaint' => $c->chief_complaint,
                'diagnosis' => $c->diagnosis,
                'fee' => (float) $c->fee,
                'created_by' => $c->createdBy?->name,
                'created_at' => $c->created_at,
            ]),
            'medicationOrders' => $visit->medicationOrders->map(fn ($m) => [
                'id' => $m->id,
                'medicine' => $m->medicine?->name,
                'route' => $m->route,
                'dosage' => (float) $m->dosage,
                'unit' => $m->unit,
                'interval' => $m->interval,
                'duration' => $m->duration,
                'cycle_no' => $m->cycle_no,
                'status' => $m->status,
                'created_by' => $m->createdBy?->name,
                'created_at' => $m->created_at,
            ]),
            'prescriptions' => $visit->prescriptions->map(fn ($p) => [
                'id' => $p->id,
                'notes' => $p->notes,
                'created_by' => $p->createdBy?->name,
                'created_at' => $p->created_at,
                'items' => $p->items->map(fn ($i) => [
                    'id' => $i->id,
                    'medicine' => $i->medicine?->name,
                    'route' => $i->route,
                    'unit' => $i->unit?->name,
                    'morning' => $i->morning !== null ? (float) $i->morning : null,
                    'afternoon' => $i->afternoon !== null ? (float) $i->afternoon : null,
                    'evening' => $i->evening !== null ? (float) $i->evening : null,
                    'night' => $i->night !== null ? (float) $i->night : null,
                    'number_of_day' => $i->number_of_day,
                    'quantity' => $i->quantity ? (float) $i->quantity : null,
                    'notes' => $i->notes,
                ])->values(),
            ]),
            'surveillance' => $visit->surveillance->map(fn ($s) => [
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
            ]),
            'paraclinicRequests' => $visit->paraclinicRequests->map(fn ($r) => [
                'id' => $r->id,
                'request_number' => $r->request_number,
                'doctor' => $r->doctor?->name,
                'status' => $r->status,
                'tests_count' => $r->tests->count(),
                'created_at' => $r->created_at,
            ]),
        ]);
    }

    public function admit(Visit $visit)
    {
        abort_if($visit->status !== 'active', 403, 'Can only admit an active visit.');
        abort_if($visit->type === 'IPD', 403, 'Already admitted.');

        $visit->update(['type' => 'IPD']);

        return back()->with('success', 'Patient admitted to IPD.');
    }

    public function close(Visit $visit)
    {
        abort_if($visit->status !== 'active', 403, 'Visit is already closed.');

        $visit->update(['status' => 'closed']);

        return back()->with('success', 'Visit closed.');
    }
}
