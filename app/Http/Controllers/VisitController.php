<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use Inertia\Inertia;

class VisitController extends Controller
{
    public function show(Visit $visit)
    {
        $visit->load([
            'patient',
            'createdBy',
            'consultations.createdBy',
            'medicationAdministrations.medicine',
            'medicationAdministrations.createdBy',
            'prescriptions.items.medicine',
            'prescriptions.createdBy',
            'surveillances.createdBy',
            'paraclinicRequests' => fn ($q) => $q->with(['doctor', 'tests']),
        ]);

        return Inertia::render('visits/show', [
            'visit' => [
                'id' => $visit->id,
                'patient_id' => $visit->patient_id,
                'type' => $visit->type,
                'status' => $visit->status,
                'visit_date' => $visit->visit_date,
                'recorded_by' => $visit->createdBy?->name,
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
                'recorded_by' => $c->createdBy?->name,
                'created_at' => $c->created_at,
            ]),
            'medicationAdministrations' => $visit->medicationAdministrations->map(fn ($m) => [
                'id' => $m->id,
                'medicine' => $m->medicine?->name,
                'route' => $m->route,
                'dosage' => (float) $m->dosage,
                'unit' => $m->unit,
                'interval' => $m->interval,
                'duration' => $m->duration,
                'cycle_no' => $m->cycle_no,
                'status' => $m->status,
                'recorded_by' => $m->createdBy?->name,
                'created_at' => $m->created_at,
            ]),
            'prescriptions' => $visit->prescriptions->map(fn ($p) => [
                'id' => $p->id,
                'notes' => $p->notes,
                'recorded_by' => $p->createdBy?->name,
                'created_at' => $p->created_at,
                'items' => $p->items->map(fn ($i) => [
                    'id' => $i->id,
                    'medicine' => $i->medicine?->name,
                    'route' => $i->route,
                    'dosage' => (float) $i->dosage,
                    'unit' => $i->unit,
                    'frequency' => $i->frequency,
                    'duration_days' => $i->duration_days,
                    'quantity' => $i->quantity ? (float) $i->quantity : null,
                    'notes' => $i->notes,
                ])->values(),
            ]),
            'surveillances' => $visit->surveillances->map(fn ($s) => [
                'id' => $s->id,
                'systolic' => $s->systolic,
                'diastolic' => $s->diastolic,
                'pulse' => $s->pulse,
                'temperature' => (float) $s->temperature,
                'rr' => $s->rr,
                'spo2' => $s->spo2,
                'o2_supply' => $s->o2_supply,
                'recorded_by' => $s->createdBy?->name,
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
