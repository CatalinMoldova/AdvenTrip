# How to Add Posts Manually to Supabase

This guide shows you how to manually insert posts into your `posts` table with JSONB image links.

## Method 1: Using Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Create a new query
4. Paste the SQL below and run it

## Example SQL INSERT Statements

### Option 1: Image links as an array of strings

```sql
-- Insert posts with image links as a JSONB array
INSERT INTO posts (title, description, image_links, user_id, created_at)
VALUES 
  (
    'Beautiful Beach in Bali',
    'Amazing sunset view from the beach',
    '["https://images.unsplash.com/photo-1507525421304-6f5e5b5b5b5b?w=800", "https://images.unsplash.com/photo-1507525421304-6f5e5b5b5b5b?w=800"]'::jsonb,
    (SELECT id FROM users LIMIT 1), -- Replace with actual user_id or use a specific user
    NOW()
  ),
  (
    'Mountain Adventure',
    'Hiking through the mountains',
    '["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"]'::jsonb,
    (SELECT id FROM users LIMIT 1),
    NOW()
  ),
  (
    'City Lights',
    'Night view of the city',
    '["https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800", "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800", "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800"]'::jsonb,
    (SELECT id FROM users LIMIT 1),
    NOW()
  );
```

### Option 2: Image links as an object with metadata

```sql
-- Insert posts with image links as a JSONB object (more structured)
INSERT INTO posts (title, description, image_links, user_id, created_at)
VALUES 
  (
    'Tropical Paradise',
    'Relaxing by the ocean',
    '{
      "images": [
        "https://images.unsplash.com/photo-1507525421304-6f5e5b5b5b5b?w=800",
        "https://images.unsplash.com/photo-1507525421304-6f5e5b5b5b5b?w=800"
      ],
      "thumbnail": "https://images.unsplash.com/photo-1507525421304-6f5e5b5b5b5b?w=400"
    }'::jsonb,
    (SELECT id FROM users LIMIT 1),
    NOW()
  ),
  (
    'Desert Safari',
    'Exploring the desert',
    '{
      "images": [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
      ],
      "thumbnail": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
    }'::jsonb,
    (SELECT id FROM users LIMIT 1),
    NOW()
  );
```

### Option 3: Simple array format (most common)

```sql
-- Simple array format - easiest to work with
INSERT INTO posts (title, description, image_links, user_id, created_at)
VALUES 
  (
    'Beach Sunset',
    'Watching the sunset on the beach',
    '["https://images.unsplash.com/photo-1507525421304-6f5e5b5b5b5b?w=800"]'::jsonb,
    (SELECT id FROM users LIMIT 1),
    NOW()
  ),
  (
    'Mountain Peak',
    'Reached the summit!',
    '["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"]'::jsonb,
    (SELECT id FROM users LIMIT 1),
    NOW()
  ),
  (
    'Urban Exploration',
    'Exploring the city streets',
    '["https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800"]'::jsonb,
    (SELECT id FROM users LIMIT 1),
    NOW()
  );
```

## Using a Specific User ID

If you want to assign posts to a specific user, replace `(SELECT id FROM users LIMIT 1)` with the actual user ID:

```sql
INSERT INTO posts (title, description, image_links, user_id, created_at)
VALUES 
  (
    'My Adventure',
    'Description here',
    '["https://example.com/image1.jpg", "https://example.com/image2.jpg"]'::jsonb,
    'your-user-id-here', -- Replace with actual UUID
    NOW()
  );
```

## Getting a User ID

To get a user ID from your database:

```sql
-- View all users and their IDs
SELECT id, email, name FROM users;

-- Or get a specific user
SELECT id FROM users WHERE email = 'user@example.com';
```

## Additional Fields

If your `posts` table has other fields, add them to the INSERT statement:

```sql
INSERT INTO posts (
  title, 
  description, 
  image_links, 
  user_id, 
  location,
  tags,
  created_at
)
VALUES 
  (
    'Post Title',
    'Post description',
    '["https://example.com/image.jpg"]'::jsonb,
    (SELECT id FROM users LIMIT 1),
    'Bali, Indonesia',
    ARRAY['beach', 'sunset', 'travel'],
    NOW()
  );
```

## Verify Your Posts

After inserting, verify the posts were added:

```sql
-- View all posts
SELECT * FROM posts ORDER BY created_at DESC;

-- View posts with formatted JSONB
SELECT 
  id,
  title,
  description,
  image_links,
  user_id,
  created_at
FROM posts
ORDER BY created_at DESC;
```

## Notes

- Replace the image URLs with your actual external image links
- The `::jsonb` cast is required to tell PostgreSQL to treat the string as JSONB
- Make sure your `user_id` references an existing user in the `users` table
- Adjust field names (`title`, `description`, etc.) to match your actual table schema

