# Memory

## Project Overview
See @README.md for project overview and @package.json for available npm/pnpm commands for this project.

## Code Style Guidelines
- Use descriptive variable names
- Follow existing patterns in the codebase
- Extract complex conditions into meaningful boolean variables

## Architecture Notes
Add important architectural decisions and patterns here.

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
