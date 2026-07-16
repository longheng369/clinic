<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HelpController;
use App\Http\Controllers\MedicationAdministrationController;
use App\Http\Controllers\MedicationDoseController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\ParaclinicRequestController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientSurveillanceController;
use App\Http\Controllers\PatientVaccinationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\VaccineController;
use App\Http\Controllers\VisitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/help', HelpController::class)->name('help');

    Route::resource('appointments', AppointmentController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);

    Route::get('appointments/patients/search', [AppointmentController::class, 'searchPatients'])->name('api.appointments.patients.search');
    Route::get('appointments/patients/{patient}/vaccine-alerts', [AppointmentController::class, 'patientVaccineAlerts'])->name('api.appointments.patients.vaccine-alerts');

    Route::resource('settings/categories', CategoryController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);

    Route::resource('settings/units', UnitController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);

    Route::resource('medicines', MedicineController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);

    Route::resource('vaccines', VaccineController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);

    Route::resource('patients', PatientController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);

    Route::get('patients/search', [ParaclinicRequestController::class, 'searchPatients'])->name('api.patients.search');
    Route::get('patients/{patient}', [PatientController::class, 'show'])->name('patients.show');
    Route::post('patients/{patient}/attachments', [PatientController::class, 'uploadAttachment'])->name('patients.attachments.upload');
    Route::delete('patients/{patient}/attachments/{attachment}', [PatientController::class, 'deleteAttachment'])->name('patients.attachments.destroy');
    Route::get('patients/attachments/{attachment}/view', [PatientController::class, 'viewAttachment'])->name('patients.attachments.view');

    Route::get('patients/{patient}/surveillances', [PatientSurveillanceController::class, 'index'])->name('patients.surveillances.index');
    Route::post('patients/{patient}/surveillances', [PatientSurveillanceController::class, 'store'])->name('patients.surveillances.store');
    Route::put('patients/{patient}/surveillances/{surveillance}', [PatientSurveillanceController::class, 'update'])->name('patients.surveillances.update');
    Route::delete('patients/{patient}/surveillances/{surveillance}', [PatientSurveillanceController::class, 'destroy'])->name('patients.surveillances.destroy');

    Route::get('patients/{patient}/vaccinations', [PatientVaccinationController::class, 'index'])->name('patients.vaccinations.index');
    Route::post('patients/{patient}/vaccinations', [PatientVaccinationController::class, 'store'])->name('patients.vaccinations.store');
    Route::delete('patients/{patient}/vaccinations/{vaccination}', [PatientVaccinationController::class, 'destroy'])->name('patients.vaccinations.destroy');

    Route::get('patients/{patient}/consultations/create', [ConsultationController::class, 'create'])->name('patients.consultations.create');
    Route::get('patients/{patient}/consultations/{consultation}', [ConsultationController::class, 'show'])->name('patients.consultations.show');
    Route::get('patients/{patient}/consultations/{consultation}/edit', [ConsultationController::class, 'edit'])->name('patients.consultations.edit');
    Route::post('patients/{patient}/consultations', [ConsultationController::class, 'store'])->name('patients.consultations.store');
    Route::put('patients/{patient}/consultations/{consultation}', [ConsultationController::class, 'update'])->name('patients.consultations.update');
    Route::delete('patients/{patient}/consultations/{consultation}', [ConsultationController::class, 'destroy'])->name('patients.consultations.destroy');

    Route::resource('paraclinic-requests', ParaclinicRequestController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::get('paraclinic-requests/{paraclinic_request}', [ParaclinicRequestController::class, 'show'])->name('paraclinic-requests.show');
    Route::post('paraclinic-requests/{paraclinic_request}/attachments', [ParaclinicRequestController::class, 'uploadAttachment'])->name('paraclinic-requests.attachments.upload');
    Route::delete('paraclinic-requests/{paraclinic_request}/attachments/{attachment}', [ParaclinicRequestController::class, 'deleteAttachment'])->name('paraclinic-requests.attachments.destroy');
    Route::get('paraclinic-requests/attachments/{attachment}/view', [ParaclinicRequestController::class, 'viewAttachment'])->name('paraclinic-requests.attachments.view');
    Route::patch('paraclinic-requests/{paraclinic_request}/status', [ParaclinicRequestController::class, 'updateStatus'])->name('paraclinic-requests.status');
    Route::post('paraclinic-requests/{paraclinic_request}/results', [ParaclinicRequestController::class, 'storeResult'])->name('paraclinic-requests.results.store');

    Route::get('doctors/search', [ParaclinicRequestController::class, 'searchDoctors'])->name('api.doctors.search');

    Route::post('patients/{patient}/medications', [MedicationAdministrationController::class, 'store'])->name('patients.medications.store');
    Route::post('visits/{visit}/medications/{medicationAdministration}/stop', [MedicationAdministrationController::class, 'stop'])->name('visits.medications.stop');
    Route::post('visits/{visit}/doses/{dose}/administer', [MedicationDoseController::class, 'administer'])->name('visits.doses.administer');
    Route::post('visits/{visit}/doses/{dose}/skip', [MedicationDoseController::class, 'skip'])->name('visits.doses.skip');

    Route::get('visits/{visit}', [VisitController::class, 'show'])->name('visits.show');
    Route::patch('visits/{visit}/admit', [VisitController::class, 'admit'])->name('visits.admit');
    Route::patch('visits/{visit}/close', [VisitController::class, 'close'])->name('visits.close');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('categories/search', [CategoryController::class, 'search'])->name('api.categories.search');

    Route::get('components', function () {
        return Inertia::render('components/index');
    });
});

require __DIR__.'/auth.php';
