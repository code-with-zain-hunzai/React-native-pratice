# Supabase Database Schema for Chat Feature

This document describes the database tables and setup required for the real-time chat feature.

## Tables to Create in Supabase

### 1. Messages Table

```sql
-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
-- Users can read messages they sent or received
CREATE POLICY "Users can read their own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can insert messages they are sending
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can update messages they received (to mark as read)
CREATE POLICY "Users can update messages they received"
  ON messages FOR UPDATE
  USING (auth.uid() = receiver_id);
```

### 2. User Presence Table

```sql
-- Create user_presence table
CREATE TABLE user_presence (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline')),
  email TEXT,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_user_presence_status ON user_presence(status);

-- Enable Row Level Security
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

-- Create policies for user_presence
-- Everyone can read presence data
CREATE POLICY "Anyone can read user presence"
  ON user_presence FOR SELECT
  USING (true);

-- Users can only update their own presence
CREATE POLICY "Users can update their own presence"
  ON user_presence FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presence status"
  ON user_presence FOR UPDATE
  USING (auth.uid() = user_id);
```

### 3. Create a function to update user presence automatically

```sql
-- Function to update last_seen timestamp
CREATE OR REPLACE FUNCTION update_user_presence_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_seen = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp
CREATE TRIGGER update_user_presence_timestamp
  BEFORE UPDATE ON user_presence
  FOR EACH ROW
  EXECUTE FUNCTION update_user_presence_timestamp();
```

## Enable Realtime

After creating the tables, enable realtime replication:

```sql
-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime for user_presence table
ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each section above and run them in order
4. Verify that the tables are created in the Table Editor
5. Verify that Row Level Security is enabled for both tables
6. Test the realtime functionality in the Supabase dashboard

## Notes

- The `messages` table stores all chat messages between users
- The `user_presence` table tracks which users are online/offline
- Row Level Security ensures users can only access their own messages
- Realtime subscriptions allow instant message delivery and presence updates
- All timestamps are stored in UTC with timezone information

