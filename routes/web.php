<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HelpController;
use App\Http\Controllers\LapTestController;
use App\Http\Controllers\MedicationAdministrationController;
use App\Http\Controllers\MedicationOrderController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\MedicineInstructionController;
use App\Http\Controllers\MedicationRouteController;
use App\Http\Controllers\ParaClinicRequestController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientSurveillanceController;
use App\Http\Controllers\PatientVaccinationController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\VaccineController;
use App\Http\Controllers\VisitBillingController;
use App\Http\Controllers\VisitController;
use App\Http\Controllers\AutocompleteController;
use App\Http\Controllers\GazetteerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('gazetteers/provinces', [GazetteerController::class, 'getProvinceAndCapitalCity']);
Route::get('gazetteers/districts/{province_code}', [GazetteerController::class, 'getDistrictByProvince']);
Route::get('gazetteers/communes/{district_code}', [GazetteerController::class, 'getCommuneByDistrict']);
Route::get('gazetteers/villages/{commune_code}', [GazetteerController::class, 'getVillageByCommune']);

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/help', HelpController::class)->name('help');

    Route::resource('appointments', AppointmentController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);
    Route::get('appointments/create', [AppointmentController::class, 'create'])->name('appointments.create');

    Route::get('appointments/patients/search', [AppointmentController::class, 'searchPatients'])->name('api.appointments.patients.search');
    Route::get('appointments/patients/{patient}/vaccine-alerts', [AppointmentController::class, 'patientVaccineAlerts'])->name('api.appointments.patients.vaccine-alerts');

    Route::resource('settings/categories', CategoryController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('settings/units', UnitController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);

    Route::resource('settings/routes', MedicationRouteController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy'])
        ->parameters(['routes' => 'medicationRoute']);

    Route::resource('settings/medicine-instructions', MedicineInstructionController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->parameters(['medicine-instructions' => 'medicineInstruction']);

    // Setting
    Route::prefix('settings')->group(function () {

        // Lap test
        Route::get('lap-tests', [LapTestController::class, 'index'])->name('lap-tests.index');
        Route::post('lap-tests', [LapTestController::class, 'store'])->name('lap-tests.store');
        Route::put('lap-tests/{lapTest}', [LapTestController::class, 'update'])->name('lap-tests.update');
        Route::delete('lap-tests/{lapTest}', [LapTestController::class, 'destroy'])->name('lap-tests.destroy');
    });

    Route::resource('medicines', MedicineController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);

    Route::resource('vaccines', VaccineController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);

    Route::resource('patients', PatientController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);

    Route::get('patients/search', [PatientController::class, 'search'])->name('api.patients.search');
    Route::get('patients/{patient}', [PatientController::class, 'show'])->name('patients.show');
    Route::post('patients/{patient}/attachments', [PatientController::class, 'uploadAttachment'])->name('patients.attachments.upload');
    Route::delete('patients/{patient}/attachments/{attachment}', [PatientController::class, 'deleteAttachment'])->name('patients.attachments.destroy');
    Route::get('patients/attachments/{attachment}/view', [PatientController::class, 'viewAttachment'])->name('patients.attachments.view');

    Route::get('patients/{patient}/surveillance', [PatientSurveillanceController::class, 'index'])->name('patients.surveillance.index');
    Route::post('patients/{patient}/surveillance', [PatientSurveillanceController::class, 'store'])->name('patients.surveillance.store');
    Route::put('patients/{patient}/surveillance/{surveillance}', [PatientSurveillanceController::class, 'update'])->name('patients.surveillance.update');
    Route::delete('patients/{patient}/surveillance/{surveillance}', [PatientSurveillanceController::class, 'destroy'])->name('patients.surveillance.destroy');

    Route::get('patients/{patient}/vaccinations', [PatientVaccinationController::class, 'index'])->name('patients.vaccinations.index');
    Route::post('patients/{patient}/vaccinations', [PatientVaccinationController::class, 'store'])->name('patients.vaccinations.store');
    Route::put('patients/{patient}/vaccinations/{vaccination}', [PatientVaccinationController::class, 'update'])->name('patients.vaccinations.update');
    Route::delete('patients/{patient}/vaccinations/{vaccination}', [PatientVaccinationController::class, 'destroy'])->name('patients.vaccinations.destroy');

    Route::post('patients/{patient}/visits', [VisitController::class, 'store'])->name('patients.visits.store');

    Route::get('patients/{patient}/consultations', [ConsultationController::class, 'index'])->name('patients.consultations.index');
    Route::get('patients/{patient}/consultations/create', [ConsultationController::class, 'create'])->name('patients.consultations.create');
    Route::get('patients/{patient}/consultations/{consultation}', [ConsultationController::class, 'show'])->name('patients.consultations.show');
    Route::get('patients/{patient}/consultations/{consultation}/edit', [ConsultationController::class, 'edit'])->name('patients.consultations.edit');
    Route::post('patients/{patient}/consultations', [ConsultationController::class, 'store'])->name('patients.consultations.store');
    Route::put('patients/{patient}/consultations/{consultation}', [ConsultationController::class, 'update'])->name('patients.consultations.update');
    Route::delete('patients/{patient}/consultations/{consultation}', [ConsultationController::class, 'destroy'])->name('patients.consultations.destroy');

    Route::resource('para-clinic-requests', ParaClinicRequestController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::get('para-clinic-requests/{paraclinic_request}', [ParaClinicRequestController::class, 'show'])->name('para-clinic-requests.show');
    Route::post('para-clinic-requests/{paraclinic_request}/attachments', [ParaClinicRequestController::class, 'uploadAttachment'])->name('para-clinic-requests.attachments.upload');
    Route::delete('para-clinic-requests/{paraclinic_request}/attachments/{attachment}', [ParaClinicRequestController::class, 'deleteAttachment'])->name('para-clinic-requests.attachments.destroy');
    Route::get('para-clinic-requests/attachments/{attachment}/view', [ParaClinicRequestController::class, 'viewAttachment'])->name('para-clinic-requests.attachments.view');
    Route::patch('para-clinic-requests/{paraclinic_request}/status', [ParaClinicRequestController::class, 'updateStatus'])->name('para-clinic-requests.status');
    Route::patch('para-clinic-requests/{paraclinic_request}/payment', [ParaClinicRequestController::class, 'updatePayment'])->name('para-clinic-requests.payment');
    Route::post('para-clinic-requests/{paraclinic_request}/results', [ParaClinicRequestController::class, 'storeResult'])->name('para-clinic-requests.results.store');

    Route::get('doctors/search', [ParaClinicRequestController::class, 'searchDoctors'])->name('api.doctors.search');

    Route::post('patients/{patient}/medications', [MedicationOrderController::class, 'store'])->name('patients.medications.store');
    Route::put('patients/{patient}/medications/{medicationOrder}', [MedicationOrderController::class, 'update'])->name('patients.medications.update');

    Route::post('patients/{patient}/prescriptions', [PrescriptionController::class, 'store'])->name('patients.prescriptions.store');
    Route::put('patients/{patient}/prescriptions/{prescription}', [PrescriptionController::class, 'update'])->name('patients.prescriptions.update');
    Route::delete('patients/{patient}/prescriptions/{prescription}', [PrescriptionController::class, 'destroy'])->name('patients.prescriptions.destroy');

    Route::post('visits/{visit}/medications/{medicationOrder}/stop', [MedicationOrderController::class, 'stop'])->name('visits.medications.stop');
    Route::post('visits/{visit}/medications/{medicationOrder}/continue', [MedicationOrderController::class, 'continue'])->name('visits.medications.continue');
    Route::post('visits/{visit}/medications/{medicationOrder}/hold', [MedicationOrderController::class, 'hold'])->name('visits.medications.hold');
    Route::post('visits/{visit}/medications/{medicationOrder}/resume', [MedicationOrderController::class, 'resume'])->name('visits.medications.resume');
    Route::post('visits/{visit}/doses/{medicationAdministration}/administer', [MedicationAdministrationController::class, 'administer'])->name('visits.doses.administer');
    Route::post('visits/{visit}/doses/{medicationAdministration}/missed', [MedicationAdministrationController::class, 'missed'])->name('visits.doses.missed');
    Route::post('visits/{visit}/doses/{medicationAdministration}/refused', [MedicationAdministrationController::class, 'refused'])->name('visits.doses.refused');

    Route::get('visits/{visit}', [VisitController::class, 'show'])->name('visits.show');
    Route::patch('visits/{visit}/admit', [VisitController::class, 'admit'])->name('visits.admit');
    Route::patch('visits/{visit}/close', [VisitController::class, 'close'])->name('visits.close');

    Route::get('visits/{visit}/billing', [VisitBillingController::class, 'show'])->name('visits.billing.show');
    Route::patch('visits/{visit}/billing', [VisitBillingController::class, 'update'])->name('visits.billing.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('categories/search', [CategoryController::class, 'search'])->name('api.categories.search');
    Route::get('api/categories', [CategoryController::class, 'all'])->name('api.categories.all');

    Route::get('components', function () {
        return Inertia::render('components/index');
    });

    Route::get('/autocomplete/{model}', AutocompleteController::class);
});

require __DIR__.'/auth.php';
