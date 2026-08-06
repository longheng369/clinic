# Memory

## Project Overview
See @README.md for project overview and @package.json for available npm/pnpm commands for this project.

## Context Scoping (Before Implementing Features)
When implementing a new feature, limit context reading to these directories/files:

1. `app/` — Application logic (models, controllers, services, etc.)
2. `database/` — Migrations, seeders, factories
3. `resources/` — Views, JS/TS components, CSS, frontend assets
4. `routes/` — Route definitions
5. `composer.json` — PHP dependencies and project metadata
6. `package.json` — JS/TS dependencies and scripts
7. `config/` — Configuration files
8. `storage/` — **Only read when the task involves images, files, or uploaded assets**
9. `public/` — **Only read when the task involves images, files, or publicly served assets**

## Code Style Guidelines
- Use descriptive variable names
- Follow existing patterns in the codebase
- Extract complex conditions into meaningful boolean variables
- Use `import { cn } from '@/utils/cn'` for class name merging (shared utility, do not define inline)
- Define React component props with the `type` keyword and name them `Props` (e.g., `type Props = { ... }`)

## Architecture Notes

### CRUD Baseline Pattern (Categories)
The `resources/js/pages/categories/` directory is the canonical baseline for all CRUD pages. Follow this structure for new CRUD modules:

- **`index.tsx`** — List page: receives paginated data via Inertia props, uses `DataTable` + `SearchBar`, debounced search (300ms), delete via `openAlert` confirmation, create/edit via modal.
- **`partials/createOrEdit.tsx`** — Shared modal form for both create and edit. Accepts optional `category` prop; if present, it's an edit (`router.put`), otherwise create (`router.post`). Uses `react-hook-form` with typed form data interface.
- **Route pattern**: routes defined in `routes/` for `GET /resource`, `POST /resource`, `PUT /resource/{id}`, `DELETE /resource/{id}`.
- **Data interfaces**: Define a model interface (`IResource`) and a form data interface (`IResourceFormData`) in `resources/js/interfaces/`.

Key conventions: Inertia.js for all server communication, modal-based forms (no separate edit route), server-rendered pagination, debounced search, typed form data, toast notifications for success/error.

## Design System & Styling Guide

### Tech Stack
- **CSS**: Tailwind CSS v4 (`@import 'tailwindcss'` syntax)
- **Icons**: lucide-react
- **UI Primitives**: @headlessui/react (Combobox), @floating-ui/react (popovers/dropdowns)
- **Fonts**: Poppins (sans, primary), Battambang (Khmer)
- **Page background**: `#efefef` (`var(--background)`)

### Color Palette (from `resources/css/app.css`)
| Scale | Usage |
|-------|-------|
| Primary (blue) | Brand, active states, focus rings, primary buttons |
| Secondary (teal) | Secondary accent, calming elements |
| Accent (orange) | CTAs, highlights, warnings |
| Sidebar | white bg, `#1e293b` text, `#f1f5f9` hover, `#64748b` muted, `#cbd5e1` border |

### Component Patterns

**Form Inputs** (RHF-integrated — `input.tsx`, `select.tsx`, `textarea.tsx`, `searchSelect.tsx`):
```
base:  "w-full rounded-lg border px-3 py-2.5 outline-none text-sm focus:ring-2"
default state:  "border-gray-300 focus:ring-primary-500/20 focus:border-primary-500"
error state:  "border-red-500 focus:border-red-500 focus:ring-red-500/20"
label:  "block text-sm font-medium text-gray-700 mb-1"
error msg:  "mt-1 text-sm text-red-500"
```

**Buttons** (`button.tsx`):
- Variants: `contained` | `outlined` | `text`
- Colors: `primary` | `secondary` | `error`
- Sizes: `small` (`px-3 py-1.5 text-xs`) | `medium` (`px-4 py-2 text-sm`) | `large` (`px-6 py-3 text-base`)
- `fullWidth`, `startIcon`/`endIcon`, `disableRipple` props
- Ripple animation via `animate-ripple` (900ms)

### Animation Utilities (defined in `@theme`)
- **Ripple animation**: framer-motion `motion.span` with `initial/animate/transition` (700ms ease-out)
- `animate-toast-slide-in` — toast notification slide (300ms ease-out)
- Standard transition: `transition duration-150 ease-in-out`
- Modal: backdrop `transition-opacity duration-150`, panel `transition-all duration-200` with `scale-100` ↔ `scale-95`
- Checkbox: SVG check `transition-all duration-150` (scale-50 → scale-100)

### Form Components List
- `resources/js/components/form/input.tsx` — Text input (RHF)
- `resources/js/components/form/select.tsx` — Native select (RHF)
- `resources/js/components/form/textarea.tsx` — Textarea (RHF)
- `resources/js/components/form/checkbox.tsx` — Button-style checkbox (RHF)
- `resources/js/components/form/searchSelect.tsx` — Searchable combobox (Headless UI)
- `resources/js/components/inputLabel.tsx` — Label component
- `resources/js/components/inputError.tsx` — Error message component

### RHF Form Component Standard
- Use `useController` hook (not `<Controller>` render-prop)
- Generic over `FieldValues` (`<T extends FieldValues = FieldValues>`)
- Accept `control: Control<T>`, `name: Path<T>`, `rules`, `label`
- Omit `className` from extended HTML attributes (managed internally)
- Required field: show `*` on label when `rules.required` is truthy
- Error: render `<span>{error.message}</span>` below field

## React Hook Form Field Component Standard
When creating form field components with react-hook-form:
- Use `useController` hook instead of `<Controller>` render-prop component
- Make the component generic over `FieldValues` (`<T extends FieldValues = FieldValues>`) so `control` and `name` stay type-safe
- Accept `control: Control<T>`, `name: Path<T>`, `rules`, and `label` as props
- Extend the native HTML element attributes (omit `className` since it's managed internally by the component)
- Use a `cn` helper for conditional class name merging
- Show an asterisk (`*`) on the label when `rules.required` is truthy
- Render `{error && <span>{error.message}</span>}` below the field when validation fails
- Apply distinct focus/ring styles for error state vs default state (e.g., `primary-500` for default, `red-500` for error)

## Common Workflows
Document frequently used workflows and commands here.

### MUI MCP Usage
Use the MUI MCP tools whenever a task relates to MUI / MUI X components, props, theming, or codegen:
- For any MUI component or API question, call `mui-mcp_useMuiDocs` first to pull version-matched docs. Project pairing: `@mui/material@9.2.0`, `@mui/x-data-grid@9.10.1` (pass `muiPairing: material v9, muiX v9`).
- Follow up with `mui-mcp_fetchDocs` for specific pages surfaced by `useMuiDocs`.
- To generate React + MUI code from a natural-language brief or Figma frame, use `mui-mcp_generateReactCode`.

## Agent Delegation
- **UX/UI tasks**: Delegate to `.commandcode/agents/premium-eco-design-system.md`
