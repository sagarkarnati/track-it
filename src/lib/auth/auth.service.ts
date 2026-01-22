import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  fullName?: string
}

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(credentials: LoginCredentials) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Sign out the current user
   */
  static async signOut() {
    const supabase = createClient()
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Get the current user (client-side)
   */
  static async getCurrentUser(): Promise<User | null> {
    const supabase = createClient()
    
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
   * Get the current user (server-side)
   */
  static async getServerUser(): Promise<User | null> {
    const supabase = await createServerClient()
    
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

  /**
   * Check if user is authenticated (client-side)
   */
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null
  }
}
