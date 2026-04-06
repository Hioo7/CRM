# Repository Guidelines

## Project Structure & Module Organization
This repository is split into two apps: `backend/` and `frontend/`. Backend source lives in `backend/src`, organized by `config`, `controllers`, `routes`, `services`, `schema`, `validators`, `middleware`, and `lib`. Prisma files are in `backend/prisma`, and compiled output lands in `backend/dist`. Frontend source lives in `frontend/src`, with UI code under `components`, `layouts`, `pages`, `hooks`, `contexts`, `providers`, `services`, `types`, `utils`, and `config`. Static assets are in `frontend/public` and `frontend/src/assets`; production bundles go to `frontend/dist`.

## Build, Test, and Development Commands
Run commands from the relevant app directory.

- `cd backend && npm run dev`: start the Express API with `ts-node-dev`.
- `cd backend && npm run build`: compile TypeScript to `backend/dist`.
- `cd backend && npm run lint`: run ESLint on backend sources.
- `cd backend && npm run db:migrate` / `npm run db:seed`: apply Prisma migrations and seed data.
- `cd frontend && npm run dev`: start the Vite dev server.
- `cd frontend && npm run build`: type-check and create the production bundle.
- `cd frontend && npm run lint`: run frontend ESLint rules.

## Coding Style & Naming Conventions
Both apps use TypeScript and forbid `any`. Backend code uses semicolon-terminated statements, explicit return types where required by ESLint, and PascalCase file names for controllers/services such as `AuthController.ts`. Frontend code follows the existing Vite style with functional React components, PascalCase component files like `ProtectedRoute.tsx`, camelCase service/util files like `authService.ts`, and the `@/` alias for `frontend/src/*`. Keep shared constants in each app’s `config/constants.ts`.

## Testing Guidelines
There is no real automated test suite yet. `backend/npm test` is currently a placeholder, and the frontend has no test script. Until tests are added, treat `npm run lint` and `npm run build` in both apps as required validation for every change. When adding tests, colocate them near the feature or under a dedicated `__tests__` folder and use `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines
Git history is not available in this workspace, so no verified commit convention could be extracted. Use short, imperative commit subjects such as `frontend: add employee table filters` or `backend: validate JWT expiry`. PRs should include a concise summary, affected area (`frontend` or `backend`), setup or migration notes, linked issue if one exists, and screenshots for UI changes.

## Security & Configuration Tips
Do not commit populated env files. Use `backend/.env.template` as the source for required variables, and keep secrets such as `JWT_SECRET`, database credentials, and seeded admin credentials out of commits.
