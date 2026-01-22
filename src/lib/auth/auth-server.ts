import { createClient } from '@/lib/supabase/server'

export interface User {
    id: string
    email: string
    fullName?: string
}

/**
 * Server-side authentication utilities
 * Only use these in Server Components, Server Actions, and Route Handlers
 */
export class AuthServer {
    /**
     * Get the current user (server-side)
     */
    static async getServerUser(): Promise<User | null> {
        const supabase = await createClient()

        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return null
        }

        return {
            id: user.id,
            email: user.email!,
            fullName: user.user_metadata?.full_name,
        }
    }

    /**
     * Get current user ID (server-side) - for API routes
     */
    static async getServerUserId(): Promise<string> {
        const user = await this.getServerUser()

        if (!user) {
            throw new Error('Unauthorized')
        }

        return user.id
    }
}
