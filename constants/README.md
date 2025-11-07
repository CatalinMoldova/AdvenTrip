# Constants Directory

## Setup Instructions

This directory contains sensitive API keys and credentials that should **never** be committed to git.

### First Time Setup

1. Copy the example file:
   ```bash
   cp constants/index.example.ts constants/index.ts
   ```

2. Open `constants/index.ts` and replace the placeholder values with your actual credentials from [Supabase Dashboard](https://app.supabase.com)

3. The `index.ts` file is already ignored by git, so your credentials will remain local only.

## ⚠️ Security Note

The `index.ts` file is listed in `.gitignore` to prevent accidentally committing sensitive credentials. 

**Never commit files containing:**
- API keys
- Authentication tokens
- Passwords
- Private keys
- Any other sensitive credentials

## Better Alternative: Environment Variables

For production apps, consider using environment variables instead:

1. Store credentials in `.env` file (already in `.gitignore`):
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_url_here
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   ```

2. Access them in your code:
   ```typescript
   export const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
   export const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
   ```

3. Use EAS Secrets for production builds:
   ```bash
   eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value your_url_here
   eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value your_key_here
   ```

Learn more: https://docs.expo.dev/build-reference/variables/


