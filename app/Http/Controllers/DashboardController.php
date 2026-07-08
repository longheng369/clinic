<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Vaccine;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $today = Carbon::now()->startOfDay();
        $weekEnd = Carbon::now()->addDays(7)->endOfDay();

        $patients = Patient::with('vaccinations.vaccine')->get();
        $vaccines = Vaccine::orderBy('name')->get(['id', 'name', 'rules']);

        $dueAlerts = [];

        foreach ($patients as $patient) {
            foreach ($vaccines as $vaccine) {
                $nextDose = $patient->nextDoseForVaccine($vaccine);
                if ($nextDose['next_dose_due_date'] === null) {
                    continue;
                }
                $dueDate = Carbon::parse($nextDose['next_dose_due_date']);
                if ($dueDate->lte($weekEnd)) {
                    $dueAlerts[] = [
                        'patient' => [
                            'id' => $patient->id,
                            'khmer_first_name' => $patient->khmer_first_name,
                            'khmer_last_name' => $patient->khmer_last_name,
                            'first_name' => $patient->first_name,
                            'last_name' => $patient->last_name,
                        ],
                        'vaccine_name' => $vaccine->name,
                        'dose_number' => $nextDose['next_dose_number'],
                        'doses_completed' => $nextDose['doses_completed'],
                        'total_doses' => $nextDose['total_doses'],
                        'due_date' => $nextDose['next_dose_due_date'],
                        'is_overdue' => $dueDate->lt($today),
                    ];
                }
            }
        }

        usort($dueAlerts, fn ($a, $b) => [$a['is_overdue'] ? 0 : 1, $a['due_date']] <=> [$b['is_overdue'] ? 0 : 1, $b['due_date']]);

        return Inertia::render('dashboard/index', [
            'vaccinationDueAlerts' => $dueAlerts,
        ]);
    }
}
