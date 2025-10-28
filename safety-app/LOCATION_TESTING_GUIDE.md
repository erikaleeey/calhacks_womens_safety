# Location Testing & Debugging Guide

## What I Added

### 1. Console Logging
The app now logs detailed location data to the console:
- **Initial location** with full details (lat, lon, accuracy, altitude, speed, timestamp)
- **Location updates** every time your position changes
- **Error details** if location tracking fails

### 2. Debug Display (UI)
A dark debug card in the top-left corner shows:
- Current latitude (6 decimal places)
- Current longitude (6 decimal places)
- Updates in real-time as you move

## Testing on iOS Simulator

### Default Location Issue
The iOS Simulator defaults to **Apple Park in Cupertino** unless you set a custom location.

**Coordinates:**
- Apple Park: `37.3346, -122.0090`
- Union Square SF: `37.7880, -122.4075`
- Pacific Heights SF: `37.7926, -122.4374`

### How to Set Custom Location in Simulator

1. **Open the Simulator**
2. **Menu Bar** → `Features` → `Location` → Choose one:
   - **Custom Location...** (enter exact coordinates)
   - **Apple** (default - Cupertino)
   - **City Bicycle Ride** (simulates movement)
   - **City Run** (simulates running)
   - **Freeway Drive** (simulates driving)

3. **For Pacific Heights specifically:**
   - Click `Features` → `Location` → `Custom Location...`
   - Enter:
     - Latitude: `37.7926`
     - Longitude: `-122.4374`
   - Click OK

4. **Reload your app** to pick up the new location

### Simulating Movement
To test live location tracking:
- `Features` → `Location` → `City Bicycle Ride` or `City Run`
- Watch the debug card update as the simulated location changes

## Testing on Physical Device

### Why Device Testing is Better
- **Real GPS data** from actual satellite signals
- **True accuracy** (usually 5-10 meters with good signal)
- **Movement detection** works properly
- **No simulated locations**

### Setup for Device Testing

1. **Update API_URL** in `/womens-safety-app/app/(tabs)/index.tsx`:
   ```typescript
   // Change from:
   const API_URL = 'http://localhost:5001';

   // To your computer's IP address:
   const API_URL = 'http://192.168.1.XXX:5001';  // Replace with your IP
   ```

2. **Find your computer's IP**:
   ```bash
   # macOS
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Or check System Settings → Network
   ```

3. **Ensure device and computer are on same WiFi**

4. **Build and run on device**:
   ```bash
   npx expo run:ios --device
   ```

### Location Permissions on Device
Make sure you granted "While Using the App" permission when prompted.

To verify:
- Settings → Privacy & Security → Location Services → Your App
- Should be set to "While Using the App"

## Debugging Steps

### Step 1: Check Console Logs
Look for these in your terminal where you ran `npx expo run:ios`:

```
📍 Initial Location Received:
  Latitude: 37.792600
  Longitude: -122.437400
  Accuracy: 5 meters
  ...
```

### Step 2: Verify Coordinates
Compare the logged coordinates with expected values:

**San Francisco Neighborhoods:**
- Financial District: `37.7946, -122.3999`
- Union Square: `37.7880, -122.4075`
- Pacific Heights: `37.7926, -122.4374`
- Marina District: `37.8028, -122.4381`
- Mission District: `37.7599, -122.4148`

Use this tool to verify: https://www.latlong.net/

### Step 3: Check Accuracy
The `Accuracy` value in meters tells you how precise the location is:
- **< 10m**: Excellent (GPS with good signal)
- **10-50m**: Good (GPS with ok signal)
- **50-100m**: Fair (may be using WiFi/Cell towers)
- **> 100m**: Poor (likely using cell tower triangulation)

### Step 4: Understand the Debug Display
The debug card shows coordinates with 6 decimal places:
- **Lat: 37.792600** means latitude 37.792600°N
- **Lon: -122.437400** means longitude 122.437400°W

**Precision Reference:**
- 6 decimal places = ~0.11 meters precision
- 5 decimal places = ~1.1 meters precision
- 4 decimal places = ~11 meters precision

## Common Issues & Solutions

### Issue 1: "Says I'm in Union Square but I'm in Pacific Heights"

**Likely Cause**: Running on iOS Simulator with default location

**Solution**:
1. Check console logs for actual coordinates
2. If you see `37.7880, -122.4075` → That's Union Square
3. Set custom location in simulator (see above)
4. Or test on physical device

### Issue 2: "Location not updating"

**Check**:
- Console logs - are you seeing `🔄 Location Update:` messages?
- Debug card - is it changing?
- `distanceFilter: 10` means it only updates when you move 10+ meters

**Solution**:
- Use simulator's "City Bicycle Ride" to simulate movement
- On device, actually walk around

### Issue 3: "Accuracy is poor (> 100 meters)"

**Causes**:
- Indoors (GPS signal blocked)
- Bad weather
- Tall buildings (GPS signal reflection)
- Simulator (always shows perfect accuracy but fake location)

**Solution**:
- Go outside with clear sky view
- Test on physical device
- Wait a few seconds for GPS to lock on

### Issue 4: "Permission denied"

**Check Console**:
```
❌ Error getting current position: [Error object]
  Code: 1
  Message: User denied Geolocation
```

**Solution**:
- Simulator: `Features` → `Location` → Allow Location
- Device: Settings → Privacy → Location Services → Enable for your app

## What the Coordinates Mean

### Understanding Lat/Lon
- **Latitude** (37.7926): North-South position
  - Equator = 0°
  - North Pole = 90°N
  - San Francisco ≈ 37.7°N

- **Longitude** (-122.4374): East-West position
  - Prime Meridian (Greenwich) = 0°
  - San Francisco ≈ 122.4°W (negative = West)

### Neighborhood Verification
Once you see coordinates in the debug card:
1. Copy them (e.g., `37.7926, -122.4374`)
2. Paste into Google Maps search
3. Verify it shows the correct neighborhood

## Expected Behavior

### On Simulator (with custom location set to Pacific Heights)
```
📍 Initial Location Received:
  Latitude: 37.7926
  Longitude: -122.4374
  Accuracy: 5 meters  ← (fake, but location is correct)
```

### On Physical Device (in Pacific Heights)
```
📍 Initial Location Received:
  Latitude: 37.792xxx  ← varies slightly
  Longitude: -122.437xxx
  Accuracy: 8 meters  ← real GPS accuracy
```

## Next Steps

1. **Reload the app** to see the new debug display
2. **Check console logs** for detailed location data
3. **Verify coordinates** using the debug card
4. **Set custom location** if using simulator
5. **Test on physical device** for real GPS data

If the coordinates in the logs/debug card are correct but the map shows wrong location, that would indicate a different issue (map region, marker placement, etc.). But first, let's verify what coordinates you're actually getting!
