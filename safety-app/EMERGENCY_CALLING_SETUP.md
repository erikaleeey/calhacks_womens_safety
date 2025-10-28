# Emergency 911 Calling Setup Guide

This guide explains how to set up the AI-powered emergency calling system that automatically contacts 911 with contextual information when the SOS button is pressed.

## Overview

When a user presses the SOS button during navigation, the system:
1. **Collects contextual information**: Location, time, emergency type, user profile
2. **Dispatches an AI agent**: Creates a LiveKit room and dispatches the emergency agent
3. **Makes outbound call**: Agent calls 911 (or test number) via SIP trunk
4. **Relays information**: Agent provides dispatcher with structured emergency details

## Architecture

```
[SOS Button]
    ↓
[Collect Context: Location, Time, User Profile]
    ↓
[Backend API: /api/emergency/dispatch]
    ↓
[LiveKit Agent Dispatch]
    ↓
[Emergency Agent] → [SIP Trunk] → [911 Call]
    ↓
[AI speaks to dispatcher with emergency details]
```

## Prerequisites

### 1. SIP Trunk Provider

You need a SIP trunk provider to make outbound calls. LiveKit recommends:
- **Twilio** (easiest to set up)
- **Telnyx**
- **Bandwidth**
- Other SIP providers

### 2. LiveKit Cloud Account

- Sign up at https://cloud.livekit.io
- Create a project
- Get your API key and secret

## Setup Steps

### Step 1: Configure SIP Trunk

#### Option A: Twilio (Recommended for Testing)

1. **Sign up for Twilio**: https://www.twilio.com/
2. **Purchase a phone number**
3. **Create SIP Trunk**:
   ```bash
   # Configure Twilio SIP trunk
   # Follow: https://docs.livekit.io/sip/quickstarts/configuring-twilio-trunk
   ```

4. **Create LiveKit Outbound Trunk**:
   ```bash
   # Install LiveKit CLI
   brew install livekit-cli  # macOS
   # or download from https://github.com/livekit/livekit-cli

   # Configure your credentials
   lk cloud auth

   # Create outbound trunk config
   cat > outbound-trunk.json << EOF
   {
     "name": "my-emergency-trunk",
     "address": "your-twilio-sip-uri.pstn.twilio.com",
     "transport": "tcp",
     "numbers": ["+1YOUR_TWILIO_NUMBER"],
     "auth_username": "your-twilio-username",
     "auth_password": "your-twilio-password"
   }
   EOF

   # Create the trunk
   lk sip outbound create outbound-trunk.json

   # Get trunk ID (save this!)
   lk sip outbound list
   ```

### Step 2: Configure Environment Variables

#### Backend (.env)
```bash
# Backend: safety-app/backend/.env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
SIP_TRUNK_ID=ST_xxxxxxxxxxxx  # From step 1
```

#### Voice Agent (.env.local)
```bash
# Voice Agent: safety-app/voice-agent/.env.local
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

### Step 3: Start the Emergency Agent

```bash
cd voice-agent

# Install dependencies if needed
pip install -r requirements.txt

# Start the emergency agent
python emergency_agent.py dev

# You should see:
# ✓ Connected to LiveKit server
# ✓ Worker registered as: emergency-911-agent
```

### Step 4: Configure Test Phone Number

**IMPORTANT**: Do NOT use real 911 for testing!

Update the phone number in `womens-safety-app/app/(tabs)/index.tsx`:

```typescript
// Line ~775
phone_number: '+1YOUR_TEST_NUMBER', // Replace with YOUR phone number
```

### Step 5: Test the Emergency System

1. **Start all services**:
   ```bash
   # Terminal 1: Backend
   cd backend
   source venv/bin/activate
   python app.py

   # Terminal 2: Voice Agent
   cd voice-agent
   python emergency_agent.py dev

   # Terminal 3: Mobile App
   cd womens-safety-app
   npm start
   ```

2. **Test emergency call**:
   - Open the app
   - Start navigation to any destination
   - Press the **SOS** button
   - Select emergency type
   - The AI agent should call your test number
   - Answer and verify the agent provides:
     - Emergency type
     - Your location
     - Time
     - User information

## Emergency Call Flow

### What the AI Agent Says

When the dispatcher answers:

```
"This is an automated emergency call.

