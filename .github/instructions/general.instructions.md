---
applyTo: '**'
description: Universal project standards and guidelines that apply to all file types
---

# Universal Project Standards

## Database Standards

- **Primary Database**: MongoDB for document-based data storage
- **Connection Management**: Use proper connection pooling and error handling
- **Schema Design**: Follow MongoDB document design principles with proper indexing

## Code Quality Principles

- Follow DRY principles (Don't Repeat Yourself)
- Use early returns whenever possible for readability
- Use descriptive variable and function names
- Event functions should use "handle" prefix (handleClick, handleSubmit)
- Implement proper error handling and validation

## Task Management & Development Workflow

- **MANDATORY**: Break down ALL user requests/requirements into atomic tasks
- **Track ALL tasks** in `Tasks_tracking.md` with proper status updates
- **Follow task template** from `tasker.instructions.md` for consistent tracking
- **Update task status** as work progresses (Not Started → In Progress → Complete)
- **Reference task IDs** in commit messages and pull requests
- **No work should begin** without proper task breakdown and tracking

## Testing & Quality Assurance Standards

- **MANDATORY**: Write unit tests for ALL new code and features
- **Test Coverage**: Maintain minimum 80% code coverage for all modules
- **Test Types Required**:
  - Unit tests: `*.test.(js|jsx|ts|tsx)` for components, services, and utilities
  - Integration tests: `*.integration.test.ts` for API endpoints and workflows
  - E2E tests: `*.spec.ts` for critical user journeys
- **Testing Framework**: Use Jest + React Testing Library for frontend, Jest for backend
- **Test Placement**: Follow project structure guidelines for test file organization
- **Definition of Done**: No task is complete without corresponding tests
- **Test-Driven Development**: Write tests before or alongside implementation
- **Mock External Dependencies**: Always mock APIs, databases, and third-party services in tests

## Project Structure Guidelines

This project follows a strict directory structure that must be maintained:

#### File Placement Rules

- **React Components**: Place in `/src/components/` with PascalCase naming
- **Business Logic**: Place in `/src/lib/` following the pattern:
  - Models: `entity.model.ts` (e.g., `account.model.ts`)
  - Services: `entity.service.ts` (e.g., `account.service.ts`)
  - Validators: `entity.validator.ts` (e.g., `accountSnapshot.validator.ts`)
- **Custom Hooks**: Place in `/src/hooks/` with `use` prefix
- **Types**: Place in `/src/types/` for shared TypeScript definitions
- **Utilities**: Place in `/src/utils/` for pure helper functions
- **Tests**: Place in appropriate test directories:
  - Unit tests: `/tests/unit/`
  - E2E tests: `/tests/e2e/`
  - Integration tests: `/tests/integration/`
  - Test fixtures: `/tests/fixtures/`

#### Import Path Rules

- **Always use absolute imports** with the `@/` alias for internal files
- **Import order**: External libraries first, then internal `@/` imports, then relative imports
- **Examples**:

  ```typescript
  // ✅ Correct
  import { AccountService } from '@/lib/account.service';
  import { Button } from '@/components/ui/Button';

  // ❌ Avoid relative imports for src/ files
  import { AccountService } from '../../../lib/account.service';
  ```

#### Script Organization

- **Development scripts**: Place in `/scripts/dev/`
- **Database scripts**: Place in `/scripts/db/`
- **Deployment scripts**: Place in `/scripts/deploy/`

#### Documentation Rules

- **API docs**: Place in `/docs/api/`
- **Architecture docs**: Place in `/docs/architecture/`
- **User guides**: Place in `/docs/guides/`

#### Naming Conventions

- **Components**: PascalCase (e.g., `AccountManager.tsx`)
- **Files with business logic**: kebab-case with type suffix (e.g., `account.service.ts`)
- **Test files**: `*.test.(js|jsx|ts|tsx)` for unit tests, `*.spec.ts` for E2E
- **Hook files**: camelCase with `use` prefix (e.g., `useAccountData.ts`)

#### Never Place Files

- ❌ **Root directory**: No loose scripts, test files, or documentation
- ❌ **Src root**: No direct files in `/src/`, use subdirectories
- ❌ **Mixed concerns**: Don't mix components with services in same directory

#### Directory Structure Enforcement

Refer to `/docs/architecture/PROJECT_STRUCTURE.md` for complete directory structure documentation. Always maintain this organization when creating or moving files.

## Documentation Standards

- **API docs**: Place in `/docs/api/`
- **Architecture docs**: Place in `/docs/architecture/`
- **User guides**: Place in `/docs/guides/`
- Use clear, concise documentation with proper markdown formatting
- Include code examples where appropriate
- Maintain consistent documentation structure across the project

## Security Guidelines

- Always validate and sanitize user inputs
- Implement proper authentication and authorization
- Use environment variables for sensitive configuration
- Follow secure coding practices

## API Endpoint Security Standards

### MANDATORY: Dual API Architecture

All API endpoints in this project MUST follow the dual API pattern:

#### 1. Internal APIs (Dashboard/UI Only)

**Purpose**: Endpoints used exclusively by the web application UI for dashboard functionality

**Security Requirements**:
- ✅ MUST use `validateInternalRequest()` guard from `@/lib/api/internal-api.guard`
- ✅ MUST require active NextAuth session
- ✅ MUST validate Origin/Referer headers
- ✅ MUST reject cross-origin requests
- ✅ MUST block direct API calls from external tools (curl, Postman, etc.)
- ✅ MUST be accessible only through the application UI

**Examples**:
```typescript
// ✅ Correct - Internal API with guard
import { validateInternalRequest } from '@/lib/api/internal-api.guard';

export async function GET(request: Request) {
  const validationError = await validateInternalRequest(request);
  if (validationError) return validationError;
  // ... rest of endpoint logic
}
```

**Internal API Endpoints**:
- `/api/keys/**` - API key management
- `/api/usage/**` - Usage statistics
- `/api/quota/**` - Quota tracking
- `/api/profile/**` - User profile management
- Any dashboard-specific functionality

#### 2. Public APIs (External Integration)

**Purpose**: Endpoints designed for external consumption with API key authentication

**Security Requirements**:
- ✅ MUST use API key authentication (not session-based)
- ✅ MUST validate API key from request headers
- ✅ MUST implement rate limiting per API key
- ✅ MUST log all usage to `usage_logs` table
- ✅ MUST return standardized error responses
- ✅ MUST support CORS for legitimate cross-origin access

**Examples**:
```typescript
// ✅ Correct - Public API with API key auth
import { validateApiKey } from '@/lib/api/api-key.guard';

export async function GET(request: Request) {
  const { userId, profile } = await validateApiKey(request);
  // ... rest of endpoint logic
}
```

**Public API Endpoints**:
- `/api/sheets/**` - Google Sheets integration
- `/api/v1/**` - Versioned public API
- Any endpoints documented for external developers

### Implementation Checklist

When creating ANY new API endpoint:

- [ ] Determine if endpoint is Internal (UI) or Public (API)
- [ ] Apply appropriate security guard (`validateInternalRequest` or `validateApiKey`)
- [ ] Add authentication check (session or API key)
- [ ] Implement authorization (user owns resource)
- [ ] Add input validation and sanitization
- [ ] Log security-relevant events
- [ ] Add appropriate error responses
- [ ] Document endpoint type in API docs
- [ ] Write security tests

### ❌ Never Do This

```typescript
// ❌ WRONG - No security guard
export async function GET(request: Request) {
  const session = await getServerSession();
  // ... Missing validateInternalRequest!
}

// ❌ WRONG - Wrong auth type
export async function GET(request: Request) {
  // Internal endpoint using API key instead of session
  const apiKey = request.headers.get('x-api-key');
}

// ❌ WRONG - Public endpoint using session
export async function GET(request: Request) {
  // Public API should use API key, not session
  const session = await getServerSession();
}
```

### Security Review Requirements

Before merging any PR with API endpoints:

- [ ] Verify correct security guard is applied
- [ ] Test with external tools (should fail for internal APIs)
- [ ] Test without authentication (should fail with 401)
- [ ] Test with wrong user credentials (should fail with 403)
- [ ] Verify security headers are present in response
- [ ] Check that sensitive data is not exposed
- [ ] Confirm rate limiting is working (for public APIs)

### Related Documentation

- [Internal API Security](../docs/INTERNAL_API_SECURITY.md) - Detailed internal API security guide
- [API Key Authentication](../docs/api/API_KEY_SETUP.md) - Public API authentication
- [Backend Architecture](../docs/architecture/BACKEND_ARCHITECTURE.md) - Overall system design

## Cross-References

- For React/Next.js specific standards, see `nextjs.instructions.md`
- For AI task automation protocols, see `tasker.instructions.md`
- For project structure details, see `/docs/architecture/PROJECT_STRUCTURE.md`
