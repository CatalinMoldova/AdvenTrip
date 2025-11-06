/**
 * Environment Configuration
 * 
 * This file loads environment variables from .env file
 * DO NOT store actual keys in this file - they should be in .env
 */

const ENV = {
  UNSPLASH_ACCESS_KEY: process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY || '',
  UNSPLASH_SECRET_KEY: process.env.EXPO_PUBLIC_UNSPLASH_SECRET_KEY || '',
  UNSPLASH_APP_ID: process.env.EXPO_PUBLIC_UNSPLASH_APP_ID || '',
};

// Validate that keys are loaded
if (!ENV.UNSPLASH_ACCESS_KEY) {
  console.warn('⚠️  UNSPLASH_ACCESS_KEY is not set. Create a .env file with your keys.');
}

export default ENV;

