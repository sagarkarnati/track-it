# 🚀 Supabase Setup Guide - Quick Start

## Step 1: Run Database Migrations

Go to your **Supabase Dashboard** → **SQL Editor** and run these SQL commands:

### Migration 1: Create Tables & Policies

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  month TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
  cosec_file_path TEXT,
  bbhr_file_path TEXT,
  output_file_path TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create processing_logs table
CREATE TABLE IF NOT EXISTS processing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reports_profile_id ON reports(profile_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_processing_logs_report_id ON processing_logs(report_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::TEXT = id::TEXT);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::TEXT = id::TEXT);

-- Create policies for reports
CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid()::TEXT = profile_id::TEXT);

CREATE POLICY "Users can create their own reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid()::TEXT = profile_id::TEXT);

CREATE POLICY "Users can update their own reports"
  ON reports FOR UPDATE
  USING (auth.uid()::TEXT = profile_id::TEXT);

CREATE POLICY "Users can delete their own reports"
  ON reports FOR DELETE
  USING (auth.uid()::TEXT = profile_id::TEXT);

-- Create policies for processing_logs
CREATE POLICY "Users can view logs for their reports"
  ON processing_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reports
      WHERE reports.id = processing_logs.report_id
      AND reports.profile_id::TEXT = auth.uid()::TEXT
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Migration 2: Create Mock User

```sql
-- Create mock user profile for development
INSERT INTO profiles (id, email, full_name, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'hr@company.com',
  'HR Manager',
  '/avatar.png'
) ON CONFLICT (id) DO NOTHING;
```

### Migration 3: Enable Realtime

```sql
-- Enable Realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE reports;
ALTER PUBLICATION supabase_realtime ADD TABLE processing_logs;
```

## Step 2: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **New Bucket**
3. Name it: `reports`
4. Make it **Private** (uncheck public)
5. Click **Create Bucket**

### Add Storage Policies

Go to **Storage** → **Policies** → **reports bucket**, then run:

```sql
-- Create storage policies for reports bucket
CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'reports' AND
    auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'reports' AND
    auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'reports' AND
    auth.uid()::TEXT = (storage.foldername(name))[1]
  );
```

## Step 3: Verify Setup

### Check Tables
Go to **Table Editor** and verify:
- ✅ `profiles` table (1 row - mock user)
- ✅ `reports` table (empty)
- ✅ `processing_logs` table (empty)

### Check Storage
Go to **Storage**:
- ✅ `reports` bucket exists
- ✅ Policies are enabled

### Check Realtime
Go to **Database** → **Replication**:
- ✅ `reports` table is in publication
- ✅ `processing_logs` table is in publication

## Step 4: Test the Application

```bash
# Start the development server
pnpm dev
```

Visit `http://localhost:3000` and:
1. ✅ Dashboard should load
2. ✅ Click "Create New Report"
3. ✅ Upload test files
4. ✅ Watch real-time processing status
5. ✅ Download generated report

## Mock User Credentials

**Development Mode Only:**
- User ID: `00000000-0000-0000-0000-000000000001`
- Email: `hr@company.com`
- Name: HR Manager
- Password: `TrackIt@2026!Secure#Dev` (documented, not enforced)

## API Endpoints

- `GET /api/reports` - List reports
- `POST /api/reports` - Create report
- `POST /api/reports/[id]/upload` - Upload files
- `POST /api/reports/[id]/process` - Process files (triggers realtime updates)
- `GET /api/reports/[id]/download` - Download result

## Troubleshooting

### RLS Blocking Queries?
Temporarily disable for testing:
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE processing_logs DISABLE ROW LEVEL SECURITY;
```

### Realtime Not Working?
Check in Supabase Dashboard → **API Settings** → **Realtime** is enabled.

### Storage Upload Fails?
Verify the `reports` bucket exists and is set to Private.

---

🎉 **Setup Complete!** Your Track-It backend is now running with:
- ✅ Supabase database with mock user
- ✅ File storage for uploaded and generated files
- ✅ Real-time processing updates
- ✅ Full CRUD API for reports
