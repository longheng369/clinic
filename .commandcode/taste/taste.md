# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# react
- Define React component props with the `type` keyword and name the type `Props` (e.g., `type Props = { ... }`). Confidence: 0.85
- Use light mode as the default design direction for UI components. Confidence: 0.65
- Use `import { Link } from '@inertiajs/react'` for navigation instead of `<a>` tags. Confidence: 0.65
- Prefers `usePage().props` from `@inertiajs/react` to access shared page data directly in deeply nested components instead of prop drilling through intermediate layers. Confidence: 0.65

# styling
See [styling/taste.md](styling/taste.md)
# laravel
- Use Laravel Breeze for authentication scaffolding. Confidence: 0.50
- Use `constrained()` instead of `foreign()->references()->on()` in migrations. Confidence: 0.65
- Use `#[Fillable]` attribute syntax (Laravel 13) instead of `protected $fillable` property. Confidence: 0.65
- Use `created_by` instead of `recorded_by` for tracking who created a record. Confidence: 0.65
- Attach authorship automatically via a model `booted()` hook with a `creating` event (e.g., setting `created_by` from the authenticated user) instead of assigning it manually in controllers. Confidence: 0.75

# architecture
See [architecture/taste.md](architecture/taste.md)
# components
- Keep the reusable form input component scoped to `<input>` elements only — do not add textarea support. Confidence: 0.60
- Use `@base-ui/react` Select component instead of native HTML `<select>` for form select inputs. Confidence: 0.75

# react
- Use react-hook-form for form validation instead of custom touched/blur state management. Confidence: 0.65
- When a react-hook-form field needs to store a complex object (e.g., `{ id, name }`) rather than a scalar, use `useController` with a manual `onChange` handler instead of `register`, using the primitive (id) as the `<option value>` and reconstructing the full object in `onChange`. Confidence: 0.55
- Persist tab/UI state via URL query parameters (?tab=) rather than localStorage. Confidence: 0.65
- Prefer DataTable component with pagination over card-based layouts for displaying tabular record data. Confidence: 0.65

# workflow
See [workflow/taste.md](workflow/taste.md)
# architecture
- Scope medication and surveillance tabs to only show for IPD (inpatient) visits, not OPD visits. Confidence: 0.75

# workflow
- For UX/UI related tasks, use the premium-eco-design-system agent at `.commandcode/agents/premium-eco-design-system.md`. Confidence: 0.75
- When medication dose progress reaches 100% (all doses taken), automatically set the medication status to "Discontinued". Confidence: 0.70
- Separate medication orders (doctor side) from administrations (nurse history) — the doctor creates orders with dose/frequency, the nurse provides individual administrations. Confidence: 0.70
- When a nurse provides a pending administration and the count is still below the target frequency, auto-create the next pending administration. Confidence: 0.70
- Never modify past administrations — for significant dose changes, stop the old medication order and create a new one instead. Confidence: 0.75

# components
- Use the SearchBar component for search inputs instead of TextInput or native inputs. Confidence: 0.65
- For medication/medicine name fields, use a dropdown/select populated from the medicines list rather than a free-text input. Confidence: 0.65

# workflow
- When a medication cycle completes (status is "completed"), still allow the doctor to stop the order — not just continue to the next cycle. Confidence: 0.65

# laravel
- Use `firstOrCreate()` instead of `create()` in seeders to prevent duplicate records on re-runs. Confidence: 0.65
- Enforce business rules like "only one record per parent" via FormRequest validation (`Rule::unique`) rather than controller-side `firstOrCreate`/upsert logic — keep controllers as plain creates/updates and let validation reject duplicates. Confidence: 0.65

