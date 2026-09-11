<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMedicationRouteRequest;
use App\Http\Requests\UpdateMedicationRouteRequest;
use App\Models\MedicationRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicationRouteController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        return Inertia::render('routes/index', [
            'medicationRoutes' => MedicationRoute::latest()
                ->when($search, fn ($query) => $query->where('code', 'like', "%{$search}%")->orWhere('name', 'like', "%{$search}%"))
                ->paginate(20)
                ->withQueryString(),
            'search' => $search,
        ]);
    }

    public function store(StoreMedicationRouteRequest $request)
    {
        MedicationRoute::create($request->validated());

        return redirect()->route('routes.index')
            ->with('success', 'Route created.');
    }

    public function edit(MedicationRoute $medicationRoute)
    {
        return Inertia::render('routes/edit', [
            'medicationRoute' => $medicationRoute,
        ]);
    }

    public function update(UpdateMedicationRouteRequest $request, MedicationRoute $medicationRoute)
    {
        $medicationRoute->update($request->validated());

        return redirect()->route('routes.index')
            ->with('success', 'Route updated.');
    }

    public function destroy(MedicationRoute $medicationRoute)
    {
        $medicationRoute->delete();

        return redirect()->route('routes.index')
            ->with('success', 'Route deleted.');
    }
}
