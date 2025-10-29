# SheSteps.AI - Women's Safety Navigation App

**Hi there!** SheSteps.AI is a full-stack AI/ML mobile app we made that empowers women with AI-driven safety intelligence, combining a Gradient Boosting Classifier trained on 50,000 crime incidents with real-time voice AI agents to provide the safest routes in any city. We built this because we noticed a huge issue with current map apps like Google Maps: routes are optimized for efficiency and time, not necessarily women's safety. The fastest route to take at 10pm might lead to sketchy corners that have high crime rates, and we wanted to find a way to quantify that and calculate the safest possible route for a user while using contextually-aware voice agents to assess risk and keep users safe during their trip.

> An intelligent safety navigation platform leveraging machine learning for real-time risk assessment, voice AI assistance, and emergency response dispatch.

## Overview

SheSteps.AI combines real-time geolocation risk analysis, intelligent route planning, and voice AI assistance to enhance personal safety. The application uses machine learning trained on 50,000 historical crime incidents to predict safety risk levels, helping users make informed decisions about their routes.

**Key Technical Features:**
- ML-powered risk prediction using Gradient Boosting Classifier
- Real-time voice AI agent with STT-LLM-TTS pipeline using Livekit
- Multi-route safety analysis with danger zone detection
- Emergency dispatch system with automated 911 calling
- Cross-platform mobile app (iOS/Android) with React Native

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Frontend Layer                     │
│              (React Native + Expo + TypeScript)              │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API / WebSocket
┌──────────────────────▼──────────────────────────────────────┐
│                    Backend API Layer                         │
│                  (Python + Flask + CORS)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌────▼─────┐ ┌──────▼───────────────┐
│  ML Engine   │ │ LiveKit  │ │  External APIs       │
│  (sklearn)   │ │ Voice AI │ │  • Google Maps       │
│              │ │ Agents   │ │  • SF Open Data      │
└──────────────┘ └──────────┘ └──────────────────────┘
```

**Architecture Highlights:**
- **Microservices Design**: Separate backend API, ML service, and voice agent workers
- **Real-time Communication**: LiveKit WebRTC for low-latency voice (<200ms round-trip)
- **RESTful API**: JSON-based HTTP endpoints with proper error handling
- **Async Processing**: Event-driven voice agent with background workers

---

## Tech Stack

### Frontend
- **React Native** 0.81.5 + **Expo** 54.0.20 - Cross-platform mobile
- **TypeScript** 5.9.2 - Type safety and IDE support
- **react-native-maps** 1.20.1 - Interactive map visualization
- **@livekit/react-native** 2.9.3 - Real-time voice communication
- **axios** 1.12.2 - HTTP client

### Backend
- **Python** 3.9+ with **Flask** 3.0.0 - REST API server
- **Flask-CORS** 4.0.0 - Cross-origin support
- **LiveKit SDK** 0.17.3 - Voice agent and SIP integration

### Machine Learning
- **scikit-learn** 1.6.1 - Model training and inference
- **NumPy** 2.0.2, **Pandas** 2.3.3 - Data processing
- **Gradient Boosting Classifier** - Risk prediction model

### Voice AI
- **LiveKit Agents SDK** 1.2.0 - Agent framework
- **OpenAI GPT-4.1-mini** - Language model
- **AssemblyAI** - Speech-to-text (via LiveKit Inference)
- **Cartesia Sonic-2** - Text-to-speech (via LiveKit Inference)
- **Silero VAD** - Voice activity detection

---

## Machine Learning Implementation

### Dataset: San Francisco Police Incident Reports

**Source**: [SF Open Data Portal](https://data.sfgov.org/resource/wg3w-h783.json) (SODA API)
**Size**: 50,000 historical incident records
**Key Fields**: `latitude`, `longitude`, `incident_datetime`, `incident_day_of_week`

### Data Preprocessing & Feature Engineering

**Location**: `safety-app/ml/model_utils.py:50-145`

#### Feature Engineering

**1. Cyclic Hour Encoding**
Captures the circular nature of time (23:00 is close to 00:00):
```python
df['hour_sin'] = np.sin(2 * np.pi * df['incident_hour'] / 24)
df['hour_cos'] = np.cos(2 * np.pi * df['incident_hour'] / 24)
```

**2. Spatial Binning**
Bins coordinates at ~111-meter precision for density calculation:
```python
df['lat_bin'] = (df['latitude'] * 100).round(1)
df['lon_bin'] = (df['longitude'] * 100).round(1)
```

#### Target Variable Creation

**Risk Label Generation via Incident Density**
Uses quantile binning on log-transformed incident counts:
```python
# Count incidents per location per week
counts = df.groupby(['incident_year', 'incident_week', 'lat_bin', 'lon_bin']).size()

# Apply log transformation to handle skewed distribution
counts['rate_log'] = np.log1p(counts['count_week'])

