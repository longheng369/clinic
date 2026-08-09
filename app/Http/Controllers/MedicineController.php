<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMedicineRequest;
use App\Http\Requests\UpdateMedicineRequest;
use App\Models\Category;
use App\Models\Medicine;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        return Inertia::render('medicines/index', [
            'medicines' => Medicine::with(['category', 'unit'])
                ->latest()
                ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
                ->paginate(10)
                ->withQueryString(),
            'units' => Unit::orderBy('name')->get(),
            'search' => $search,
        ]);
    }

    public function store(StoreMedicineRequest $request)
    {
        Medicine::create($request->validated());

        return redirect()->route('medicines.index')
            ->with('success', 'Medicine created.');
    }

    public function edit(Medicine $medicine)
    {
        return Inertia::render('medicines/edit', [
            'medicine' => $medicine->load(['category', 'unit']),
            'categories' => Category::orderBy('name')->get(),
            'units' => Unit::orderBy('name')->get(),
        ]);
    }

    public function update(UpdateMedicineRequest $request, Medicine $medicine)
    {
        $medicine->update($request->validated());

        return redirect()->route('medicines.index')
            ->with('success', 'Medicine updated.');
    }

    public function destroy(Medicine $medicine)
    {
        $medicine->delete();

        return redirect()->route('medicines.index')
            ->with('success', 'Medicine deleted.');
    }
}
