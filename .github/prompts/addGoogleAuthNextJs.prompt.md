---
name: addGoogleAuthNextJs
description: Implement Google OAuth authentication with NextAuth in Next.js application with security
argument-hint: project root directory or package.json location
---

# Add Google OAuth Authentication to Next.js Application

You are tasked with implementing a complete Google OAuth authentication system in a Next.js application using NextAuth.js with proper security practices.

## Core Requirements

Implement a secure authentication system with the following features:

1. Google OAuth provider with offline access for token refresh
2. JWT-based session strategy with automatic token refresh
3. Route protection middleware/proxy for authenticated routes
4. Server-side only Supabase admin client for sensitive operations
5. Session expiration handling with proper error states
6. Security best practices (no client-side exposure of service keys)

## Implementation Steps

### 1. Install Dependencies

```bash
npm install next-auth@latest @supabase/supabase-js
```

### 2. Environment Variables

Add to `.env.local`:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. NextAuth Configuration (`src/app/api/auth/[...nextauth]/route.ts`)

- Configure Google OAuth provider with `access_type: "offline"` for refresh tokens
- Implement JWT callback for token refresh before expiration
- Implement session callback to fetch user profile and handle errors
- Add signIn callback to create/update user in database
- Set session maxAge (30 days) and updateAge (24 hours)
- Handle `RefreshAccessTokenError` to trigger re-authentication

### 4. Route Protection (`src/proxy.ts` for Next.js 16+)

- Export default function `proxy(request: NextRequest)`
- Define protected routes array (dashboard, API routes)
- Use `getToken()` from `next-auth/jwt` to verify JWT
- Check token expiration (`token.exp`)
- Redirect unauthenticated users to `/auth/signin`
- Inject user context headers (`x-user-id`, `x-user-email`)
- Allow public API routes with different auth strategy

### 5. Server-Side Admin Client (`src/lib/supabase/admin.ts`)

- Create `ensureServerSide()` function to prevent client-side access
- Use SUPABASE_SERVICE_ROLE_KEY for elevated permissions
- Disable auto-refresh and session persistence
- Export type-safe helper function

### 6. Session Hook Usage

Replace context-based auth with NextAuth:

```tsx
import { useSession, signOut } from 'next-auth/react';

const { data: session, status } = useSession();
const user = session?.user;

// Handle loading state
if (status === 'loading') return <LoadingSkeleton />;

// Handle session errors
if (session?.error === 'RefreshAccessTokenError') {
  // Show re-auth UI
}
```

### 7. Token Refresh Logic

In JWT callback:

- Check if access token is expired or near expiration
- Call Google OAuth2 token endpoint with refresh_token
- Update token with new access_token and expires_at
- Set error flag if refresh fails

### 8. Security Checklist

- ✅ Service role key never exposed to client
- ✅ JWT tokens have expiration
- ✅ Automatic token refresh before expiry
- ✅ Protected routes validated at edge
- ✅ Session errors handled gracefully
- ✅ Sensitive operations server-side only

## File Structure

```
src/
  app/
    api/
      auth/
        [...nextauth]/
          route.ts          # NextAuth configuration
  lib/
    supabase/
      admin.ts             # Server-side admin client
      client.ts            # Public client (optional)
  proxy.ts                 # Route protection (Next.js 16+)
  middleware.ts            # Route protection (Next.js 15)
```

## Expected Outcomes

- Users can sign in with Google OAuth
- Sessions persist for 30 days with auto-refresh
- Protected routes redirect unauthenticated users
- Token refresh happens automatically before expiration
- Session errors trigger re-authentication flow
- All sensitive operations isolated server-side
- Build completes without TypeScript errors

## Common Pitfalls to Avoid

1. Don't use `middleware.ts` in Next.js 16+ (use `proxy.ts` with default export)
2. Always add type assertions for Supabase operations if needed: `as never`, `as any`
3. Wrap `useSearchParams` in Suspense boundaries
4. Check token expiration in route protection, not just token presence
5. Handle refresh token errors gracefully with user-facing messages
