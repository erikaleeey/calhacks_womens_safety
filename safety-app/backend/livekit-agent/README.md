# 🎙️ LiveKit Voice Agent for Women's Safety App

This is the **backend voice agent** that your mobile app connects to. When users tap the "Voice Agent" tab in the app, they'll be connected to this agent.

## 🎯 What This Does

This Python agent:
- ✅ Connects to your LiveKit room automatically
- ✅ Listens for users joining from the mobile app
- ✅ Provides voice assistance using OpenAI's GPT-4
- ✅ Has safety-focused context (women's safety advisor)
- ✅ Uses natural text-to-speech (OpenAI TTS)

---

## 📋 Prerequisites

1. **Python 3.9+** installed
2. **OpenAI API Key** (get one at https://platform.openai.com/api-keys)
3. **LiveKit credentials** (already configured from your sandbox)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend/livekit-agent

# Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required packages
pip install -r requirements.txt
```

### 2. Configure Environment

Edit `.env` and add your OpenAI API key:

```bash
# Open .env file
nano .env  # or use any text editor

# Add your OpenAI API key:
OPENAI_API_KEY=sk-your-openai-key-here
```

**LiveKit credentials are already set!** ✅
- URL: `wss://calhackswomensafety-wvtvsqg1.livekit.cloud`
- API Key: Already configured
- API Secret: Already configured

### 3. Start the Agent

```bash
python agent.py dev
```

You should see:
```
INFO  - Connected to LiveKit
INFO  - Agent ready and waiting for participants...
```

---

## 🎯 How It Works

### Connection Flow:

```
Mobile App                    LiveKit Cloud                  Voice Agent
    │                              │                              │
    │  1. User taps "Voice Agent" │                              │
    ├──────────────────────────────>                              │
    │                              │                              │
    │  2. Connects to room         │                              │
    │                              │  3. Agent auto-joins room   │
    │                              <──────────────────────────────┤
    │                              │                              │
    │  4. Voice conversation starts ────────────────────────────> │
    │                              │                              │
```

### When a User Connects:

1. Agent detects new participant
2. Greets user: "Hi! I'm your safety assistant..."
3. Listens for user's voice
4. Processes speech with OpenAI
5. Responds with helpful safety advice

---

## 🧪 Testing

### Test Locally:

1. **Start the agent**: `python agent.py dev`
2. **Open your mobile app**: `npm start` → press 'i' or 'a'
3. **Tap the Voice Agent tab** (🎙️)
4. **Speak into your phone**
5. **Agent should respond!**

### Expected Behavior:

- ✅ Agent connects to room automatically
- ✅ You see connection in agent logs
- ✅ Agent greets you when you join
- ✅ You can have a conversation

---

## 🎨 Customizing the Agent

### Change the Agent's Personality

Edit `agent.py`, line 26-33:

```python
chat_ctx=llm.ChatContext().append(
    role="system",
    text=(
        "You are a helpful safety assistant... "
        "YOUR CUSTOM INSTRUCTIONS HERE"
    ),
),
```

### Change the Voice

Edit `agent.py`, line 24:

```python
tts=openai.TTS(voice="alloy"),  # Options: alloy, echo, fable, onyx, nova, shimmer
```

### Use a Different Model

Edit `agent.py`, line 23:

```python
llm=openai.LLM(model="gpt-4o"),  # or gpt-4, gpt-3.5-turbo, etc.
```

---

## 🐛 Troubleshooting

### "Module 'livekit' not found"
```bash
pip install -r requirements.txt
```

### "OPENAI_API_KEY not set"
Make sure you added your OpenAI API key to `.env`:
```
OPENAI_API_KEY=sk-your-key-here
```

### Agent starts but doesn't respond
1. Check OpenAI API key is valid
2. Make sure you have OpenAI API credits
3. Check agent logs for errors

### Mobile app doesn't connect to agent
1. Make sure agent is running (`python agent.py dev`)
2. Check that both use the same LiveKit URL
3. Verify sandbox credentials match

---

## 💰 Costs

This agent uses:
- **OpenAI GPT-4o-mini**: ~$0.15 per 1M input tokens
- **OpenAI TTS**: ~$15 per 1M characters
- **OpenAI Whisper (STT)**: ~$0.006 per minute

**Typical conversation**: $0.01 - $0.05

---

## 🎊 You're All Set!

To start the voice agent:

```bash
cd backend/livekit-agent
source venv/bin/activate
python agent.py dev
```

Then open your mobile app and tap the Voice Agent tab! 🎙️

---

## 📚 Learn More

- [LiveKit Agents Docs](https://docs.livekit.io/agents/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [LiveKit Voice Assistant Guide](https://docs.livekit.io/agents/voice-assistant/)
