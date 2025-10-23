# Chat Feature Update Guide

## What's New? ✨

The chat feature has been updated with the following improvements:

### 1. ✅ **You won't see yourself** in the chat list
   - The current logged-in user is automatically excluded from the user list

### 2. ✅ **Recently active users shown first**
   - Online users appear at the top (with green dot 🟢)
   - Within each group (online/offline), users are sorted by most recent activity
   - See who was online most recently

### 3. ✅ **Better user information display**
   - User names, emails, and avatars are now properly displayed
   - User info is cached for better performance

## Database Update Required 🔧

If you **already created** the `user_presence` table before, you need to add new columns.

### Option 1: Run Migration SQL (Recommended)

1. Open your Supabase SQL Editor
2. Copy and paste this SQL:

```sql
-- Add user information columns to user_presence table
ALTER TABLE user_presence 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

3. Click "Run"
4. Done! ✅

### Option 2: Drop and Recreate Table

If you prefer to start fresh:

1. **Delete old table**:
```sql
DROP TABLE IF EXISTS user_presence CASCADE;
```

2. **Create new table** using the updated SQL from `SUPABASE_SCHEMA.md`

## How It Works Now 🎯

### User List Sorting:
1. **Online users first** (status = 'online')
2. **Most recently active** within each group
3. **Current user excluded** automatically

### When you open the Chat tab:
1. Your status is set to "online"
2. Your user info (email, name, avatar) is stored in the presence table
3. Other users see you as online
4. You see other users sorted by recent activity

### Example Order:
```
💬 Messages
2 online

🟢 John Doe        (Online)          ← Online, most recent
🟢 Jane Smith      (Online)          ← Online, less recent
⚪ Bob Johnson     (Last seen 5m ago) ← Offline, most recent
⚪ Alice Williams  (Last seen 1h ago) ← Offline, less recent
```

## Testing the Updates 🧪

1. **Update your database** (run the migration SQL above)

2. **Restart your app**:
   ```bash
   # Stop the metro bundler (Ctrl+C)
   npm start
   
   # In another terminal
   npx react-native run-android  # or run-ios
   ```

3. **Test with multiple users**:
   - Sign in with User A on device 1
   - Sign in with User B on device 2
   - Open Chat tab on both devices
   - You should see:
     - User A doesn't see themselves, only User B
     - User B doesn't see themselves, only User A
     - Both show as online with green dots

4. **Test recent activity**:
   - Sign out User B
   - User A should see User B as offline with "Last seen X ago"
   - Sign in User B again
   - User A should see User B back online

## What Changed in the Code? 📝

### Updated Files:
- `src/types/api.ts` - Added user info fields to UserPresence
- `src/services/presenceService.ts` - Now stores user info when going online
- `src/components/UserListItem.tsx` - Uses user info from presence data
- `SUPABASE_SCHEMA.md` - Updated table schema

### Key Improvements:
1. User information is now stored in the `user_presence` table
2. No need for complex joins or admin API calls
3. Better performance with local data
4. Automatic user exclusion (you never see yourself)
5. Smart sorting (online + recent first)

## Troubleshooting 🔍

### "I still see myself in the list"
- Make sure you ran the migration SQL
- Restart your app completely
- Check that presenceService is properly excluding current user

### "User names show as 'User' only"
- User info is populated when users go online
- Have both test users sign out and sign in again
- This will populate their info in the presence table

### "Sorting doesn't look right"
- Pull down to refresh the user list
- Make sure the migration SQL was executed successfully
- Check console for any errors

### "Migration SQL fails"
- If columns already exist, that's OK (the SQL uses `IF NOT EXISTS`)
- If you get other errors, try the "Drop and Recreate" option

## Summary 📊

**Before:**
- ❌ Could see yourself in the list
- ❌ No specific sorting
- ❌ Missing user information

**After:**
- ✅ Never see yourself
- ✅ Smart sorting (online + recent activity)
- ✅ Full user info displayed
- ✅ Better performance

Enjoy your improved chat experience! 🎉


