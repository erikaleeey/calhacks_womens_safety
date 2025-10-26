# 🎙️ Voice Agent Quick Start Guide

## The Problem You Had:

Your voice agent tab wasn't connected to an actual LiveKit agent backend. The `aspen_agent` folder was just the **frontend template**, not the actual agent server.

## ✅ The Solution:

I've created a **LiveKit voice agent backend** that your mobile app will connect to!

---

## 📁 What Was Created:

```
safety-app/
├── backend/
│   └── livekit-agent/          ⭐ NEW!
│       ├── agent.py            (Voice agent server)
│       ├── requirements.txt    (Python dependencies)
│       ├── .env                (LiveKit credentials - already configured!)
│       └── README.md           (Detailed setup guide)
│
└── womens-safety-app/
    └── app/(tabs)/
        └── assistant.tsx       (Voice agent tab - connects to agent.py)
```

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get an OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create an account (if needed)
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

### Step 2: Set Up the Agent

```bash
# Navigate to the agent directory
cd safety-app/backend/livekit-agent

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Add your OpenAI API key
nano .env  # or open in any editor
# Add this line:
# OPENAI_API_KEY=sk-your-key-here
```

### Step 3: Start the Agent

```bash
python agent.py dev
```

You should see:
```
INFO - Agent registered
INFO - Waiting for room assignment...
```

✅ **Agent is ready!** Leave this running.

### Step 4: Test with Mobile App

**In a NEW terminal:**

```bash
cd safety-app/womens-safety-app

# Start the app
npm start

# For iOS (recommended for voice)
npm run ios

# For Android
npm run android
```

### Step 5: Talk to Your Agent!

1. App opens → Tap the **Voice Agent tab** (🎙️)
2. Grant microphone permissions
3. The agent says: "Hi! I'm your safety assistant..."
4. **Start talking!** Ask questions like:
   - "What should I do if I feel unsafe?"
   - "How do I assess the risk in my area?"
   - "Give me safety tips for walking alone at night"

---

## 🎯 How It All Connects

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Mobile App    │         │  LiveKit Cloud   │         │  Voice Agent    │
│  (Voice Agent   │  ────>  │  (Relay Server)  │  <────  │   (agent.py)    │
│     Tab)        │         │                  │         │                  │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │                            │
        │                            │                            │
    User speaks           Routes audio/video          Processes with
    into phone           between app & agent            OpenAI GPT-4

                         Both connect to same room:
                         "safety-agent-room"
```

---

## 🔧 Technical Details

### What the Agent Does:

1. **Listens**: Uses Silero VAD (Voice Activity Detection) to detect when you're speaking
2. **Transcribes**: Converts your speech to text with OpenAI Whisper
3. **Thinks**: Processes your question with GPT-4o-mini
4. **Responds**: Converts response to speech with OpenAI TTS
5. **Streams**: Sends audio back to your phone in real-time

### Configuration:

Both your app and agent use the same credentials from `.env`:
- **LiveKit URL**: `wss://calhackswomensafety-wvtvsqg1.livekit.cloud`
- **Sandbox ID**: `cloudy-opcode-1lfiyj`
- **Auto-connect**: Both join the same room automatically

---

## 🧪 Testing Checklist

Run through this to make sure everything works:

- [ ] Agent starts without errors: `python agent.py dev`
- [ ] Mobile app starts: `npm run ios` or `npm run android`
- [ ] Tap Voice Agent tab (🎙️)
- [ ] See connection indicator
- [ ] Hear agent greeting: "Hi! I'm your safety assistant..."
- [ ] Speak into phone
- [ ] Agent responds to your question
- [ ] Can have back-and-forth conversation

---

## 🐛 Common Issues

### "OPENAI_API_KEY not set"
- Edit `backend/livekit-agent/.env`
- Add: `OPENAI_API_KEY=sk-your-key-here`

### Agent starts but app doesn't connect
1. Make sure agent is running: `python agent.py dev`
2. Check both are using same LiveKit URL
3. Restart the mobile app

### No audio from agent
- Check microphone permissions on phone
- Make sure OpenAI API key is valid
- Check you have OpenAI API credits

### "Module not found" errors
```bash
cd backend/livekit-agent
pip install -r requirements.txt
```

---

## 💡 Customization Ideas

### Change Agent's Personality

Edit `backend/livekit-agent/agent.py`, line 26-33:

```python
text=(
    "You are [YOUR CUSTOM PERSONALITY HERE]. "
    "You help users with [YOUR SPECIFIC USE CASE]. "
)
```

Examples:
- **Friendly companion**: "You are a warm, supportive friend who..."
- **Professional advisor**: "You are an experienced safety professional who..."
- **Emergency helper**: "You are a calm, reassuring voice during emergencies who..."

### Change the Voice

Line 24 in `agent.py`:
```python
tts=openai.TTS(voice="nova"),  # Try: alloy, echo, fable, onyx, nova, shimmer
```

### Add Custom Safety Features

You can make the agent:
- Access your risk classification API
- Provide location-specific advice
- Trigger emergency alerts
- Log conversations for safety records

---

## 📊 Architecture Overview

```
Women's Safety App
├── Frontend (React Native - Expo)
│   ├── Home Tab (Quick access cards)
│   ├── Safety Map Tab (Risk visualization)
│   ├── Voice Agent Tab ⭐ (Connects to agent.py)
│   └── About Tab
│
├── Backend
│   ├── Flask API (Risk classification)
│   └── LiveKit Agent ⭐ (Voice assistant)
│       ├── Speech-to-Text (Whisper)
│       ├── LLM (GPT-4)
│       └── Text-to-Speech (OpenAI TTS)
│
└── LiveKit Cloud (Relay server)
```

---

## 🎊 You're Ready!

To use the voice agent:

**Terminal 1:**
```bash
cd safety-app/backend/livekit-agent
source venv/bin/activate
python agent.py dev
```

**Terminal 2:**
```bash
cd safety-app/womens-safety-app
npm run ios  # or npm run android
```

**Then tap the 🎙️ Voice Agent tab and start talking!**

---

## 📚 Next Steps

- [ ] Test the voice agent
- [ ] Customize the agent's personality
- [ ] Add safety-specific features
- [ ] Deploy to production (when ready)

Read `backend/livekit-agent/README.md` for more details!

---

## ❓ Need Help?

Check these resources:
- [LiveKit Agents Documentation](https://docs.livekit.io/agents/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [React Native Voice Example](https://github.com/livekit-examples/agent-starter-react-native)

---

**Your voice agent is now fully connected and ready to help keep users safe!** 🛡️🎙️
