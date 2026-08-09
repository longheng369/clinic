<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVaccineRequest;
use App\Http\Requests\UpdateVaccineRequest;
use App\Models\Vaccine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VaccineController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        return Inertia::render('vaccines/index', [
            'vaccines' => Vaccine::latest()
                ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
                ->paginate(10)
                ->withQueryString(),
            'search' => $search,
        ]);
    }

    public function store(StoreVaccineRequest $request)
    {
        Vaccine::create(array_merge(
            $request->validated(),
            ['created_by' => auth()->id()]
        ));

        return redirect()->route('vaccines.index')
            ->with('success', 'Vaccine created.');
    }

    public function edit(Vaccine $vaccine)
    {
        return Inertia::render('vaccines/edit', [
            'vaccine' => $vaccine,
        ]);
    }

    public function update(UpdateVaccineRequest $request, Vaccine $vaccine)
    {
        $vaccine->update($request->validated());

        return redirect()->route('vaccines.index')
            ->with('success', 'Vaccine updated.');
    }

    public function destroy(Vaccine $vaccine)
    {
        $vaccine->delete();

        return redirect()->route('vaccines.index')
            ->with('success', 'Vaccine deleted.');
    }
}
