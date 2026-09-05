<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMedicineInstructionRequest;
use App\Http\Requests\UpdateMedicineInstructionRequest;
use App\Models\MedicineInstruction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineInstructionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        return Inertia::render('medicine-instructions/index', [
            'medicineInstructions' => MedicineInstruction::latest()
                ->when($search, fn ($query) => $query
                    ->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%"))
                ->paginate(20)
                ->withQueryString(),
            'search' => $search,
        ]);
    }

    public function store(StoreMedicineInstructionRequest $request)
    {
        MedicineInstruction::create($request->validated());

        return redirect()->route('medicine-instructions.index')
            ->with('success', 'Medicine instruction created.');
    }

    public function update(UpdateMedicineInstructionRequest $request, MedicineInstruction $medicineInstruction)
    {
        $medicineInstruction->update($request->validated());

        return redirect()->route('medicine-instructions.index')
            ->with('success', 'Medicine instruction updated.');
    }

    public function destroy(MedicineInstruction $medicineInstruction)
    {
        $medicineInstruction->delete();

        return redirect()->route('medicine-instructions.index')
            ->with('success', 'Medicine instruction deleted.');
    }
}
