<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Patient;
use App\Http\Requests\StoreConsultationRequest;
use App\Http\Requests\UpdateConsultationRequest;
use Inertia\Inertia;

class ConsultationController extends Controller
{
    public function index(Patient $patient)
    {
        return $patient->consultations()
            ->with('recordedBy')
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($c) => [
                'id' => $c->id,
                'weight' => $c->weight ? (float) $c->weight : null,
                'chief_complaint' => $c->chief_complaint,
                'diagnosis' => $c->diagnosis,
                'fee' => $c->fee ? (float) $c->fee : null,
                'recorded_by' => $c->recordedBy?->name,
                'created_at' => $c->created_at,
            ]);
    }

    public function create(Patient $patient)
    {
        $activeVisits = $patient->visits()->where('status', 'active')->latest()->get();

        return Inertia::render('patients/partials/tab/consultations/create', [
            'patient' => $patient,
            'activeVisits' => $activeVisits->map(fn ($v) => [
                'id' => $v->id,
                'type' => $v->type,
                'visit_date' => $v->visit_date,
            ]),
        ]);
    }

    public function store(StoreConsultationRequest $request, Patient $patient)
    {
        $visit = $patient->visits()->create([
            'type' => 'OPD',
            'recorded_by' => auth()->id(),
        ]);

        $patient->consultations()->create(array_merge(
            $request->validated(),
            ['visit_id' => $visit->id, 'recorded_by' => auth()->id()]
        ));

        return redirect()->route('patients.show', $patient->id)
            ->with('success', 'Consultation created.');
    }

    public function show(Patient $patient, Consultation $consultation)
    {
        $consultation->load('recordedBy');

        return Inertia::render('patients/partials/tab/consultations/show', [
            'patient' => $patient,
            'consultation' => [
                'id' => $consultation->id,
                'patient_id' => $consultation->patient_id,
                'weight' => $consultation->weight ? (float) $consultation->weight : null,
                'chief_complaint' => $consultation->chief_complaint,
                'respiratory_system_symptoms' => $consultation->respiratory_system_symptoms ?? [],
                'respiratory_system_others_note' => $consultation->respiratory_system_others_note,
                'cardiovascular_symptoms' => $consultation->cardiovascular_symptoms ?? [],
                'cardiovascular_others_note' => $consultation->cardiovascular_others_note,
                'neurological_symptoms' => $consultation->neurological_symptoms ?? [],
                'neurological_others_note' => $consultation->neurological_others_note,
                'musculoskeletal_symptoms' => $consultation->musculoskeletal_symptoms ?? [],
                'musculoskeletal_others_note' => $consultation->musculoskeletal_others_note,
                'digestive_symptoms' => $consultation->digestive_symptoms ?? [],
                'digestive_others_note' => $consultation->digestive_others_note,
                'renal_reproductive_symptoms' => $consultation->renal_reproductive_symptoms ?? [],
                'renal_reproductive_others_note' => $consultation->renal_reproductive_others_note,
                'skin_symptoms' => $consultation->skin_symptoms ?? [],
                'skin_others_note' => $consultation->skin_others_note,
                'eye_symptoms' => $consultation->eye_symptoms ?? [],
                'eye_others_note' => $consultation->eye_others_note,
                'ear_symptoms' => $consultation->ear_symptoms ?? [],
                'ear_others_note' => $consultation->ear_others_note,
                'nose_symptoms' => $consultation->nose_symptoms ?? [],
                'nose_others_note' => $consultation->nose_others_note,
                'throat_symptoms' => $consultation->throat_symptoms ?? [],
                'throat_others_note' => $consultation->throat_others_note,
                'psycology_symptoms' => $consultation->psycology_symptoms ?? [],
                'psycology_others_note' => $consultation->psycology_others_note,
                'diagnosis' => $consultation->diagnosis,
                'note' => $consultation->note,
                'fee' => $consultation->fee ? (float) $consultation->fee : null,
                'recorded_by' => $consultation->recordedBy?->name,
                'created_at' => $consultation->created_at,
            ],
        ]);
    }

    public function edit(Patient $patient, Consultation $consultation)
    {
        $consultation->load('recordedBy');

        return Inertia::render('patients/partials/tab/consultations/edit', [
            'patient' => $patient,
            'consultation' => [
                'id' => $consultation->id,
                'patient_id' => $consultation->patient_id,
                'weight' => $consultation->weight ? (float) $consultation->weight : null,
                'chief_complaint' => $consultation->chief_complaint,
                'respiratory_system_symptoms' => $consultation->respiratory_system_symptoms ?? [],
                'respiratory_system_others_note' => $consultation->respiratory_system_others_note,
                'cardiovascular_symptoms' => $consultation->cardiovascular_symptoms ?? [],
                'cardiovascular_others_note' => $consultation->cardiovascular_others_note,
                'neurological_symptoms' => $consultation->neurological_symptoms ?? [],
                'neurological_others_note' => $consultation->neurological_others_note,
                'musculoskeletal_symptoms' => $consultation->musculoskeletal_symptoms ?? [],
                'musculoskeletal_others_note' => $consultation->musculoskeletal_others_note,
                'digestive_symptoms' => $consultation->digestive_symptoms ?? [],
                'digestive_others_note' => $consultation->digestive_others_note,
                'renal_reproductive_symptoms' => $consultation->renal_reproductive_symptoms ?? [],
                'renal_reproductive_others_note' => $consultation->renal_reproductive_others_note,
                'skin_symptoms' => $consultation->skin_symptoms ?? [],
                'skin_others_note' => $consultation->skin_others_note,
                'eye_symptoms' => $consultation->eye_symptoms ?? [],
                'eye_others_note' => $consultation->eye_others_note,
                'ear_symptoms' => $consultation->ear_symptoms ?? [],
                'ear_others_note' => $consultation->ear_others_note,
                'nose_symptoms' => $consultation->nose_symptoms ?? [],
                'nose_others_note' => $consultation->nose_others_note,
                'throat_symptoms' => $consultation->throat_symptoms ?? [],
                'throat_others_note' => $consultation->throat_others_note,
                'psycology_symptoms' => $consultation->psycology_symptoms ?? [],
                'psycology_others_note' => $consultation->psycology_others_note,
                'diagnosis' => $consultation->diagnosis,
                'note' => $consultation->note,
                'fee' => $consultation->fee ? (float) $consultation->fee : null,
                'recorded_by' => $consultation->recordedBy?->name,
                'created_at' => $consultation->created_at,
            ],
        ]);
    }

    public function update(UpdateConsultationRequest $request, Patient $patient, Consultation $consultation)
    {
        $consultation->update($request->validated());

        return redirect()->route('patients.show', $patient)
            ->with('success', 'Consultation updated.');
    }

    public function destroy(Patient $patient, Consultation $consultation)
    {
        $consultation->delete();

        return back()->with('success', 'Consultation deleted.');
    }
}
