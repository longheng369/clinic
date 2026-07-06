<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\PatientController;
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

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('categories/search', [CategoryController::class, 'search'])->name('api.categories.search');
});

require __DIR__.'/auth.php';
