# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# react
- Use light mode as the default design direction for UI components. Confidence: 0.65
- Use `import { Link } from '@inertiajs/react'` for navigation instead of `<a>` tags. Confidence: 0.65

# styling
- Keep form inputs at adequately visible dimensions; do not reduce sizing below Tailwind defaults. Confidence: 0.65
- Use primary-500 color for input focus outlines/rings. Confidence: 0.70

# laravel
- Use Laravel Breeze for authentication scaffolding. Confidence: 0.50
- Use `constrained()` instead of `foreign()->references()->on()` in migrations. Confidence: 0.65
- Use `#[Fillable]` attribute syntax (Laravel 13) instead of `protected $fillable` property. Confidence: 0.65

# architecture
- For CRUD modals, store shared form templates in a partials folder within the page directory and reuse the same template for both create and edit operations. Confidence: 0.70

# components
- Keep the reusable form input component scoped to `<input>` elements only — do not add textarea support. Confidence: 0.60

# react
- Use react-hook-form for form validation instead of custom touched/blur state management. Confidence: 0.65
- Persist tab/UI state via URL query parameters (?tab=) rather than localStorage. Confidence: 0.65

