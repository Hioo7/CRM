# Frontend Development Rules

## Core Principles

- The frontend must be implemented as a React application using Vite.
- DaisyUI must be used for UI components.
- Tailwind CSS must be used for layouting and styling composition.
- Prefer DaisyUI theme rules and semantic styling patterns wherever possible.
- All frontend code must follow DRY principles.
- All frontend code must follow single responsibility principles.
- All frontend code must use clear OOP-oriented design where appropriate.
- Before implementing any feature, choose the design pattern that best fits the feature and keeps the code scalable and maintainable.
- Ensure strict type safety throughout the frontend.
- Do not use `any`.
- Do not use `unknown`.
- If `any` or `unknown` appears necessary for a valid use case, ask for explicit approval before using it.

## Folder Structure Rules

- The frontend must follow a flexible and scalable folder structure.
- Organize frontend code under these folders: `components`, `pages`, `hooks`, `services`, `utils`, `contexts`, `providers`, `layouts`, `types`, and `config`.
- The project structure description must stay at folder level only and must not document file-level structure.
- `components` must contain reusable UI building blocks only.
- `layouts` must assemble individual reusable UI components into larger reusable layout compositions.
- `pages` must render one or more layouts and must not own reusable UI logic.
- `hooks` must provide controlled access to context state and context actions.
- `services` must contain core services and business-oriented client logic.
- `utils` must contain pure reusable helpers.
- `contexts` must hold shared state and service-connected state logic.
- `providers` must provide access to contexts only.
- `types` must contain explicit shared type definitions.
- `config` must contain centralized frontend configuration support and constants.

## Data Flow Rules

- The required flow of data is: `services -> context -> provider -> hook -> component`.
- Services must feed data and actions into contexts.
- Contexts must expose shared state and service-backed actions.
- Providers must expose contexts only and must not contain unrelated business logic.
- Hooks must be the access layer for reading context state and invoking context actions.
- Components must consume hooks and observe state changes.
- Components must not contain business logic.
- Components must act as observers and renderers of already-prepared state and actions.

## UI Composition Rules

- All UI components must be broken down into reusable pieces.
- Reuse components and layout primitives instead of rebuilding similar UI repeatedly.
- Styling must be reusable and composable.
- Favor shared styling patterns and theme-driven decisions over one-off hardcoded styling.
- DaisyUI must be used for component-level UI patterns.
- Tailwind CSS must be used for layouting, spacing, responsiveness, and styling composition.
- All UI must be mobile-native and responsive across desktop views.
- Build interfaces mobile-first and extend them cleanly for larger breakpoints.

## Configuration Rules

- Hardcoded values must not be scattered across the codebase.
- Any reusable hardcoded value must be defined centrally in `constants.ts` inside the `config` folder.
- Centralized constants must be reused for UI timing, validation behavior, and shared configuration values.
- Error display duration must be controlled through a centralized value defined in `config/constants.ts`.

## Form Rules

- Every form must validate each field at a minimum for type and trim checks.
- Form validation must be explicit, reusable, and consistent.
- Every form must display error banners when validation or submission errors occur.
- Error handling behavior must be predictable and driven by centralized configuration where applicable.

## Maintainability Rules

- Keep services, contexts, providers, hooks, components, layouts, and pages separated by responsibility at all times.
- Avoid duplicating domain logic, rendering logic, validation logic, styling logic, and configuration logic.
- Prefer composition over duplication.
- Every module, class, hook, and component must have one clear reason to change.
- Reusable abstractions are allowed only when they improve clarity and maintain responsibility boundaries.

## Quality Gates

- Any change made in the frontend must be followed by lint and build checks.
- Lint and build checks must pass with zero errors and zero warnings.
- A change is not complete until both checks pass cleanly.
