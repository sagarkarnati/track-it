-- Create mock user profile with strong password
INSERT INTO profiles (id, email, full_name, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'hr@company.com',
  'HR Manager',
  '/avatar.png'
) ON CONFLICT (id) DO NOTHING;

-- Note: For development without auth, we're using a mock UUID
-- In production, this would be replaced with actual Supabase Auth user IDs
