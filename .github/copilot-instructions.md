# Track-It AI Coding Instructions

## Project Overview

**Track-It** is a Next.js 16 full-stack application with TypeScript, Tailwind CSS, and React 19. It follows strict architectural patterns for maintainability and security.

- **Framework**: Next.js 16.1.4 (App Router)
- **Frontend**: React 19.2.3 + Tailwind CSS 4
- **Database**: MongoDB (documented in standards, not yet implemented)
- **Package Manager**: pnpm (monorepo support via pnpm-workspace.yaml)
- **Compiler**: React Compiler enabled in next.config.ts

## Critical Architecture Patterns

### 1. Dual API Security Model (MANDATORY)

All API endpoints MUST be classified and protected accordingly:

**Internal APIs** (`/api/keys/**`, `/api/usage/**`, `/api/profile/**`):
- Use `validateInternalRequest()` guard from `@/lib/api/internal-api.guard`
- Require NextAuth session
- Reject cross-origin requests and external tools (curl, Postman)
- Only accessible from browser UI

**Public APIs** (`/api/sheets/**`, `/api/v1/**`):
- Use `validateApiKey()` guard from `@/lib/api/api-key.guard`
- API key authentication in Authorization or x-api-key headers
- Implement rate limiting and usage logging to `usage_logs` table
- Support CORS for legitimate external access

**Example - Internal API**:
```typescript
import { validateInternalRequest } from '@/lib/api/internal-api.guard';
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  const validationError = await validateInternalRequest(request);
  if (validationError) return validationError;
  const session = await getServerSession();
  // ... rest of logic
}
```

**Example - Public API**:
```typescript
import { validateApiKey } from '@/lib/api/api-key.guard';

export async function GET(request: Request) {
  const { userId, profile } = await validateApiKey(request);
  await UsageLogModel.create({ /* ... */ });
  // ... rest of logic
}
```

### 2. File Structure & Naming

Enforce strict organization per [/docs/architecture/PROJECT_STRUCTURE.md](../docs/architecture/PROJECT_STRUCTURE.md):

| Content | Location | Naming |
|---------|----------|--------|
| React Components | `/src/components/` | PascalCase (e.g., `AccountManager.tsx`) |
| Models | `/src/lib/` | `entity.model.ts` |
| Services | `/src/lib/` | `entity.service.ts` |
| Validators | `/src/lib/` | `entity.validator.ts` |
| Custom Hooks | `/src/hooks/` | `useEntityName.ts` |
| Types | `/src/types/` | Shared TS definitions |
| Utilities | `/src/utils/` | Pure helper functions |
| Unit Tests | `/tests/unit/` | `*.test.(ts\|tsx)` |
| E2E Tests | `/tests/e2e/` | `*.spec.ts` |
| Scripts | `/scripts/{dev\|db\|deploy}/` | Task-specific scripts |
| Docs | `/docs/{api\|architecture\|guides}/` | Markdown docs |

**ALWAYS use absolute imports with `@/` alias**:
```typescript
// ✅ Correct
import { AccountService } from '@/lib/account.service';
import { Button } from '@/components/ui/Button';

// ❌ Wrong
import { AccountService } from '../../../lib/account.service';
```

### 3. Event Handler Naming & Code Quality

- Event handlers: Use `handle` prefix (e.g., `handleClick`, `handleSubmit`)
- Use early returns for readability
- Follow DRY principles
- Descriptive variable/function names
- Proper error handling and validation

## Development Workflows

### Commands

```bash
pnpm dev        # Start dev server (http://localhost:3000)
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

### Testing Standards (MANDATORY)

- **Coverage**: Minimum 80% for all modules
- **Frameworks**: Jest + React Testing Library (frontend), Jest (backend)
- **Definition of Done**: No task complete without tests

Required test types:
- Unit tests: Component logic, services, utilities
- Integration tests: API endpoints (`*.integration.test.ts`)
- E2E tests: Critical user journeys (`*.spec.ts`)

**Always mock external dependencies** (APIs, databases, third-party services).

### Task Automation Protocol

All work MUST follow atomic task breakdown:

1. **Break down** requirements into independent tasks (max 2h each)
2. **Track** in `Tasks_tracking.md` with status: Not Started → In Progress → Completed
3. **Commit after each task** with conventional format:
   ```
   <type>(<scope>): <description>
   
   <body explaining WHY>
   
   Closes: TASK-[ID]
   ```
4. Types: `feat|fix|refactor|test|docs|config|setup`

**Example**: `feat(auth): implement login validation - Closes: TASK-001`

## Component & Layout Conventions

### Tailwind CSS + shadcn/ui

- **shadcn/ui**: Use MCP server to install components and blocks
- **Container centering**: ALWAYS include `mx-auto` on containers
  ```tsx
  // ✅ Correct
  <div className="container max-w-7xl mx-auto px-4">
  
  // ❌ Wrong (will have rightward whitespace)
  <div className="container max-w-7xl">
  ```
- Test layouts on multiple viewports (1200px, 1440px, 1920px, 2560px)

## Import Order

Always maintain this order:
1. External libraries (`react`, `next`, `next-auth`, etc.)
2. Internal absolute imports (`@/lib/*`, `@/components/*`)
3. Relative imports (last resort)

## Security Checklist for New Code

When creating ANY API endpoint:
- [ ] Classified as Internal or Public
- [ ] Correct security guard applied (`validateInternalRequest` or `validateApiKey`)
- [ ] Authentication verified (session or API key)
- [ ] Resource ownership validated
- [ ] Input validation & sanitization
- [ ] Error responses use proper helpers
- [ ] Security tests written
- [ ] Endpoint type documented

## MongoDB Standards (Future Implementation)

When implementing database features:
- Use connection pooling and error handling
- Follow MongoDB document design principles
- Proper indexing strategy
- Create `entity.model.ts` files in `/src/lib/`

## Performance & Optimization

- **React Compiler**: Enabled (next.config.ts). Automatic memoization—don't manually memoize.
- **ESLint**: Enforces Next.js + TypeScript best practices
- **Incremental builds**: TypeScript incremental mode enabled for faster builds

## Key Files Reference

- **Instruction Files**: `.github/instructions/` (general, api-security, tasker, shad-cn)
- **TypeScript Config**: `tsconfig.json` (paths configured for `@/*` imports)
- **Next.js Config**: `next.config.ts` (React Compiler enabled)
- **ESLint Config**: `eslint.config.mjs` (Next.js + TS rules)
- **Project Structure**: `/docs/architecture/PROJECT_STRUCTURE.md` (directory organization)

## Quick Decision Tree

**Creating a new component?**
→ `/src/components/`, PascalCase, use Tailwind + shadcn/ui, container with `mx-auto`

**Writing business logic?**
→ `/src/lib/entity.{model|service|validator}.ts`, use `@/` imports

**Building an API endpoint?**
→ Determine Internal or Public, apply security guard FIRST, add tests

**Need a reusable hook?**
→ `/src/hooks/useNoun.ts`, follow React conventions

**Found a bug?**
→ Write test first, fix, commit: `fix(scope): description - Closes: TASK-[ID]`

---

**Always refer to the detailed instruction files in `.github/instructions/` for specifics on API security, project structure, testing, and task automation.**
