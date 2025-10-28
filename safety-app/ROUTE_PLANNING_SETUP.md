# Safety-Aware Route Planning Setup Guide

## Overview

The app now features intelligent route planning that:
- Calculates multiple routes between your location and destination
- Evaluates each route's safety using ML risk predictions
- Color-codes routes: Green (safe) → Yellow (moderate) → Red (high risk)
- Automatically selects the safest route
- Shows distance, duration, and safety percentage for each route

## Google Maps API Setup

### Step 1: Get a Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a new project** (or select existing one)
   - Click "Select a project" → "New Project"
   - Name it (e.g., "Women Safety App")
   - Click "Create"

3. **Enable required APIs**
   - Go to "APIs & Services" → "Library"
   - Search and enable these APIs:
     - **Directions API** (for route calculation)
     - **Geocoding API** (for address → coordinates conversion)

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key (looks like: `AIzaSyC...`)

5. **Secure your API Key** (Important!)
   - Click on your API key to edit it
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose only:
       - Directions API
       - Geocoding API
   - Under "Application restrictions":
     - For development: "None" (temporarily)
     - For production: Restrict to iOS/Android apps
   - Click "Save"

### Step 2: Add API Key to Your App

Open `/womens-safety-app/app/(tabs)/index.tsx` and find **two locations** where it says:

```typescript
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
```

Replace both instances with your actual API key:

```typescript
const GOOGLE_MAPS_API_KEY = 'AIzaSyC...your-actual-key...';
```

**Location 1**: In `calculateRoutes()` function (around line 276)
**Location 2**: In `geocodeDestination()` function (around line 354)

### Step 3: Optional - Use Environment Variables (Recommended)

For better security, store the API key in environment variables:

1. Create `.env.local` in `womens-safety-app/` directory:
   ```
   GOOGLE_MAPS_API_KEY=AIzaSyC...your-actual-key...
   ```

2. Add to `.gitignore` (should already be there):
   ```
   .env.local
   ```

3. Update the code to use the env variable:
   ```typescript
   const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
   ```

## How to Use

### Basic Usage

1. **Open the app** - Your current location will be detected
2. **Enter a destination** in the search box at the top
   - Examples:
     - "Union Square, San Francisco"
     - "Golden Gate Park, SF"
     - "1234 Market St, San Francisco"
3. **Tap the search button** 🔍 or press "Search" on keyboard
4. **Wait for routes to calculate** (a few seconds)
5. **View the routes**:
   - Multiple colored lines will appear on the map
   - Green = Safe route
   - Yellow/Orange = Moderate risk
   - Red = High risk
6. **Tap a route** to select it (it will get thicker)
7. **Compare routes** in the panel showing:
   - Safety percentage
   - Distance in km
   - Estimated walking time

### Understanding the Routes

**Route Panel Information:**
- **Route 1, 2, 3...**: Routes are numbered
- **SAFE/MODERATE/HIGH**: Overall risk level
- **Safety: 85%**: Percentage of route that's safe (higher is better)
- **2.3 km**: Total distance
- **28 min**: Estimated walking time

**Map Display:**
- **Thick line**: Currently selected route
- **Thin lines**: Alternative routes
- **Colors**: Match the risk level (green/yellow/red)
- **Tap any route**: To select and view details

### How Safety is Calculated

The app:
1. Gets multiple route options from Google Maps
2. Samples ~20 points along each route
3. Checks ML risk prediction for each point
4. Averages the risk scores
5. Assigns safety level:
   - **Safe** (< 30% risk): Green
   - **Moderate** (30-70% risk): Yellow/Orange
   - **High** (> 70% risk): Red
6. Sorts routes with safest first

## Features

### Automatic Route Selection
- The **safest route** is automatically selected (Route 1)
- You can tap any alternative route to switch

### Real-Time Risk
- Risk is calculated based on current time and day
- Same route may be different risk at night vs. day

### Walking Directions
- Routes are optimized for walking
- Can be changed to driving/biking in code (mode=walking)

