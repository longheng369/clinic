<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\PatientAttachment;
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
        return Inertia::render('patients/show', [
            'patient' => $patient,
            'attachments' => $patient->attachments()->with('uploadedBy')->latest()->get(),
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

        return response()->streamDownload(function () use ($attachment) {
            echo Storage::get($attachment->file_path);
        }, $attachment->file_name, [
            'Content-Type' => $attachment->file_type,
            'Content-Disposition' => 'inline; filename="'.$attachment->file_name.'"',
        ]);
    }
}
