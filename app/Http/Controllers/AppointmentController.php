<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Vaccine;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
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
                'name' => "{$p->khmer_first_name} {$p->khmer_last_name}".($p->first_name ? " ({$p->last_name} {$p->first_name})" : ''),
            ]);
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $date = $request->query('date');
        $status = $request->query('status');

        return Inertia::render('appointments/index', [
            'appointments' => Appointment::with(['patient', 'createdBy'])
                ->latest()
                ->when($search, fn ($q) => $q->whereHas('patient', fn ($q) => $q
                    ->where('khmer_first_name', 'like', "%{$search}%")
                    ->orWhere('khmer_last_name', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")))
                ->when($date, fn ($q) => $q->whereDate('appointment_date', $date))
                ->when($status, fn ($q) => $q->where('status', $status))
                ->paginate(10)
                ->withQueryString()
                ->through(fn ($a) => [
                    'id' => $a->id,
                    'patient' => $a->patient ? ['id' => $a->patient->id, 'khmer_first_name' => $a->patient->khmer_first_name, 'khmer_last_name' => $a->patient->khmer_last_name] : null,
                    'appointment_date' => $a->appointment_date,
                    'appointment_time' => $a->appointment_time,
                    'type' => $a->type,
                    'status' => $a->status,
                    'notes' => $a->notes,
                    'has_vaccine_alerts' => ! empty($a->vaccine_alerts),
                    'created_by' => $a->createdBy?->name,
                    'created_at' => $a->created_at,
                ]),
            'search' => $search,
            'dateFilter' => $date,
            'statusFilter' => $status,
        ]);
    }

    public function patientVaccineAlerts(Patient $patient)
    {
        $vaccines = Vaccine::orderBy('name')->get(['id', 'name', 'rules']);
        $alerts = [];

        foreach ($vaccines as $vaccine) {
            $nextDose = $patient->nextDoseForVaccine($vaccine);
            if ($nextDose['next_dose_due_date'] !== null && Carbon::parse($nextDose['next_dose_due_date'])->lte(Carbon::now()->addDays(7))) {
                $alerts[] = [
                    'vaccine_name' => $vaccine->name,
                    'dose_number' => $nextDose['next_dose_number'],
                    'doses_completed' => $nextDose['doses_completed'],
                    'total_doses' => $nextDose['total_doses'],
                    'due_date' => $nextDose['next_dose_due_date'],
                    'is_overdue' => Carbon::parse($nextDose['next_dose_due_date'])->lt(Carbon::now()),
                ];
            }
        }

        return response()->json(['alerts' => $alerts]);
    }

    public function store(StoreAppointmentRequest $request)
    {
        $patient = Patient::find($request->patient_id);
        $vaccineAlerts = null;

        if ($patient) {
            $vaccines = Vaccine::orderBy('name')->get(['id', 'name', 'rules']);
            $alerts = [];
            foreach ($vaccines as $vaccine) {
                $nextDose = $patient->nextDoseForVaccine($vaccine);
                if ($nextDose['next_dose_due_date'] !== null && Carbon::parse($nextDose['next_dose_due_date'])->lte(Carbon::now()->addDays(7))) {
                    $alerts[] = [
                        'vaccine_name' => $vaccine->name,
                        'dose_number' => $nextDose['next_dose_number'],
                        'doses_completed' => $nextDose['doses_completed'],
                        'total_doses' => $nextDose['total_doses'],
                        'due_date' => $nextDose['next_dose_due_date'],
                    ];
                }
            }
            $vaccineAlerts = ! empty($alerts) ? $alerts : null;
        }

        Appointment::create(array_merge(
            $request->validated(),
            [
                'created_by' => auth()->id(),
                'vaccine_alerts' => $vaccineAlerts,
            ]
        ));

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment created.');
    }

    public function edit(Appointment $appointment)
    {
        $appointment->load('patient');

        return Inertia::render('appointments/edit', [
            'appointment' => [
                'id' => $appointment->id,
                'patient_id' => $appointment->patient_id,
                'patient' => $appointment->patient ? ['id' => $appointment->patient->id, 'khmer_first_name' => $appointment->patient->khmer_first_name, 'khmer_last_name' => $appointment->patient->khmer_last_name] : null,
                'appointment_date' => $appointment->appointment_date,
                'appointment_time' => $appointment->appointment_time,
                'type' => $appointment->type,
                'status' => $appointment->status,
                'notes' => $appointment->notes,
            ],
        ]);
    }

    public function update(UpdateAppointmentRequest $request, Appointment $appointment)
    {
        $appointment->update($request->validated());

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment updated.');
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment deleted.');
    }
}
