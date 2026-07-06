<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\ParaclinicRequestController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientSurveillanceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UnitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard/index');
    })->name('dashboard');

    Route::resource('settings/categories', CategoryController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);

    Route::resource('settings/units', UnitController::class)
        ->only(['index', 'store', 'edit', 'update', 'destroy']);

    Route::resource('medicines', MedicineController::class)
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

    Route::resource('paraclinic-requests', ParaclinicRequestController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::get('paraclinic-requests/{paraclinic_request}', [ParaclinicRequestController::class, 'show'])->name('paraclinic-requests.show');
    Route::post('paraclinic-requests/{paraclinic_request}/attachments', [ParaclinicRequestController::class, 'uploadAttachment'])->name('paraclinic-requests.attachments.upload');
    Route::delete('paraclinic-requests/{paraclinic_request}/attachments/{attachment}', [ParaclinicRequestController::class, 'deleteAttachment'])->name('paraclinic-requests.attachments.destroy');
    Route::get('paraclinic-requests/attachments/{attachment}/view', [ParaclinicRequestController::class, 'viewAttachment'])->name('paraclinic-requests.attachments.view');
    Route::patch('paraclinic-requests/{paraclinic_request}/status', [ParaclinicRequestController::class, 'updateStatus'])->name('paraclinic-requests.status');
    Route::post('paraclinic-requests/{paraclinic_request}/results', [ParaclinicRequestController::class, 'storeResult'])->name('paraclinic-requests.results.store');

    Route::get('doctors/search', [ParaclinicRequestController::class, 'searchDoctors'])->name('api.doctors.search');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('categories/search', [CategoryController::class, 'search'])->name('api.categories.search');
});

require __DIR__.'/auth.php';
