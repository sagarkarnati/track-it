---
applyTo: '**/api/**/*.ts'
description: API endpoint security requirements and implementation standards
---

# API Endpoint Security Standards

## CRITICAL REQUIREMENT: Dual API Architecture

**ALL API endpoints in this project MUST follow the dual API security pattern.**

## 1. Internal APIs (Dashboard/UI Only)

### When to Use
- Dashboard functionality
- User profile management
- API key management
- Usage analytics
- Quota tracking
- Any feature accessible only through logged-in UI

### Security Implementation

```typescript
import { validateInternalRequest } from '@/lib/api/internal-api.guard';
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  // MANDATORY: Validate internal request FIRST
  const validationError = await validateInternalRequest(request);
  if (validationError) return validationError;

  // MANDATORY: Verify session
  const session = await getServerSession();
  if (!session?.user?.email) {
    return unauthorized('No active session');
  }

  // MANDATORY: Get user profile and verify ownership
  const profile = await ProfileModel.getByEmail(session.user.email);
  if (!profile) {
    return notFound('User profile not found');
  }

  // Your endpoint logic here
}
```

### Required Security Checks

- ✅ `validateInternalRequest()` called FIRST
- ✅ NextAuth session verification
- ✅ User profile lookup
- ✅ Resource ownership validation
- ✅ Input validation and sanitization
- ✅ Error responses use helper functions

### Endpoints Requiring This Pattern

```
/api/keys/**           - API key CRUD operations
/api/usage/**          - Usage statistics
/api/quota/**          - Quota tracking
/api/profile/**        - User profile
/api/dashboard/**      - Dashboard features
/api/settings/**       - User settings
```

### What Gets Blocked

- ❌ curl commands
- ❌ Postman/Insomnia requests
- ❌ Third-party applications
- ❌ External API clients
- ❌ Cross-origin requests
- ❌ Missing Origin/Referer headers

## 2. Public APIs (External Integration)

### When to Use
- Google Sheets data operations
- External developer integrations
- Mobile app backends
- Webhook consumers
- Third-party service integrations

### Security Implementation

```typescript
import { validateApiKey } from '@/lib/api/api-key.guard';

export async function GET(request: Request) {
  // MANDATORY: Validate API key
  const { userId, profile, apiKey } = await validateApiKey(request);

  // MANDATORY: Verify resource ownership
  const resource = await ResourceModel.getById(resourceId);
  if (resource.user_id !== userId) {
    return forbidden('Access denied');
  }

  // MANDATORY: Log usage
  await UsageLogModel.create({
    user_id: userId,
    api_key_id: apiKey.id,
    endpoint: request.url,
    method: request.method,
  });

  // Your endpoint logic here
}
```

### Required Security Checks

- ✅ API key validation from header
- ✅ Rate limiting check
- ✅ Resource ownership verification
- ✅ Usage logging
- ✅ Input validation and sanitization
- ✅ CORS headers if needed

### Endpoints Requiring This Pattern

```
/api/sheets/**         - Google Sheets operations
/api/v1/**            - Versioned public API
/api/webhooks/**      - Webhook endpoints
/api/public/**        - Any public-facing API
```

### API Key Header Format

```
Authorization: Bearer sk_live_abc123xyz...
```

or

```
x-api-key: sk_live_abc123xyz...
```

## Decision Tree

```
Is this endpoint for the dashboard UI?
│
├─ YES → Use Internal API Pattern
│         ├─ validateInternalRequest()
│         ├─ getServerSession()
│         └─ Session-based auth
│
└─ NO → Is it for external developers?
          │
          ├─ YES → Use Public API Pattern
          │         ├─ validateApiKey()
          │         ├─ Rate limiting
          │         └─ Usage logging
          │
          └─ NO → Reconsider your architecture!
```

## Code Review Checklist

Before approving ANY PR with API endpoints:

### Internal APIs
- [ ] `validateInternalRequest()` called at start
- [ ] `getServerSession()` called for auth
- [ ] User profile retrieved and validated
- [ ] Resource ownership verified
- [ ] Tested with curl (should fail)
- [ ] Tested from UI (should work)
- [ ] Security headers present

