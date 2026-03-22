# Project: Mutuo Nativo (AI Nativo)

Workshop management platform for AI Nativo by MÜTÜÖ. Monorepo with React frontend, Convex backend, and shared packages.

## Structure

- `apps/web/` — React + Vite + Tailwind frontend
- `convex/` — Convex backend (queries, mutations, actions, schema)
- `packages/types/` — Shared TypeScript types (exported as `@repo/types`)

## TypeScript Rules

### No `any` — ever

- Never use `any` as a type annotation, parameter type, or return type.
- Use `unknown` when the type is genuinely unknown, then narrow with type guards.
- Use `Record<string, unknown>` for generic objects instead of `Record<string, any>`.

### No `as Type` casts — with few exceptions

- Never use `as any` or `as unknown as SomeType`.
- Allowed exceptions (Convex boundary casts only):
  - `as Id<'tableName'>` — converting string IDs to Convex typed IDs at the API boundary.
  - `as const` — always fine for literal types.
- For everything else, restructure the code so types flow naturally.

### Prefer proper types

- Use types from `@repo/types`.
- Use `Doc<"tableName">` and `Id<"tableName">` from Convex generated types.
- Status functions should accept their proper union type, not `string`.

## UI / Frontend Rules

### All components MUST be shadcn — no exceptions

Every UI element in the app must use shadcn/ui components from `apps/web/src/components/ui/`. This is a hard rule:

- Do NOT create inline/ad-hoc UI components. If it's a button, use `<Button>`. If it's a card, use `<Card>`. If it's an input, use `<Input>`.
- Do NOT use raw HTML elements (`<button>`, `<input>`, `<table>`, `<dialog>`) when a shadcn component exists.
- Do NOT create one-off styled wrappers. If you need a variant, add it to the shadcn component using CVA (class-variance-authority).
- Every component must be **reusable, styled, and polished**. No unstyled prototypes, no "we'll fix it later" components.
- If a new UI primitive is needed, add it to `apps/web/src/components/ui/` following shadcn conventions:
  - CVA for variants
  - `cn()` for class merging
  - `forwardRef` for DOM access
  - Proper TypeScript types
  - Polish: proper focus states, hover states, transitions, disabled states, loading states

### Component quality bar

Every component must have:
- **Proper states:** default, hover, focus, active, disabled, loading (where applicable)
- **Transitions:** Use `transition-colors`, `transition-opacity`, or `transition-all` — no jarring state changes
- **Accessibility:** Proper `aria-*` attributes, keyboard navigation, focus rings
- **Responsive behavior:** Works on mobile, tablet, and desktop
- **Consistent spacing:** Follow the design token system (not arbitrary pixel values)

### Styling

- Use Tailwind CSS classes exclusively. Do NOT write raw CSS or inline styles (`style={{}}` is banned).
- Use `cn()` from `@/lib/utils` for conditional class merging.
- Follow the B&W palette: `text-foreground`, `text-muted-foreground`, `bg-background`, `bg-muted`, `border-border`.
- Sidebar uses inverse colors: `bg-sidebar-background`, `text-sidebar-foreground`.
- Use lucide-react icons — do NOT use inline SVGs or other icon libraries.
- Font: IBM Plex Sans (300, 400, 500, 600, 700).

### Shared components and utilities

Before writing new code, check for existing utilities:
- `apps/web/src/lib/utils.ts` — `cn()`, `capitalize()`
- `apps/web/src/lib/time.ts` — `getTimeAgo()`, `formatDuration()`
- `apps/web/src/components/shared/` — Shared components (AuthGuard, ErrorBoundary, EmptyState)
- `apps/web/src/hooks/useCategoryFilter.ts` — `useCategoryFilter()` for category tab filtering
- `apps/web/src/components/shared/BackButton.tsx` — Shared back navigation button
- `apps/web/src/components/shared/CategoryTabs.tsx` — Shared category tabs component
- `apps/web/src/constants/roles.ts` — `ROLE_LABELS` mapping
- `convex/lib.ts` — `requireAuth()`, `requireAdmin()`, `requireRole()`, `getProfileByUserId()`, `sanitizeContent()`

### Avoid duplication

- Extract repeated UI patterns into shared components.
- Extract repeated logic into shared hooks or utility functions.
- If you find yourself writing the same Tailwind classes 3+ times, extract a component.

## Convex Backend Rules

- Use validators from `convex/validators.ts` for schema fields.
- Use `requireAuth(ctx)` in ALL user-facing queries and mutations — no exceptions.
- Use `requireAdmin(ctx)` for admin-only operations.
- Sanitize all user-generated content on write (strip HTML tags before storing).
- Use `v.union()` for enum fields (role, status, category).
- All dates stored as ISO 8601 UTC strings.

## RBAC (Role-Based Access Control)

Four user roles enforced server-side in every Convex function:
- `admin` — Full access to everything including admin panel
- `team` — Team members, can manage content (blog, events)
- `mentor` — Active workshop participants, full access to learning content
- `member` — Community members, restricted from live events and locked content

All database columns and enum values use English. UI display text remains in Spanish.

## Design System

- **Palette:** Black and white only. No colors except for semantic states (error red, success green in toasts).
- **Theme tokens:** OKLch color space (see `apps/web/src/index.css`)
- **Font:** IBM Plex Sans
- **Icons:** lucide-react
- **Components:** shadcn/ui with B&W theme
- **Shadows:** Minimal — `border` for separation, not box-shadow
- **Radius:** Consistent `--radius` token (6px base)

## Reference Architecture

This project mirrors the architecture of `phenom-agents`. When in doubt about patterns (monorepo structure, Convex conventions, shadcn setup, auth flow), refer to that project.

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