Emergency Type: [Immediate Danger/Medical/Feel Unsafe]
Situation: [User reported immediate danger]

Location: [123 Main St, Berkeley, CA 94704]
Coordinates: Latitude 37.8719, Longitude -122.2585

Time: [2025-10-26T15:30:45]

User Information:
- Name: [User Name]
- Phone: [+1234567890]
- Age: [25]
- Medical conditions: [None reported]

Please confirm you have received this information."
```

### Dispatcher Interaction

- The AI agent will answer questions
- It can confirm information
- It stays on the line until the dispatcher ends the call

## Production Deployment

### Security Considerations

1. **Never hardcode 911**: Use configuration/environment variables
2. **User authentication**: Verify user identity before allowing emergency calls
3. **Call logging**: Log all emergency calls for audit
4. **Rate limiting**: Prevent abuse of emergency calling
5. **Verification**: Consider requiring confirmation before calling 911

### User Profile Setup

Add a user profile screen to collect:
```typescript
interface UserProfile {
  name: string;
  phone: string;
  age: number;
  medical_conditions?: string;
  emergency_contacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
}
```

### Production Configuration

```typescript
// index.tsx - Production setup
const emergencyContext = {
  phone_number: Platform.OS === 'ios' ? 'tel:911' : 'tel:911',
  emergency_type: emergencyType,
  situation: situation,
  location: {
    lat: userLocation.lat,
    lon: userLocation.lon,
    address: address,
  },
  user_profile: userProfile, // From AsyncStorage or auth context
  timestamp: new Date().toISOString(),
  user_id: authUser.id, // From authentication
};
```

## Troubleshooting

### Agent Not Connecting
```bash
# Check LiveKit credentials
lk cloud auth list

# Verify SIP trunk
lk sip outbound list

# Check agent logs
python emergency_agent.py dev --verbose
```

### Call Not Going Through
- Verify SIP trunk credentials
- Check Twilio console for errors
- Ensure phone number format is E.164 (+1XXXXXXXXXX)
- Check LiveKit SIP service status

### No Audio
- Verify Twilio trunk allows outbound calls
- Check SIP authentication credentials
- Test with LiveKit CLI: `lk sip participant create`

## Cost Estimates

- **LiveKit**: ~$0.01 per minute of call time
- **Twilio**: ~$0.015 per minute for voice calls
- **Total**: ~$0.025/minute for emergency calls

## Legal & Compliance

⚠️ **Important Legal Notice**:

1. **Emergency Services**: Calling 911 programmatically may have legal requirements
2. **FCC Compliance**: Ensure compliance with E911 regulations
3. **Liability**: Consult legal counsel before production deployment
4. **Testing**: NEVER test with real 911 - use test numbers only
5. **User Consent**: Get explicit user consent for emergency calling

## Advanced Features (Future)

### Silent Emergency Mode
```python
# emergency_agent.py - Silent mode
if emergency_context.get('silent_mode'):
    instructions += """
    The user cannot speak. Provide all information to dispatcher without
    waiting for user response. Alert dispatcher that user cannot communicate.
    """
```

### Live Audio Streaming
- Stream live audio from user's phone during emergency
- Requires additional permissions and implementation

### Emergency Contact Notifications
- Simultaneously notify emergency contacts via SMS
- Send live location link
- Provide estimated arrival time for emergency services

## Resources

- [LiveKit SIP Documentation](https://docs.livekit.io/sip/)
- [LiveKit Agents Telephony](https://docs.livekit.io/agents/start/telephony/)
- [Twilio SIP Trunk Setup](https://docs.livekit.io/sip/quickstarts/configuring-twilio-trunk/)
- [LiveKit Cloud Console](https://cloud.livekit.io)

## Support

For issues:
1. Check LiveKit Cloud console logs
2. Review agent logs with `--verbose` flag
3. Test SIP trunk separately with CLI
4. Contact LiveKit support: https://livekit.io/support
