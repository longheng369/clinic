# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# react
- Use light mode as the default design direction for UI components. Confidence: 0.65
- Use `import { Link } from '@inertiajs/react'` for navigation instead of `<a>` tags. Confidence: 0.65

# styling
- Keep form inputs at adequately visible dimensions; do not reduce sizing below Tailwind defaults. Confidence: 0.65
- Use primary-500 color for input focus outlines/rings. Confidence: 0.75
- Prefer blue-based accent colors (primary-50 range) over default orange/warm accent tones. Confidence: 0.70

# laravel
- Use Laravel Breeze for authentication scaffolding. Confidence: 0.50
- Use `constrained()` instead of `foreign()->references()->on()` in migrations. Confidence: 0.65
- Use `#[Fillable]` attribute syntax (Laravel 13) instead of `protected $fillable` property. Confidence: 0.65
- Use `created_by` instead of `recorded_by` for tracking who created a record. Confidence: 0.65

# architecture
- For CRUD modals, store shared form templates in a partials folder within the page directory and reuse the same template for both create and edit operations. Confidence: 0.70

# components
- Keep the reusable form input component scoped to `<input>` elements only — do not add textarea support. Confidence: 0.60
- Use `@base-ui/react` Select component instead of native HTML `<select>` for form select inputs. Confidence: 0.75

# react
- Use react-hook-form for form validation instead of custom touched/blur state management. Confidence: 0.65
- Persist tab/UI state via URL query parameters (?tab=) rather than localStorage. Confidence: 0.65
- Prefer DataTable component with pagination over card-based layouts for displaying tabular record data. Confidence: 0.65

# workflow
- In medication administration tracking, each "Provide" action marks a single individual dose as administered (do not batch multiple doses under one click based on interval like TID). Confidence: 0.70
- For the MAR (medication administration record) tab, display medication orders as separate table rows rather than inside accordion/collapsible cards. Confidence: 0.70

# architecture
- Scope medication and surveillance tabs to only show for IPD (inpatient) visits, not OPD visits. Confidence: 0.55

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

