<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDiagnosticTestRequest;
use App\Http\Requests\UpdateDiagnosticTestRequest;
use App\Models\DiagnosticTest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiagnosticTestController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        return Inertia::render('diagnostic-tests/index', [
            'diagnosticTests' => DiagnosticTest::latest()
                ->when($search, fn ($query) => $query
                    ->where('name', 'like', "%{$search}%"))
                ->paginate(20)
                ->withQueryString(),
            'search' => $search,
        ]);
    }

    public function store(StoreDiagnosticTestRequest $request)
    {
        DiagnosticTest::create($request->validated());

        return redirect()->route('diagnostic-tests.index')
            ->with('success', 'Diagnostic test created.');
    }

    public function update(UpdateDiagnosticTestRequest $request, DiagnosticTest $diagnosticTest)
    {
        $diagnosticTest->update($request->validated());

        return redirect()->route('diagnostic-tests.index')
            ->with('success', 'Diagnostic test updated.');
    }

    public function destroy(DiagnosticTest $diagnosticTest)
    {
        $diagnosticTest->delete();

        return redirect()->route('diagnostic-tests.index')
            ->with('success', 'Diagnostic test deleted.');
    }
}
