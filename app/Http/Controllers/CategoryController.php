<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        return Inertia::render('categories/index', [
            'categories' => Category::latest()
                ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
                ->paginate(20)
                ->withQueryString(),
            'search' => $search,
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        Category::create($request->validated());

        return redirect()->route('settings.categories.index')
            ->with('success', 'Category created.');
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return redirect()->route('settings.categories.index')
            ->with('success', 'Category updated.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('settings.categories.index')
            ->with('success', 'Category deleted.');
    }

    public function search(Request $request)
    {
        $query = $request->query('q', '');

        return Category::query()
            ->where('name', 'like', "%{$query}%")
            ->orderBy('name')
            ->limit(25)
            ->get(['id', 'name']);
    }

    public function all()
    {
        return Category::orderBy('name')->get(['id', 'name']);
    }
}
