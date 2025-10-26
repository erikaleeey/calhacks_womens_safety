# LiveKit Agent Setup Guide

## Prerequisites

You need a LiveKit server and agent running to see the agent in your app.

## Step 1: Get LiveKit Credentials

### Option A: LiveKit Cloud (Recommended for testing)

1. Sign up at https://cloud.livekit.io (free tier available)
2. Create a new project
3. Copy your **LiveKit URL** (looks like: `wss://your-project.livekit.cloud`)
4. Go to Settings → Keys
5. Copy your **API Key** and **Secret**

### Option B: Self-hosted LiveKit Server

Follow the guide at https://docs.livekit.io/home/self-hosting/local/

## Step 2: Generate an Access Token

You need to generate a token to authenticate your client. You can:

### Using LiveKit CLI:

```bash
# Install LiveKit CLI
brew install livekit

# Generate a token (replace with your key/secret)
livekit-cli token create \
  --api-key <your-api-key> \
  --api-secret <your-api-secret> \
  --join \
  --room safety-agent-room \
  --identity user-1 \
  --valid-for 24h
```

### Using the dashboard:

1. Go to your project in LiveKit Cloud
2. Navigate to Developer → Generate Token
3. Set room name to `safety-agent-room`
4. Click Generate

## Step 3: Configure Your App

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   EXPO_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
   EXPO_PUBLIC_LIVEKIT_TOKEN=your-generated-token
   ```

## Step 4: Run a LiveKit Agent

Your LiveKit agent needs to be running and connected to the same room.

### Example Python Agent:

```python
import asyncio
from livekit import rtc, agents

async def main():
    # Connect to LiveKit room
    room = rtc.Room()

    await room.connect(
        url="wss://your-project.livekit.cloud",
        token="your-agent-token"  # Generate a separate token for the agent
    )

    print("Agent connected to room")

    # Keep the agent running
    await asyncio.sleep(float('inf'))

if __name__ == "__main__":
    asyncio.run(main())
```

Follow the LiveKit Agents documentation at https://docs.livekit.io/agents/

## Step 5: Start Your App

```bash
# Install dependencies (if not already done)
npm install

# Start the app
npm start

# For web
npm run web

# For iOS
npm run ios

# For Android
npm run android
```

## Troubleshooting

### "Configuration Required" screen appears
- Make sure you've created a `.env` file with valid credentials
- Restart the Expo dev server after creating/editing `.env`

### Agent doesn't show up
- Verify your agent is running and connected to the same room
- Check the console logs for connection errors
- Ensure your token has the correct permissions (join, publish, subscribe)
- Try generating a new token with longer validity

### Audio/Video permissions
- On iOS/Android: Grant camera and microphone permissions when prompted
- On web: Allow browser permissions for camera/microphone

### Connection fails
- Verify your LiveKit URL is correct (should start with `wss://`)
- Check that your token is not expired
- Ensure your LiveKit server is running

## Next Steps

Once connected, you should see:
- ✅ "Connected" status in the header
- 🤖 Your agent's video/audio tracks
- Participant count

You can then integrate this with your safety app features!
