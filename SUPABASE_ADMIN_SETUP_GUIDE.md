# 🔐 Supabase Admin Authentication Setup Guide

This guide will help you set up the new Supabase-based admin authentication system that replaces the hardcoded password system.

## ✅ What's Changed

- ❌ **Removed**: Hardcoded password (`admin123`)
- ✅ **Added**: Supabase email/password authentication
- ✅ **Added**: Persistent sessions that survive page reloads
- ✅ **Added**: User management through Supabase Dashboard
- ✅ **Added**: Secure admin_users table for access control

## 🚀 Quick Setup (5 minutes)

### Step 1: Update Environment Variables ✅
**Already done!** The following environment variables have been set:
- `VITE_SUPABASE_URL`: https://mylaafierzsaabrmhcml.supabase.co
- `VITE_SUPABASE_ANON_KEY`: [Your anon key]
- `VITE_SUPABASE_SERVICE_ROLE_KEY`: [Your service role key]

### Step 2: Run Database Setup
1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire content of `supabase-admin-setup.sql`
4. Click **Run** to execute the SQL

### Step 3: Create Your First Admin User
1. In Supabase Dashboard, go to **Authentication > Users**
2. Click **Add user** (or use your app's sign-up if available)
3. Create a user with:
   - **Email**: Your admin email (e.g., `admin@yourcompany.com`)
   - **Password**: Your secure admin password
   - **Email Confirm**: ✅ (check this)
4. Copy the email address

### Step 4: Grant Admin Access
1. Go back to **SQL Editor** in Supabase
2. Run this command (replace with your email):
   ```sql
   SELECT public.add_admin_user('your-email@example.com');
   ```
3. You should see a success message

### Step 5: Test Login
1. Navigate to `/admin` on your website
2. Use the email and password you created
3. You should be logged in to the admin panel!

## 🔧 Managing Admin Users

### Add New Admin Users
```sql
-- In Supabase SQL Editor
SELECT public.add_admin_user('new-admin@example.com');
```

### Remove Admin Access
```sql
-- In Supabase SQL Editor
SELECT public.remove_admin_user('admin@example.com');
```

### View All Admin Users
```sql
-- In Supabase SQL Editor
SELECT * FROM public.admin_users WHERE is_active = true;
```

### Change Admin Password
1. Go to **Authentication > Users** in Supabase Dashboard
2. Find the user and click on them
3. Click **Reset Password** or **Update Password**

## 🛡️ Security Features

### ✅ What's Secure Now
- **Email/Password Authentication**: No more hardcoded passwords
- **Session Persistence**: Sessions survive page reloads
- **Role-Based Access**: Only designated admin users can access
- **Database-Controlled**: All user management through Supabase
- **Automatic Session Management**: Handles login/logout automatically

### 🔒 Row Level Security (RLS)
- Admin users table is protected with RLS
- Only service role can manage admin users
- Users can only read their own admin status

## 🚨 Important Notes

### Password Requirements
- Use strong passwords (8+ characters, mixed case, numbers, symbols)
- Change passwords through Supabase Dashboard only
- Never hardcode passwords in the application code

### Email Requirements
- Must be valid email addresses
- Case-sensitive matching
- Each email can only be an admin once

### Session Management
- Sessions persist across browser refreshes
- Automatic logout after session expires
- Manual logout available in admin panel

## 🔍 Troubleshooting

### "User not found" Error
- **Problem**: Trying to add admin access for non-existent user
- **Solution**: Create the user in Authentication > Users first

### "Missing Supabase environment variables" Error
- **Problem**: Environment variables not set correctly
- **Solution**: Dev server environment variables are already set correctly

### Cannot Access Admin Panel
- **Problem**: User exists but no admin access
- **Solution**: Run `SELECT public.add_admin_user('your-email@example.com');`

### "You do not have admin access" Error
- **Problem**: User authenticated but not in admin_users table
- **Solution**: Add user to admin_users table using SQL command

## 📝 Database Schema

### admin_users Table
```sql
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Available Functions
- `add_admin_user(email)`: Grant admin access
- `remove_admin_user(email)`: Revoke admin access
- `sync_admin_user_email()`: Keep emails in sync

## 🎯 Benefits of New System

1. **🔐 Enhanced Security**: No hardcoded credentials
2. **👥 Multi-User Support**: Multiple admin accounts
3. **🔄 Easy Management**: Add/remove admins through database
4. **📱 Session Persistence**: No re-login after refresh
5. **🛡️ Supabase Integration**: Full integration with Supabase Auth
6. **🔍 Audit Trail**: Track admin user changes
7. **⚡ Real-time**: Immediate access control updates

## 📞 Need Help?

If you encounter any issues:

1. **Check the browser console** for error messages
2. **Verify environment variables** are set correctly
3. **Confirm user exists** in Supabase Authentication > Users
4. **Check admin_users table** has the user with `is_active = true`
5. **Try logging out and back in** to refresh the session

---

**🎉 You're all set!** Your admin panel now uses secure Supabase authentication with proper user management.
