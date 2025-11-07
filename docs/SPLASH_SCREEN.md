# Splash Screen & Loading State

## Overview

Your app now displays a professional splash screen while checking authentication status on startup.

## How It Works

### 1. App Launch Flow

```
App Starts
    ↓
Show Splash Screen
    ↓
Check Supabase Session
    ↓
┌──────────────────────┐
│   Session Exists?    │
├──────────┬───────────┤
│   YES    │    NO     │
│    ↓     │     ↓     │
│ /(tabs)  │  /welcome │
└──────────┴───────────┘
```

### 2. Splash Screen Component (`components/splash-screen.tsx`)

Beautiful animated loading screen with:
- ✅ App logo/icon with pulse animation
- ✅ App name ("AdvenTrip")
- ✅ Loading spinner
- ✅ Smooth fade-in animation
- ✅ Theme-aware (light/dark mode)

### 3. Loading Logic (`app/_layout.tsx`)

```typescript
const [authLoading, setAuthLoading] = useState(true);

useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setAuth(session);
    
    // Small delay for smooth transition
    setTimeout(() => {
      setAuthLoading(false);
    }, 1000);
  };
  
  checkSession();
}, []);

if (authLoading) {
  return <SplashScreen />;
}
```

## Key Features

### ✅ Prevents Screen Flashing
Before: Users would see a flash of the wrong screen before redirecting.
After: Clean splash screen → correct destination.

### ✅ Checks Existing Session
On app start, checks if user is already logged in:
- If logged in → Navigate to `/(tabs)`
- If not logged in → Navigate to `/welcome`

### ✅ Smooth Animations
- Fade-in effect
- Pulsing logo animation
- Professional loading indicator

### ✅ Configurable Duration
Minimum 1 second display (adjustable):
```typescript
setTimeout(() => {
  setAuthLoading(false);
}, 1000); // Change this value
```

## Customizing the Splash Screen

### Change the Logo

Replace the emoji placeholder in `components/splash-screen.tsx`:

```typescript
// Current (emoji placeholder)
<View style={styles.logoPlaceholder}>
  <ThemedText style={styles.logoText}>🗺️</ThemedText>
</View>

// Replace with your logo image
<Image
  source={require('@/assets/images/logo.png')}
  style={{ width: 120, height: 120 }}
  contentFit="contain"
/>
```

### Change the App Name

```typescript
<ThemedText type="title" style={styles.appName}>
  AdvenTrip  {/* Change this */}
</ThemedText>
```

### Change Colors

```typescript
logoPlaceholder: {
  backgroundColor: '#007AFF',  // Change this
  // ...
}
```

### Change Loading Duration

In `app/_layout.tsx`:
```typescript
setTimeout(() => {
  setAuthLoading(false);
}, 2000); // 2 seconds instead of 1
```

## Navigation Logic

### Protected Routes
```typescript
useEffect(() => {
  if (authLoading) return; // Wait for auth check
  
  const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'welcome';
  
  if (user) {
    // Logged in: redirect to app if on auth screens
    if (inAuthGroup) {
      router.replace('/(tabs)');
    }
  } else {
    // Not logged in: redirect to welcome if accessing app
    if (!inAuthGroup) {
      router.replace('/welcome');
    }
  }
}, [user, segments, authLoading]);
```

### How It Protects Routes

**Scenario 1: User opens app (logged in)**
1. Splash screen shows
2. Session found
3. Navigate to `/(tabs)`

**Scenario 2: User opens app (not logged in)**
1. Splash screen shows
2. No session found
3. Navigate to `/welcome`

**Scenario 3: User manually navigates to login while logged in**
1. Detect user is on auth screen but has session
2. Auto-redirect to `/(tabs)`

**Scenario 4: User manually navigates to app while logged out**
1. Detect user is on app screen but no session
2. Auto-redirect to `/welcome`

## Testing

### Test First Launch (Not Logged In)
1. Clear app data
2. Open app
3. Should see: Splash → Welcome

### Test First Launch (Logged In)
1. Log in
2. Close app completely
3. Reopen app
4. Should see: Splash → Home

### Test Auto-Navigation
1. While logged in, try to go to `/login`
2. Should auto-redirect to `/(tabs)`

## Troubleshooting

**Issue**: Splash screen shows too briefly
- Increase timeout duration in `_layout.tsx`

**Issue**: Stuck on splash screen
- Check console for Supabase connection errors
- Verify `supabase.auth.getSession()` is working

**Issue**: Navigation not working
- Check that `user` state is being set correctly
- Verify segments are being read properly
- Check router is available

## Future Enhancements

Consider adding:
- [ ] Animated logo reveal
- [ ] Progress bar
- [ ] App version number
- [ ] Preload critical data during splash
- [ ] Error handling for network issues


