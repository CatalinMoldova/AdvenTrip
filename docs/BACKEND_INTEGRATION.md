# Backend Integration Guide - User Profile

This document explains how to integrate the user profile feature with your backend/auth system.

## Overview

The profile system is designed to be easily integrated with a backend API. All user data flows through a React Context (`UserContext`), making it simple to replace mock data with real API calls.

## File Structure

```
├── types/user.ts                 # Type definitions for user data
├── contexts/UserContext.tsx       # User state management
├── app/(tabs)/profile.tsx         # Profile display screen
└── app/edit-profile.tsx           # Profile editing screen
```

## Integration Steps

### 1. Update User Types (if needed)

Edit `types/user.ts` to add any additional fields required by your backend:

```typescript
export interface UserProfile {
  id: string;              // Match your backend user ID format
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  location?: string;
  profilePicture?: string; // Add URL handling for actual images
  followersCount: number;
  followingCount: number;
  travelPreferences: string[];
  // Add any additional backend fields here
}
```

### 2. Connect to Auth System

Update `contexts/UserContext.tsx` to fetch user data from your auth system:

```typescript
export function UserProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with user data from your auth system
  useEffect(() => {
    async function loadUser() {
      try {
        // Example: Get auth token
        const token = await getAuthToken();
        
        // Fetch user profile from your API
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUser();
  }, []);
  
  // ... rest of the context
}
```

### 3. Implement Profile Updates

The `updateUserProfile` function in `UserContext.tsx` has commented examples. Uncomment and modify:

```typescript
const updateUserProfile = async (updates: Partial<UserProfile>) => {
  setIsLoading(true);
  
  try {
    const token = await getAuthToken();
    
    const response = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    const updatedProfile = await response.json();
    setUserProfile(updatedProfile);
  } catch (error) {
    console.error('Failed to update profile:', error);
    // Show error to user
  } finally {
    setIsLoading(false);
  }
};
```

### 4. Add Profile Picture Upload

To implement profile picture upload in `app/edit-profile.tsx`:

```typescript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    // Upload to your backend
    const formData = new FormData();
    formData.append('image', {
      uri: result.assets[0].uri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    const response = await fetch('/api/user/profile-picture', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    updateUserProfile({ profilePicture: data.url });
  }
};
```

### 5. Required Packages

For profile picture upload, install:

```bash
npx expo install expo-image-picker
```

## API Endpoints (Backend)

Your backend should implement these endpoints:

- `GET /api/user/profile` - Get current user profile
- `PATCH /api/user/profile` - Update user profile fields
- `POST /api/user/profile-picture` - Upload profile picture
- `GET /api/user/followers` - Get followers (if implementing followers list)
- `GET /api/user/following` - Get following (if implementing following list)

## Authentication

The current implementation uses a React Context. When integrating with auth:

1. Use your auth provider (Firebase, Auth0, custom, etc.)
2. Update `UserProvider` to check auth state
3. Redirect to login if not authenticated
4. Load user profile after successful authentication

## Example Integration with Expo Auth Session

```typescript
import * as AuthSession from 'expo-auth-session';

// In your UserContext
useEffect(() => {
  const checkAuth = async () => {
    const session = await AuthSession.getSession();
    if (session?.user) {
      await loadUserProfile(session.user.id);
    } else {
      // Redirect to login
      router.replace('/login');
    }
  };
  
  checkAuth();
}, []);
```

## Testing

Mock data is available in `types/user.ts` (`MOCK_USER`) for development and testing.

## Notes

- All user data flows through `UserContext`, making it easy to add caching, optimistic updates, etc.
- The UI is fully functional and will work with any backend that provides the `UserProfile` type
- Consider adding error handling and loading states in the UI
- Consider adding form validation on the backend as well as frontend

