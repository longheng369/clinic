<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLapTestRequest;
use App\Http\Requests\UpdateLapTestRequest;
use App\Models\LapTest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LapTestController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        return Inertia::render('lap-tests/index', [
            'lapTests' => LapTest::latest()
                ->when($search, fn ($query) => $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('value', 'like', "%{$search}%"))
                ->paginate(20)
                ->withQueryString(),
            'search' => $search,
        ]);
    }

    public function store(StoreLapTestRequest $request)
    {
        LapTest::create($request->validated());

        return redirect()->route('lap-tests.index')
            ->with('success', 'Lap test created.');
    }

    public function update(UpdateLapTestRequest $request, LapTest $lapTest)
    {
        $lapTest->update($request->validated());

        return redirect()->route('lap-tests.index')
            ->with('success', 'Lap test updated.');
    }

    public function destroy(LapTest $lapTest)
    {
        $lapTest->delete();

        return redirect()->route('lap-tests.index')
            ->with('success', 'Lap test deleted.');
    }
}
