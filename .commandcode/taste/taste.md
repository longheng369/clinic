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

# architecture
- Scope medication and surveillance tabs to only show for IPD (inpatient) visits, not OPD visits. Confidence: 0.55

# workflow
- For UX/UI related tasks, use the premium-eco-design-system agent at `.commandcode/agents/premium-eco-design-system.md`. Confidence: 0.75

