// Mock user configuration for development
export const MOCK_USER = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'hr@company.com',
    fullName: 'HR Manager',
    // Strong password hash (not used in mock mode, but documented for security)
    // Password: TrackIt@2026!Secure#Dev
    password: 'TrackIt@2026!Secure#Dev',
} as const

// Development mode flag
export const USE_MOCK_AUTH = process.env.NODE_ENV === 'development'

// Helper to get current user (mock or real)
export function getCurrentUserId(): string {
    if (USE_MOCK_AUTH) {
        return MOCK_USER.id
    }
    // In production, get from Supabase auth session
    throw new Error('Auth not implemented for production')
}
