# Context-Aware Voice Agent

The voice agent now has full awareness of the user's location, time, and profile information, allowing it to provide personalized and contextually relevant safety advice.

## What Context Does the Agent Have?

When a user connects to the voice agent, it receives:

### 1. **Location Information**
- **Current address**: Full street address from reverse geocoding
- **GPS coordinates**: Latitude and longitude
- **Example**: "You are currently at 2150 Shattuck Ave, Berkeley, CA 94704"

### 2. **Time & Date**
- **Current time**: Precise timestamp
- **Day period**: Morning, afternoon, evening, or night
- **Day of week**: Monday, Tuesday, etc.
- **Example**: "It's 10:30 PM on Friday, October 26, 2025"

### 3. **User Profile** (optional)
- **Name**: User's first name for personalization
- **Age**: For age-appropriate advice
- **Medical conditions**: For health-related considerations
- **Example**: "Jane, 25 years old"

## How the Agent Uses This Context

### **Answering Location Questions**

**User**: "Where am I?"

**Agent**: "You're currently at Telegraph Avenue near the UC Berkeley campus in Berkeley, California."

---

**User**: "What time is it?"

**Agent**: "It's 10:30 PM on Friday evening."

### **Time-Based Safety Recommendations**

The agent automatically adjusts advice based on time of day:

#### Late Night (10 PM - 6 AM)
```
User: "I need to walk home"
Agent: "It's late at night - I'd recommend taking a rideshare service
instead of walking. If you must walk, stay on well-lit main streets
like Telegraph or Shattuck, and keep someone on the phone with you."
```

#### Evening (6 PM - 10 PM)
```
User: "Is it safe to walk right now?"
Agent: "It's evening, so there should still be people around. I recommend
staying in well-populated areas and being aware of your surroundings."
```

#### Daytime
```
User: "Is it safe to walk right now?"
Agent: "It's daytime, which is generally safer with better visibility
and more people around. Still, trust your instincts."
```

### **Location-Aware Recommendations**

**User**: "Can you recommend a safe place nearby?"

**Agent**: "Based on your current location near UC Berkeley, I'd recommend staying on Telegraph Avenue where there are lots of cafes and shops with people around. The student union is also a safe public space nearby."

### **Personalized Greetings**

The agent greets users based on time of day:

- **Morning**: "Good morning! I'm here to help with your safety needs."
- **Afternoon**: "Good afternoon! How can I assist you today?"
- **Evening**: "Good evening! What can I help you with?"
- **Late Night**: "I see it's quite late. I'm here to help keep you safe. What do you need?"

## Technical Implementation

### Data Flow

```
[Mobile App]
    ↓ Gets current location
    ↓ Reverse geocodes to address
    ↓ Sends to backend

[Backend API]
    ↓ Receives location + user context
    ↓ Adds timestamp
    ↓ Dispatches agent with metadata

[Voice Agent]
    ↓ Receives full context in metadata
    ↓ Parses into instructions
    ↓ Knows location, time, user info

[User Conversation]
    ↓ Agent answers with full context
```

### Code Example

**Voice Agent Instructions** (automatically generated):

```python
CURRENT LOCATION:
- Address: Telegraph Ave, Berkeley, CA 94704
- GPS Coordinates: 37.8719, -122.2585
- The user is currently at this location

CURRENT TIME & DATE:
- It is currently 10:30 PM on Friday, October 26, 2025
- This is the night
- When giving safety advice, consider that it's nighttime

SAFETY RECOMMENDATIONS:
- It's late at night - extra caution is advised
- Recommend well-lit, populated routes
- Suggest rideshare services over walking alone
- Encourage staying in contact with someone
```

## Example Conversations

### Example 1: Location & Time Aware

```
User: "Hey, where am I and what time is it?"

Agent: "Hi! You're currently at Telegraph Avenue in Berkeley, California,
near the UC Berkeley campus. It's 10:30 PM on Friday evening."

User: "Is it safe to walk to my dorm?"

Agent: "Since it's quite late at night, I'd recommend taking a rideshare
service if possible. If you need to walk, stay on well-lit main streets
like Telegraph Avenue, keep your phone handy, and consider calling a friend
to stay on the line with you. Would you like me to help you find the safest
route?"
```

### Example 2: Emergency Context

```
User: "I feel unsafe"

Agent: "I'm here to help. You're at Shattuck Avenue in Berkeley.
Can you tell me what's making you feel unsafe? I can help you find
a safe place nearby or connect you with help."

User: "Someone is following me"

Agent: "Okay, stay calm. Since it's nighttime, I recommend going into
the nearest open business - there should be several cafes on Shattuck
that are still open. Would you like me to call emergency services?"
```

### Example 3: General Safety Advice

```
User: "What safety tips do you have for me?"

Agent: "Based on your location near UC Berkeley and the fact that it's
late Friday night, here are some tips:
- Stay in well-lit areas like Telegraph or Shattuck Avenue
- Walk with confidence and be aware of your surroundings
- Keep your phone charged and easily accessible
- If possible, walk with friends or use a rideshare
- Trust your instincts - if something feels wrong, it probably is"
```

## Updating User Context

### On Connection

Context is collected when the user starts a voice session:

1. **Location**: Automatically retrieved from GPS
2. **Time**: Automatically added by backend
3. **User Profile**: From user settings (TODO: implement settings screen)

### Real-Time Updates

Future enhancement: Context could be updated during the session if:
- User location changes significantly
- Time period changes (e.g., becomes late night)
- User navigates to a high-risk area

## Privacy Considerations

- Location is only used for the duration of the session
- No location data is permanently stored
- User can see what information is being sent
- Context is only shared with the AI agent, not third parties

## Testing the Context-Aware Agent

### Test Questions to Try:

1. **"Where am I?"** - Agent should tell you your current address
2. **"What time is it?"** - Agent should tell you current time
3. **"Is it safe to walk right now?"** - Agent adjusts answer based on time
4. **"Recommend a safe place nearby"** - Agent uses location context
5. **"What should I do?"** - Agent considers time of day and location

### Expected Behavior:

- ✅ Agent knows exact location
- ✅ Agent knows current time
- ✅ Recommendations change based on time of day
- ✅ Greetings are time-appropriate
- ✅ Safety advice is location-specific

## Future Enhancements

### Short Term
- [ ] User profile settings screen
- [ ] Option to update location during session
- [ ] Visual display of context in UI

### Medium Term
- [ ] Historical location tracking for better context
- [ ] Integration with danger zone data
- [ ] Proactive alerts based on location

### Long Term
- [ ] Multi-language support with local context
- [ ] Integration with local emergency services
- [ ] Crowd-sourced safety information
