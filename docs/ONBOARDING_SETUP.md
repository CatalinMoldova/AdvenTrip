# Onboarding Setup Guide

## Overview

The app now includes a two-screen onboarding flow that appears after user signup to collect:
1. **Location** - User's city
2. **Travel Interests** - User's travel preferences from predefined options

## Database Schema Requirements

You'll need to update your Supabase `users` table to include the following columns:

### Required Columns

| Column Name | Type | Nullable | Default | Description |
|------------|------|----------|---------|-------------|
| `location` | `text` | Yes | `NULL` | User's city/location |
| `travel_preferences` | `text[]` | Yes | `NULL` | Array of travel interest strings |
| `onboarding_completed` | `boolean` | Yes | `false` | Tracks if user completed onboarding |

### SQL Migration

Run this SQL in your Supabase SQL Editor:

```sql
-- Add location column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add travel_preferences column (array of text)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS travel_preferences TEXT[];

-- Add onboarding_completed column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create index for faster queries (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_users_onboarding 
ON users(onboarding_completed);

-- Create a trigger to automatically create a users table row when someone signs up
-- This ensures new users have a profile row even before completing onboarding
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, onboarding_completed, created_at)
  VALUES (NEW.id, FALSE, NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Note:** If your users table doesn't have a `created_at` column, you can remove it from the INSERT statement above.

## How It Works

### 1. Signup Flow

When a user signs up (`app/signup.tsx`):
- User creates account with email/password
- Instead of going directly to home, they're redirected to `/onboarding/location`

### 2. Location Screen (`app/onboarding/location.tsx`)

- Shows "Where are you from?" prompt
- User enters their city
- Progress indicator shows "Step 1 of 2"
- City is passed to next screen via route params
- Validates that city is entered before continuing

### 3. Interests Screen (`app/onboarding/interests.tsx`)

- Shows "What interests you?" prompt
- Displays all travel preferences as selectable chips
- User can select multiple interests
- Progress indicator shows "Step 2 of 2"
- On completion:
  - Updates Supabase `users` table with:
    - `location` - user's city
    - `travel_preferences` - array of selected interests
    - `onboarding_completed` - set to `true`
  - Redirects to home screen `/(tabs)`

## Travel Preferences

The following interests are available (defined in `types/user.ts`):

- Adventure
- Backpacking
- Beach
- Biking
- Budget Traveler
- City Tours
- Cuisine
- Culture
- Hiking
- History
- Luxury
- Nature Lover
- Nightlife
- Photography
- Road Trips
- Shopping
- Wildlife

## Files Created/Modified

### New Files:
- `app/onboarding/location.tsx` - First onboarding screen
- `app/onboarding/interests.tsx` - Second onboarding screen
- `docs/ONBOARDING_SETUP.md` - This documentation

### Modified Files:
- `types/user.ts` - Added new travel preferences
- `services/userService.ts` - Added `updateUserProfile()` function
- `app/signup.tsx` - Redirects to onboarding instead of home

## User Experience

```
Sign Up
   ↓
Onboarding: Location (Step 1/2)
   ↓
Onboarding: Interests (Step 2/2)
   ↓
Home Screen (/(tabs))
```

## Preventing Onboarding Re-entry (Optional)

If you want to prevent users who have completed onboarding from seeing it again, you can add a check in `app/_layout.tsx`:

```typescript
useEffect(() => {
  const checkOnboarding = async () => {
    const { data: userData } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', user?.user?.id)
      .single();
    
    if (userData && !userData.onboarding_completed) {
      router.replace('/onboarding/location');
    } else {
      router.replace('/(tabs)');
    }
  };
  
  if (user) {
    checkOnboarding();
  }
}, [user]);
```

## Testing

To test the onboarding flow:

1. Sign up with a new account
2. You should be redirected to the location screen
3. Enter a city and tap "Continue"
4. Select at least one interest
5. Tap "Complete Setup"
6. Verify you're redirected to the home screen
7. Check your Supabase database to confirm the data was saved

## Styling

Both screens follow the app's existing design patterns:
- Uses `AuthScreenWrapper` for consistent layout
- Uses themed components (`ThemedText`, `ThemedButton`, `ThemedInput`)
- Includes progress indicators
- Supports dark/light mode
- Includes haptic feedback
- Mobile-optimized with proper scrolling

