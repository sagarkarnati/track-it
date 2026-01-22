# Supabase Backend Setup

## Database Schema

The Track-It application uses the following tables:

### Tables

1. **profiles**
   - User profile information
   - Fields: id, email, full_name, avatar_url, created_at, updated_at

2. **reports**
   - Attendance report metadata
   - Fields: id, profile_id, name, month, status, file paths, error_message, timestamps
   - Status: 'processing' | 'completed' | 'failed'

3. **processing_logs**
   - Logs for report processing steps
   - Fields: id, report_id, status, message, created_at

### Storage

- **Bucket: `reports`**
  - Stores uploaded files (COSEC, BBHR)
  - Stores generated output files
  - Path structure: `{user_id}/{report_id}/{file_name}`

## Setup Instructions

### 1. Run Database Migration

```bash
# Make the script executable
chmod +x scripts/db/migrate.sh

# Run the migration
./scripts/db/migrate.sh
```

Or manually via Supabase Dashboard:
1. Go to SQL Editor
2. Copy content from `supabase/migrations/001_initial_schema.sql`
3. Run the SQL

### 2. Create Mock User (Development Only)

Until authentication is implemented, create a mock user profile:

```sql
INSERT INTO profiles (id, email, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'hr@company.com',
  'HR Manager'
);
```

### 3. Verify Setup

Check in Supabase Dashboard:
- ✅ Tables: profiles, reports, processing_logs
- ✅ Storage bucket: reports
- ✅ Row Level Security policies enabled
- ✅ Mock user profile exists

## API Routes

### Reports Management

- `GET /api/reports` - List all reports
- `POST /api/reports` - Create new report
- `GET /api/reports/[id]` - Get specific report
- `PATCH /api/reports/[id]` - Update report
- `DELETE /api/reports/[id]` - Delete report

### File Operations

- `POST /api/reports/[id]/upload` - Upload COSEC and BBHR files
- `GET /api/reports/[id]/download` - Download generated report

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://thgsolwyeeiczwheqqaz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Storage policies restrict file access to owners
- ✅ Service role key kept server-side only

## Next Steps

1. Implement Supabase Auth (sign up, login, logout)
2. Replace mock user ID with actual authenticated user
3. Add file processing logic (Excel parsing)
4. Implement real-time processing status updates
5. Add error handling and retry logic
