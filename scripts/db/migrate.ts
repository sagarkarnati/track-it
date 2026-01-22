import { createAdminClient } from '@/lib/supabase/admin'

async function runMigration() {
    const supabase = createAdminClient()

    console.log('🚀 Starting Track-It database migration...')

    // Read the migration SQL
    const fs = require('fs')
    const path = require('path')
    const sql = fs.readFileSync(
        path.join(process.cwd(), 'supabase/migrations/001_initial_schema.sql'),
        'utf8'
    )

    try {
        // Execute the SQL using the REST API
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql })

        if (error) {
            console.error('❌ Migration failed:', error)
            process.exit(1)
        }

        console.log('✅ Database migration completed successfully!')
        console.log('')
        console.log('📝 Next steps:')
        console.log('1. Create a mock user profile')
        console.log('2. Verify tables in Supabase Dashboard → Table Editor')
        console.log('3. Check Storage bucket "reports" in Storage section')
        console.log('4. Run "pnpm dev" to start the application')
    } catch (error) {
        console.error('❌ Unexpected error:', error)
        process.exit(1)
    }
}

runMigration()
