# Authentication Setup

## Overview

Your app now has a complete authentication system using Supabase with proper state management.

## How It Works

### 1. AuthContext (`contexts/AuthContext.tsx`)

Provides global authentication state across the app:

```typescript
const {user, setAuth, setUserData} = useAuth();
```

- `user`: Current session (null if not logged in)
- `setAuth`: Set the authentication session
- `setUserData`: Update user data

### 2. Auth Listener (`app/_layout.tsx`)

Automatically monitors authentication state changes:

```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setAuth(session);
    
    if (session) {
      // User is logged in - navigate to app
      router.replace('/(tabs)');
    } else {
      // User is logged out - navigate to welcome
      router.replace('/welcome');
    }
  });
  
  return () => subscription.unsubscribe();
}, [])
```

This listener automatically:
- ✅ Detects when user signs up
- ✅ Detects when user logs in
- ✅ Detects when user logs out
- ✅ Navigates to appropriate screen
- ✅ Updates global auth state

### 3. Sign Up Flow (`app/signup.tsx`)

When user creates an account:

1. Validates input fields
2. Calls Supabase signup:
   ```typescript
   await supabase.auth.signUp({
     email: emailCleaned,
     password: passwordCleaned,
     options: {
       data: {
         name: nameCleaned,
       },
     }
   });
   ```
3. Auth listener automatically detects new session
4. User is redirected to `/(tabs)` home screen

### 4. Login Flow (`app/login.tsx`)

When user logs in:

1. Validates input fields
2. Calls Supabase login:
   ```typescript
   await supabase.auth.signInWithPassword({
     email: emailCleaned,
     password: passwordCleaned,
   });
   ```
3. Auth listener automatically detects session
4. User is redirected to `/(tabs)` home screen

## Navigation Flow

```
App Start
    ↓
Check Onboarding
    ↓
┌──────────────┬────────────────┐
│   No Auth    │    Has Auth    │
│      ↓       │       ↓        │
│   Welcome    │    /(tabs)     │
│      ↓       │                │
│  Sign Up ────┼───→ Auth       │
│      or      │   Listener     │
│   Log In ────┘       ↓        │
│                  /(tabs)      │
└───────────────────────────────┘
```

## Bugs Fixed

### AuthContext.tsx
1. ✅ Missing `useContext` import
2. ✅ Missing TypeScript types
3. ✅ Improved error handling
4. ✅ Fixed `setUserData` to properly spread user data

### _layout.tsx
1. ✅ Fixed typo: `onAuthStateChagne` → `onAuthStateChange`
2. ✅ Fixed undefined `setSession` → `setAuth`
3. ✅ Added proper dependency array to useEffect
4. ✅ Added subscription cleanup
5. ✅ Added automatic navigation based on auth state

### signup.tsx
1. ✅ Fixed object syntax: `emailCleaned` → `email: emailCleaned`
2. ✅ Added user metadata (name) to signup
3. ✅ Added proper error handling
4. ✅ Added loading state management

### login.tsx
1. ✅ Already properly implemented with Supabase
2. ✅ Works with auth listener

## Testing Your Auth Flow

### Test Sign Up
1. Go to signup page
2. Fill in name, email, password
3. Click "Create Account"
4. Should automatically redirect to home screen
5. Check Supabase dashboard to see new user

### Test Login
1. Go to login page
2. Enter email and password from signup
3. Click "Log In"
4. Should automatically redirect to home screen

### Test Logout
Add a logout button in your app:

```typescript
const handleLogout = async () => {
  await supabase.auth.signOut();
  // Auth listener will automatically redirect to welcome
};
```

## Next Steps

1. **Add Logout Button**: Add to settings or profile page
2. **Email Verification**: Configure in Supabase dashboard
3. **Password Reset**: Add forgot password flow
4. **Social Auth**: Add Google/Apple sign-in
5. **Protected Routes**: Add route guards for sensitive pages

## Security Notes

- ✅ Passwords are never stored locally
- ✅ Sessions are stored in AsyncStorage (encrypted)
- ✅ Tokens auto-refresh when app is active
- ✅ All auth handled by Supabase securely

## Troubleshooting

**Issue**: User stuck on welcome screen after signup
- Check console for Supabase errors
- Verify email/password requirements in Supabase dashboard
- Check network connectivity

**Issue**: Navigation not working
- Ensure auth listener is running (check console logs)
- Verify Supabase connection
- Check router is available

**Issue**: Session not persisting
- Ensure AsyncStorage is properly installed
- Check Supabase client configuration
- Verify URL polyfill is imported


