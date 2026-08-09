<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientVaccinationRequest;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\PatientVaccination;
use App\Models\Vaccine;
use Illuminate\Http\Request;

class PatientVaccinationController extends Controller
{
    public function index(Request $request, Patient $patient)
    {
        $perPage = $request->query('per_page', 10);

        return $patient->vaccinations()
            ->with(['vaccine', 'administeredBy'])
            ->latest()
            ->paginate($perPage)
            ->through(fn ($v) => [
                'id' => $v->id,
                'vaccine' => $v->vaccine ? ['id' => $v->vaccine->id, 'name' => $v->vaccine->name] : null,
                'dose_number' => $v->dose_number,
                'administered_date' => $v->administered_date,
                'notes' => $v->notes,
                'administered_by' => $v->administeredBy?->name,
                'created_at' => $v->created_at,
            ]);
    }

    public function store(StorePatientVaccinationRequest $request, Patient $patient)
    {
        $vaccination = $patient->vaccinations()->create(array_merge(
            $request->validated(),
            ['administered_by' => auth()->id()]
        ));

        $vaccine = Vaccine::find($request->vaccine_id);
        if ($vaccine) {
            $nextDose = $patient->nextDoseForVaccine($vaccine);

            if ($nextDose['next_dose_number'] && $nextDose['next_dose_due_date']) {
                $hasAppointment = Appointment::where('patient_id', $patient->id)
                    ->where('appointment_date', $nextDose['next_dose_due_date'])
                    ->where('type', 'vaccination')
                    ->where('status', 'scheduled')
                    ->exists();

                if (! $hasAppointment) {
                    Appointment::create([
                        'patient_id' => $patient->id,
                        'appointment_date' => $nextDose['next_dose_due_date'],
                        'type' => 'vaccination',
                        'notes' => "{$vaccine->name} Dose {$nextDose['next_dose_number']} follow-up (First dose: {$vaccination->administered_date})",
                        'created_by' => auth()->id(),
                    ]);
                }
            }
        }

        return back()->with('success', 'Vaccination recorded.');
    }

    public function destroy(Patient $patient, PatientVaccination $vaccination)
    {
        $vaccination->delete();

        return back()->with('success', 'Vaccination record deleted.');
    }
}
