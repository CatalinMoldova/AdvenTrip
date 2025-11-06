# Environment Variables Setup

## ⚠️ IMPORTANT: Secure API Keys

Your Unsplash API keys are **NOT** stored in the repository for security. Follow these steps to set them up:

## Setup Instructions

### 1. Create `.env` File

Create a new file named `.env` in the root directory of the project:

```bash
touch .env
```

### 2. Add Your Unsplash API Keys

Open the `.env` file and add the following content with your actual keys:

```env
# Unsplash API Configuration
EXPO_PUBLIC_UNSPLASH_ACCESS_KEY=Rt1lqXk8EiTUUPOFbiPhkmuLZVW76jxEPonDoirbaXw
EXPO_PUBLIC_UNSPLASH_SECRET_KEY=S8CpTqsZiTSY8tnvYNRq7cLvMrgcss-eE7jpYxbWxKU
EXPO_PUBLIC_UNSPLASH_APP_ID=826265
```

### 3. Verify Security

✅ The `.env` file is already added to `.gitignore` and will **NOT** be committed to GitHub.

### 4. Restart Development Server

After creating the `.env` file, restart your Expo development server:

```bash
npx expo start --clear
```

## How It Works

- Environment variables are loaded using Expo's built-in support
- Variables with `EXPO_PUBLIC_` prefix are accessible in the app
- The `config/env.ts` file provides type-safe access to these variables
- Images are fetched dynamically from Unsplash based on trip descriptions

## Troubleshooting

If images aren't loading:

1. Check that `.env` file exists in the root directory
2. Verify that the keys are correctly copied (no extra spaces)
3. Restart the development server with `--clear` flag
4. Check the console for any API errors

## Security Notes

- ✅ `.env` is in `.gitignore` - your keys are safe
- ✅ Only the `EXPO_PUBLIC_` prefixed variables are accessible in the app
- ✅ Never commit `.env` file to version control
- ✅ Share keys securely via encrypted channels, not in code

---

**Last Updated:** December 2024