### Multiple Alternatives
- Google provides up to 3 alternative routes
- All are evaluated for safety

## Testing

### Test Destinations in San Francisco

Safe areas:
```
Financial District, San Francisco
Fisherman's Wharf, San Francisco
Golden Gate Park, SF
```

Higher risk areas (for testing):
```
Tenderloin, San Francisco
Mission District after dark
```

### Expected Behavior

1. **Enter**: "Golden Gate Park, San Francisco"
2. **Results**: Should show 2-3 routes
3. **Selected**: Route 1 (safest) - likely GREEN
4. **Alternatives**: May be YELLOW or RED
5. **Panel**: Shows safety %, distance, time for each

## Troubleshooting

### "Could not find routes to destination"
**Causes**:
- Invalid API key
- API not enabled in Google Cloud Console
- Destination address not found
- No walking route available

**Solutions**:
- Check API key is correct
- Verify Directions API is enabled
- Try a more specific address
- Check console logs for detailed error

### "Failed to calculate routes"
**Causes**:
- No internet connection
- API quota exceeded (free tier: 2,500 requests/day)
- Backend not running

**Solutions**:
- Check internet connection
- Verify you haven't exceeded quota
- Make sure backend is running (`python3 backend/app.py`)

### Routes look wrong
**Causes**:
- Testing on simulator with default location
- User location not accurate

**Solutions**:
- Set custom location in simulator
- Test on physical device
- Check console logs for actual coordinates

### "API key not found" error
**Solution**:
- Make sure you replaced both instances of `'YOUR_GOOGLE_MAPS_API_KEY'`
- Check for typos in the API key

## API Costs & Limits

### Google Maps Free Tier
- **$200 free credit** per month
- **Directions API**: $5 per 1,000 requests
- **Geocoding API**: $5 per 1,000 requests
- **Free monthly requests**: ~2,500 route calculations

### One route calculation uses:
- 1 Geocoding request (destination address → coords)
- 1 Directions request (get routes)
- ~20 ML predictions (check risk along route)

### Cost per route: ~$0.01
### Free tier allows: ~2,500 routes/month

## Console Output

When calculating routes, check the console for:

```
📊 Routes calculated:
  Route 1: safe (25.3% risk)
  Route 2: moderate (48.7% risk)
  Route 3: high (72.1% risk)
```

## Privacy & Security

### API Key Security
- ⚠️ Never commit API keys to git
- ✅ Use `.env.local` for local development
- ✅ Restrict API key to specific APIs
- ✅ For production: Restrict to iOS/Android bundle IDs

### Data Privacy
- Routes are calculated client-side
- No route data is stored on backend
- Only lat/lon sent to ML model for risk prediction

## Next Steps

After setup:
1. Enter a destination and test the routing
2. Compare multiple routes to see safety differences
3. Try different times of day (risk changes based on hour)
4. Test various San Francisco neighborhoods

## Advanced Customization

### Change Travel Mode
In `calculateRoutes()` function, change `mode=walking` to:
- `mode=driving`
- `mode=bicycling`
- `mode=transit`

### Adjust Safety Sampling
In `evaluateRouteSafety()`, change sampling:
```typescript
// More samples (slower but more accurate)
const sampleInterval = Math.max(1, Math.floor(coordinates.length / 50));

// Fewer samples (faster but less accurate)
const sampleInterval = Math.max(1, Math.floor(coordinates.length / 10));
```

### Custom Risk Thresholds
In `calculateRoutes()`, adjust safety levels:
```typescript
if (safetyScore < 0.2) {  // Very strict (only very safe routes)
  riskLevel = 'safe';
} else if (safetyScore < 0.5) {  // Less strict
  riskLevel = 'moderate';
} else {
  riskLevel = 'high';
}
```

## Support

If you encounter issues:
1. Check console logs for detailed errors
2. Verify API key is correct and APIs are enabled
3. Test with a simple destination first
4. Make sure backend is running
5. Verify you have internet connection
