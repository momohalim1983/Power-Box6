-- Supabase Admin Setup SQL
-- Run this in your Supabase SQL Editor to set up admin authentication

-- 1. Enable Row Level Security on auth.users (if not already enabled)
-- This is typically enabled by default in Supabase

-- 2. Create admin_users table to track admin access
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id),
    UNIQUE(email)
);

-- 3. Enable Row Level Security on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for admin_users table
-- Only allow service role to manage admin_users
CREATE POLICY "Service role can manage admin_users" ON public.admin_users
    FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read their own admin status
CREATE POLICY "Users can read own admin status" ON public.admin_users
    FOR SELECT USING (auth.uid() = user_id);

-- 5. Create function to automatically sync user email changes
CREATE OR REPLACE FUNCTION public.sync_admin_user_email()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.admin_users 
    SET email = NEW.email, updated_at = NOW()
    WHERE user_id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger to sync email changes
DROP TRIGGER IF EXISTS sync_admin_user_email_trigger ON auth.users;
CREATE TRIGGER sync_admin_user_email_trigger
    AFTER UPDATE OF email ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_admin_user_email();

-- 7. Create function to add new admin users
CREATE OR REPLACE FUNCTION public.add_admin_user(admin_email TEXT)
RETURNS JSON AS $$
DECLARE
    user_record auth.users%ROWTYPE;
    result JSON;
BEGIN
    -- Check if user exists in auth.users
    SELECT * INTO user_record FROM auth.users WHERE email = admin_email;
    
    IF user_record.id IS NULL THEN
        result := json_build_object(
            'success', false, 
            'message', 'User not found. Please ensure the user has signed up first.'
        );
        RETURN result;
    END IF;
    
    -- Add to admin_users table
    INSERT INTO public.admin_users (user_id, email)
    VALUES (user_record.id, admin_email)
    ON CONFLICT (user_id) DO UPDATE SET
        is_active = true,
        updated_at = NOW();
    
    result := json_build_object(
        'success', true, 
        'message', 'Admin user added successfully',
        'user_id', user_record.id
    );
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to remove admin access
CREATE OR REPLACE FUNCTION public.remove_admin_user(admin_email TEXT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    UPDATE public.admin_users 
    SET is_active = false, updated_at = NOW()
    WHERE email = admin_email;
    
    IF FOUND THEN
        result := json_build_object(
            'success', true, 
            'message', 'Admin access removed successfully'
        );
    ELSE
        result := json_build_object(
            'success', false, 
            'message', 'Admin user not found'
        );
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.admin_users TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_admin_user(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_admin_user(TEXT) TO authenticated;

-- 10. Insert your first admin user (REPLACE WITH YOUR EMAIL)
-- IMPORTANT: First create a user account through the normal Supabase Auth flow
-- Then uncomment and run the line below with your email:

-- SELECT public.add_admin_user('your-admin-email@example.com');

-- ===================================================================
-- INSTRUCTIONS:
-- ===================================================================
-- 
-- 1. Run this entire SQL script in your Supabase SQL Editor
-- 
-- 2. Create your first admin user:
--    a. Go to Authentication > Users in your Supabase dashboard
--    b. Click "Add user" or use the sign-up flow on your app
--    c. Create a user with email/password
--    d. Copy the email address
--    e. Run this SQL command (replace with your email):
--       SELECT public.add_admin_user('your-email@example.com');
-- 
-- 3. Your admin authentication is now set up!
-- 
-- ===================================================================
-- MANAGEMENT COMMANDS:
-- ===================================================================
-- 
-- Add a new admin user:
-- SELECT public.add_admin_user('new-admin@example.com');
-- 
-- Remove admin access:
-- SELECT public.remove_admin_user('admin@example.com');
-- 
-- View all admin users:
-- SELECT * FROM public.admin_users WHERE is_active = true;
-- 
-- ===================================================================
