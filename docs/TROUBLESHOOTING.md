# Troubleshooting Guide

## Common Issues

### Issue: Flight Search Not Loading

**Symptoms:**
- Flight tab shows but doesn't load flights
- Console errors about import paths
- "Cannot find module" errors

**Solutions:**

1. **Check Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Should see: `🚀 Backend server running on http://localhost:3001`

2. **Check Frontend Server**
   ```bash
   npm run dev
   ```
   Should be running on `http://localhost:5173`

3. **Import Path Issues**
   The import uses the `@` alias configured in `vite.config.ts`:
   ```typescript
   import { searchFlights } from '@/src/services/flightApi';
   ```
   
   If this doesn't work, check:
   - `vite.config.ts` has alias configured
   - File exists at `src/services/flightApi.ts`
   - TypeScript knows about the path alias

4. **Check Browser Console**
   Open DevTools (F12) and look for errors in the Console tab.

### Issue: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- Network tab shows OPTIONS request failing

**Solution:**
Backend already has CORS enabled. If still having issues:

```javascript
// In backend/server.js
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
```

### Issue: Backend Not Starting

**Symptoms:**
- Port 3001 already in use
- Cannot bind to port error

**Solution:**
```bash
# Find what's using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3002 npm start
```

### Issue: API Returns Empty Results

**Current Status:** The backend returns mock data. To get real flight data:

1. Get Bright Data API credentials
2. Configure zones in Bright Data dashboard
3. Update `backend/server.js` to use real API calls

See `docs/MCP_INTEGRATION.md` for details.

### Issue: Import Errors in FlightSearchTab

**Check these:**

1. File exists: `src/services/flightApi.ts`
2. Import path in `components/FlightSearchTab.tsx`:
   ```typescript
   import { searchFlights } from '@/src/services/flightApi';
   ```
3. TypeScript configuration allows this import

### Issue: Toast Notifications Not Showing

**Check:**

1. `Toaster` component is rendered in `App.tsx`
2. `sonner` package is installed (check `package.json`)
3. No CSS conflicts

### Issue: Date Format Errors

**Symptoms:**
- Invalid date errors
- Dates display as NaN

**Solution:**
Make sure dates are in ISO format: `YYYY-MM-DD`

```typescript
const departureDate = '2024-12-15'; // ✅ Correct
const departureDate = '12/15/2024'; // ❌ Wrong
```

## Debugging Steps

### 1. Check All Services Running

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
npm run dev

# Terminal 3: Check ports
lsof -i :3001 -i :5173
```

### 2. Check Browser Console

Open DevTools (F12) → Console tab
Look for:
- Red error messages
- Failed network requests
- Import/module errors

### 3. Check Network Tab

DevTools → Network tab
Look for:
- Failed API calls to `/api/flights/search`
- Status codes (should be 200)
- Response payload

### 4. Check Terminal Output

Backend terminal should show:
```
🚀 Backend server running on http://localhost:3001
```

Frontend terminal should show:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

## Still Having Issues?

1. Check `docs/MCP_INTEGRATION.md` for full setup
2. Verify all dependencies installed:
   ```bash
   npm install
   cd backend && npm install
   ```
3. Clear browser cache and restart dev servers
4. Check for duplicate dependencies or version conflicts

## Getting Help

Include this information when asking for help:

1. Error message from browser console
2. Error message from terminal
3. What you were trying to do
4. Your environment (OS, Node version)
5. Network tab screenshot showing failed requests

