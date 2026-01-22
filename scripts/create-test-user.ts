#!/usr/bin/env node

/**
 * Create test user in Supabase Auth
 * This script creates the default development user account
 * 
 * Run with: node --import tsx scripts/create-test-user.ts
 * Or: npx tsx scripts/create-test-user.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Parse .env.local file manually
function loadEnv() {
    try {
        const envPath = join(process.cwd(), '.env.local')
        const envContent = readFileSync(envPath, 'utf-8')
        const env: Record<string, string> = {}

        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=:#]+)=(.*)$/)
            if (match) {
                const key = match[1].trim()
                const value = match[2].trim().replace(/^["']|["']$/g, '')
                env[key] = value
            }
        })

        return env
    } catch (error) {
        console.error('❌ Could not read .env.local file')
        process.exit(1)
    }
}

const env = loadEnv()
const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables in .env.local:')
    console.error('   - SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL')
    console.error('   - SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

const TEST_USER = {
    email: 'hr@company.com',
    password: 'TrackIt@2026!Secure#Dev',
    userId: '00000000-0000-0000-0000-000000000001',
    fullName: 'HR Manager'
}

async function createTestUser() {
    console.log('🔧 Creating test user in Supabase Auth...\n')

    try {
        // Create user in Supabase Auth
        const { data, error } = await supabase.auth.admin.createUser({
            email: TEST_USER.email,
            password: TEST_USER.password,
            email_confirm: true,
            user_metadata: {
                full_name: TEST_USER.fullName
            }
        })

        if (error) {
            if (error.message.includes('already registered')) {
                console.log('ℹ️  User already exists')
                console.log('\n✅ You can now log in with:')
                console.log(`   Email: ${TEST_USER.email}`)
                console.log(`   Password: ${TEST_USER.password}`)
                return
            }
            throw error
        }

        console.log('✅ Test user created successfully!')
        console.log(`   User ID: ${data.user.id}`)
        console.log(`   Email: ${data.user.email}`)
        console.log('\n🔑 Login credentials:')
        console.log(`   Email: ${TEST_USER.email}`)
        console.log(`   Password: ${TEST_USER.password}`)

        // Update the profile with the correct user ID
        console.log('\n🔧 Updating profile with auth user ID...')
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: data.user.id,
                email: TEST_USER.email,
                full_name: TEST_USER.fullName,
                avatar_url: '/avatar.png'
            })

        if (profileError) {
            console.warn('⚠️  Warning: Could not update profile:', profileError.message)
        } else {
            console.log('✅ Profile updated successfully!')
        }

    } catch (error: any) {
        console.error('❌ Error creating test user:', error.message)
        process.exit(1)
    }
}

// Run the script
createTestUser()
    .then(() => {
        console.log('\n✨ Setup complete!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Setup failed:', error)
        process.exit(1)
    })