# Create 3-tier risk labels (0=safe, 1=moderate, 2=high)
counts['risk_label'] = pd.qcut(counts['rate_log'], 3, labels=[0, 1, 2])
```

**Why Log Transformation?** Crime counts follow a long-tailed distribution. `log1p(x)` compresses this while handling zero counts.

### Model Architecture

**Algorithm**: Gradient Boosting Classifier (ensemble learning)

**Hyperparameters**:
```python
GradientBoostingClassifier(
    n_estimators=500,        # 500 decision trees
    max_depth=5,             # Tree depth limit
    learning_rate=0.05,      # Conservative learning
    min_samples_split=10,
    min_samples_leaf=5,
    random_state=0
)
```

**Feature Pipeline**:
- **Numeric**: `latitude`, `longitude`, `hour_sin`, `hour_cos`
  - Imputation (median) → StandardScaler (zero mean, unit variance)
- **Categorical**: `incident_day_of_week`
  - Imputation (most frequent) → OneHotEncoder

**Why Gradient Boosting?**
- Handles non-linear geographic and temporal patterns
- Robust to outliers through tree-based splits
- No feature independence assumption
- Superior accuracy vs. single trees or logistic regression

### Model Performance

**Inference Latency**: ~5-10ms per prediction (in-memory model)
**Training Time**: ~30-60 seconds on first request
**Batch Processing**: 100+ predictions for route analysis in <1 second

### API Endpoint

```http
POST /api/ml/predict-risk
Content-Type: application/json

{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "hour": 22,
  "day_of_week": "Saturday"
}

Response:
{
  "risk_label": 2,  // 0=safe, 1=moderate, 2=high
  "location": {"latitude": 37.7749, "longitude": -122.4194},
  "temporal_context": {"hour": 22, "day_of_week": "Saturday"}
}
```

---

## Voice AI Agent Implementation

### Architecture

**Location**: `safety-app/voice-agent/agent.py`

```
User Speech → STT → VAD → Turn Detection → LLM → TTS → Audio Output
              ↓                                    ↓
        AssemblyAI                           Cartesia Sonic-2
                    ↓                  ↓
                  Silero VAD    OpenAI GPT-4.1-mini
```

### Component Stack

#### 1. Speech-to-Text (STT)
```python
stt="assemblyai/universal-streaming:en"
```
- Real-time streaming transcription via LiveKit Inference
- Optimized for conversational speech

#### 2. Voice Activity Detection (VAD)
```python
vad = silero.VAD.load()
```
- Distinguishes speech from silence/background noise
- Model preloaded during initialization for faster response

#### 3. Turn Detection
```python
turn_detection = MultilingualModel()
```
- Identifies when user has finished speaking
- Distinguishes pauses from end-of-turn

#### 4. Large Language Model
```python
llm="openai/gpt-4.1-mini"
```
- GPT-4.1-mini for lower latency
- **Context embedding**: Pre-loaded with user location, destination, time
- **Preemptive generation**: Begins response before end-of-turn

**Context Injection Example**:
```python
instructions = """You are a helpful safety assistant...
Here is my location right now: I am at the palace of fine arts.
I am trying to get to fisherman's wharf.
It is currently Sunday Oct 26 and night time 10pm and dark.
Suggest the safest route for me and places to avoid."""
```

#### 5. Text-to-Speech (TTS)
```python
tts="cartesia/sonic-2:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc"
```
- Neural TTS with custom voice ID
- Low-latency synthesis

#### 6. Noise Cancellation
```python
noise_cancellation = noise_cancellation.BVC()
```
- Broadcast Voice Compression (BVC) algorithm
- Improves STT accuracy in noisy environments

### LiveKit Integration

**Backend Token Generation** (`safety-app/backend/app.py:141-217`):
```python
token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
token.with_identity(participant_name)
token.with_grants(api.VideoGrants(
    room_join=True,
    room=room_name,
    can_publish=True,
    can_subscribe=True
))
```

**Frontend Connection**:
```typescript
// Request token with location context
const response = await axios.post(`${API_URL}/api/voice-agent/token`, {
  location: { lat, lon, address }
});

// Connect to LiveKit room
await room.connect(response.data.url, response.data.token);
```

**Agent Auto-Join**: LiveKit Cloud automatically deploys agent workers when room is created.

### Emergency Agent Variant

**Location**: `safety-app/voice-agent/emergency_agent.py`

- **Outbound SIP calling** for 911 dispatch
- **Emergency context metadata**: Location, emergency type, user profile
- **Structured information relay** to 911 dispatcher
- **Function tool**: `confirm_emergency_received()` callback

---

## Software Engineering Highlights

### Route Safety Analysis Algorithm

**Location**: `womens-safety-app/app/(tabs)/index.tsx:700-850`

```
1. Geocode destination using Google Maps API
2. Calculate 3 alternative routes via Directions API
3. For each route:
   a. Sample coordinates every ~50 meters
   b. Query ML backend for risk at each point
   c. Aggregate risks via averaging