### Public APIs
- [ ] `validateApiKey()` called at start
- [ ] Rate limiting implemented
- [ ] Usage logged to database
- [ ] Resource ownership verified
- [ ] Input validation present
- [ ] Tested with valid API key (should work)
- [ ] Tested without API key (should fail 401)
- [ ] Tested with wrong user's key (should fail 403)

## Common Mistakes to Avoid

### ❌ Mistake 1: No Security Guard
```typescript
// WRONG - Missing validation
export async function GET(request: Request) {
  const session = await getServerSession();
  // Anyone can call this!
}
```

### ❌ Mistake 2: Wrong Auth Type
```typescript
// WRONG - Public API using session
export async function GET(request: Request) {
  const session = await getServerSession(); // Should use API key!
}
```

### ❌ Mistake 3: Guard After Logic
```typescript
// WRONG - Validation too late
export async function GET(request: Request) {
  const data = await fetchData(); // Already executed!
  const validationError = await validateInternalRequest(request);
}
```

### ❌ Mistake 4: Missing Ownership Check
```typescript
// WRONG - No ownership verification
export async function DELETE(request: Request) {
  await validateInternalRequest(request);
  await ApiKeyModel.delete(keyId); // Any user can delete any key!
}
```

## Testing Requirements

### Internal API Tests
```typescript
describe('GET /api/keys', () => {
  it('should reject requests without session', async () => {
    const response = await fetch('/api/keys');
    expect(response.status).toBe(401);
  });

  it('should reject curl requests', async () => {
    const response = await fetch('/api/keys', {
      headers: { 'User-Agent': 'curl/7.64.1' }
    });
    expect(response.status).toBe(403);
  });

  it('should allow authenticated UI requests', async () => {
    const response = await fetch('/api/keys', {
      headers: {
        'Cookie': 'session=...',
        'Origin': 'https://yourdomain.com',
        'Referer': 'https://yourdomain.com/dashboard'
      }
    });
    expect(response.status).toBe(200);
  });
});
```

### Public API Tests
```typescript
describe('GET /api/sheets/data', () => {
  it('should reject requests without API key', async () => {
    const response = await fetch('/api/sheets/data');
    expect(response.status).toBe(401);
  });

  it('should allow requests with valid API key', async () => {
    const response = await fetch('/api/sheets/data', {
      headers: { 'Authorization': 'Bearer sk_live_...' }
    });
    expect(response.status).toBe(200);
  });

  it('should reject requests with wrong user API key', async () => {
    const response = await fetch('/api/sheets/user2/data', {
      headers: { 'Authorization': 'Bearer sk_live_user1_key' }
    });
    expect(response.status).toBe(403);
  });
});
```

## Documentation Requirements

Every API endpoint MUST include:

1. **Security classification** in comments:
```typescript
/**
 * INTERNAL API - Dashboard UI Only
 * Get list of user's API keys
 * 
 * @auth Session-based (NextAuth)
 * @access UI only - blocks external tools
 */
export async function GET(request: Request) { ... }
```

or

```typescript
/**
 * PUBLIC API - External Integration
 * Fetch Google Sheets data
 * 
 * @auth API key (Bearer token)
 * @access External developers, mobile apps
 * @ratelimit Based on subscription tier
 */
export async function GET(request: Request) { ... }
```

2. **Example requests** in API documentation
3. **Error responses** documented
4. **Rate limits** specified (for public APIs)

## Related Files

- `/src/lib/api/internal-api.guard.ts` - Internal API security guard
- `/src/lib/api/api-key.guard.ts` - Public API key validation (to be created)
- `/src/lib/api/response.ts` - Standardized response helpers
- `/docs/INTERNAL_API_SECURITY.md` - Detailed internal API security guide
- `/docs/api/API_KEY_SETUP.md` - Public API key documentation

## Environment Configuration

```bash
# .env.local

# For internal API (development/staging origins)
ALLOWED_ORIGINS=localhost:3000,staging.yourdomain.com

# For public API rate limiting
RATE_LIMIT_FREE=1000
RATE_LIMIT_PRO=50000
RATE_LIMIT_ENTERPRISE=1000000
```

## Summary

**Every API endpoint MUST be classified as either:**
1. **Internal** (UI only) → Use `validateInternalRequest()`
2. **Public** (external) → Use `validateApiKey()`

**No exceptions. No mixed patterns. No shortcuts.**

This ensures consistent security across the entire application and prevents accidental exposure of internal functionality.
