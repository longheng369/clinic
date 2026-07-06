<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MedicineController;
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

    Route::get('patients/{patient}', [PatientController::class, 'show'])->name('patients.show');
    Route::post('patients/{patient}/attachments', [PatientController::class, 'uploadAttachment'])->name('patients.attachments.upload');
    Route::delete('patients/{patient}/attachments/{attachment}', [PatientController::class, 'deleteAttachment'])->name('patients.attachments.destroy');
    Route::get('patients/attachments/{attachment}/view', [PatientController::class, 'viewAttachment'])->name('patients.attachments.view');

    Route::get('patients/{patient}/surveillances', [PatientSurveillanceController::class, 'index'])->name('patients.surveillances.index');
    Route::post('patients/{patient}/surveillances', [PatientSurveillanceController::class, 'store'])->name('patients.surveillances.store');
    Route::put('patients/{patient}/surveillances/{surveillance}', [PatientSurveillanceController::class, 'update'])->name('patients.surveillances.update');
    Route::delete('patients/{patient}/surveillances/{surveillance}', [PatientSurveillanceController::class, 'destroy'])->name('patients.surveillances.destroy');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('categories/search', [CategoryController::class, 'search'])->name('api.categories.search');
});

require __DIR__.'/auth.php';