4. Sort routes by safety score (lowest avg risk first)
5. Identify danger zones (consecutive high-risk segments)
6. Render routes with color coding and danger zone overlays
```

**Key Implementation Details**:
- Parallel API requests for route risk sampling
- Haversine distance formula for proximity detection
- Vibration alerts when within 150m of danger zones

### Real-Time Location Tracking

**Implementation**: `womens-safety-app/app/(tabs)/index.tsx:102-183`

```typescript
Geolocation.watchPosition({
  enableHighAccuracy: true,
  distanceFilter: 10,        // Update every 10 meters
  interval: 5000,            // Android: 5s interval
  fastestInterval: 2000      // Android: Min 2s between updates
})
```

- **Continuous GPS monitoring** with configurable accuracy/battery tradeoffs
- **Platform-specific optimization** (iOS vs Android location services)
- **Automatic cleanup** on component unmount to prevent memory leaks

### Backend ML Integration

**Pre-training on Startup** (`safety-app/backend/app.py:24-38`):
```python
# Pre-train ML model on startup for faster predictions
from model_utils import train_model, _model_ready

if not _model_ready:
    train_model()  # Download 50K incidents and train
```

**Blueprint Architecture** (`safety-app/backend/geolocation_api.py`):
```python
geolocation_api = Blueprint('geolocation_api', __name__)

@geolocation_api.route('/predict-risk', methods=['POST'])
def predict_risk():
    # Extract features
    # Call ML model
    # Return prediction
```

- **Modular design** with Flask blueprints
- **Lazy loading** option: Train model on first request if startup fails
- **Error handling** with proper HTTP status codes

### Emergency Dispatch System

**Location**: `safety-app/backend/app.py:220-302`

```python
# Create LiveKit room for emergency call
livekit_api.agent_dispatch.create_dispatch(
    api.CreateAgentDispatchRequest(
        agent_name="emergency-911-agent",
        room=room_name,
        metadata=json.dumps(emergency_context)  # Location, user info, etc.
    )
)
```

**Emergency Context Structure**:
```json
{
  "phone_number": "+1911",
  "emergency_type": "assault|medical|danger",
  "location": {"lat": 37.7749, "lon": -122.4194, "address": "..."},
  "user_profile": {"name": "...", "age": 25, "medical_conditions": "..."},
  "timestamp": "2025-10-28T22:15:30Z"
}
```

---

## API Documentation

### Core Endpoints

#### `POST /api/ml/predict-risk`
Predict safety risk for a location and time.

**Request**:
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "hour": 22,              // Optional, defaults to current
  "day_of_week": "Saturday" // Optional, defaults to current
}
```

**Response**:
```json
{
  "risk_label": 2,  // 0=safe, 1=moderate, 2=high
  "location": {"latitude": 37.7749, "longitude": -122.4194},
  "temporal_context": {"hour": 22, "day_of_week": "Saturday"},
  "timestamp": "2025-10-28T22:15:30.123456"
}
```

#### `POST /api/voice-agent/token`
Generate LiveKit token for voice agent connection.

**Request**:
```json
{
  "roomName": "safety-user123",
  "location": {"lat": 37.7749, "lon": -122.4194, "address": "..."},
  "user_profile": {"name": "Jane Doe", "age": 25}
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "url": "wss://your-project.livekit.cloud",
  "roomName": "safety-user123"
}
```

#### `POST /api/emergency/dispatch`
Dispatch emergency 911 call with context.

**Request**:
```json
{
  "phone_number": "+1911",
  "emergency_type": "assault",
  "location": {"lat": 37.7749, "lon": -122.4194, "address": "..."},
  "user_profile": {"name": "Jane Doe", "phone": "+15551234567"}
}
```

**Response**:
```json
{
  "success": true,
  "room_name": "emergency-1234567890",
  "message": "Emergency call initiated"
}
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+, Python 3.9+, Expo CLI
- Google Maps API key, LiveKit Cloud account

### Quick Start

**Backend**:
```bash
cd safety-app/backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Create .env with LIVEKIT credentials
python app.py  # Runs on http://localhost:5001
```

**Voice Agent**:
```bash
cd safety-app/voice-agent
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Create .env.local with LIVEKIT credentials
python agent.py dev
```

**Mobile App**:
```bash
cd safety-app/womens-safety-app
npm install
# Create .env with GOOGLE_MAPS_API_KEY
# Update API_URL in app/(tabs)/index.tsx
npx expo start
```

---

## Screenshots

### Map Screen with Risk Assessment +  Route Planning with Safety Scores
![Map Screen](assets/images/shesteps_map.gif)
*Real-time location tracking with ML-powered risk circles (green=safe, orange=moderate, red=high)*
*Multiple route alternatives ranked by safety score with danger zone visualization*

### Voice AI Assistant + Emergency SOS
![Voice Agent](assets/images/shesteps_voiceagent.gif)
*Context-aware voice assistant with real-time audio visualization*
*One-tap emergency dispatch with automated 911 calling*

---

## Our Goals:

**Addresses Real-World Problem**: Women's safety with data-driven risk assessment
**ML-Powered**: 50K historical incidents inform predictive model
**Real-Time Voice AI**: Conversational assistance during vulnerable moments
**Emergency Integration**: Direct 911 dispatch with automated context relay

---

## License

MIT License - see [LICENSE](LICENSE) file for details.
