<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use Illuminate\Http\Request;
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
}
