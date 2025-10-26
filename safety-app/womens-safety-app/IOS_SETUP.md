# 📱 iOS Setup for Voice Agent

## Quick Start

The voice assistant **only works on iOS/Android** (not web) because it requires native audio/video features.

### For iOS:

```bash
# 1. Install iOS dependencies
npx pod-install ios

# 2. Start Expo dev server
npm start

# 3. Press 'i' to run on iOS simulator
# OR scan QR code with Expo Go app on physical iPhone
```

### For Android:

```bash
# 1. Start Expo dev server
npm start

# 2. Press 'a' to run on Android emulator
# OR scan QR code with Expo Go app on physical Android phone
```

---

## What Happens on Web

If you run on web (`npm run web`), you'll see a helpful message:

```
📱 Native App Required

The voice assistant requires native audio/video features.
Please run on iOS or Android:

npm run ios
or
npm run android
```

The web version will still show your home screen with the button, but clicking it will show this message instead of trying to load native modules.

---

## Troubleshooting

### "Command PhaseScriptExecution failed" on iOS

This usually means pods need to be reinstalled:

```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### "Invariant Violation: Native module cannot be null"

Make sure you:
1. Ran `npx pod-install ios` (for iOS)
2. Restarted the dev server after installing
3. Are running on iOS/Android (not web)

### Expo Go limitations

Some LiveKit features may not work in Expo Go. If you have issues, create a development build:

```bash
# Create a custom dev client
npx expo run:ios
# or
npx expo run:android
```

This builds a custom version of your app with all native modules properly linked.

---

## Testing Checklist

- [ ] Run `npx pod-install ios` (for iOS)
- [ ] Restart dev server (`npm start`)
- [ ] Open on iOS simulator or device
- [ ] Home screen shows "Talk to Safety Agent" button
- [ ] Press button → Voice assistant screen opens
- [ ] Grant microphone permissions when prompted
- [ ] See agent visualization and controls

---

## Current Status

✅ **Web**: Shows home screen + helpful message for voice agent
✅ **iOS/Android**: Full voice agent functionality (after pod install)

Your LiveKit credentials are already configured in `.env`!
