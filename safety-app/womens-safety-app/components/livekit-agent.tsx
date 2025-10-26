import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
  useParticipants,
  useRoomContext,
} from '@livekit/react-native';
import { Track } from 'livekit-client';

// Configuration - Replace with your LiveKit server details
const LIVEKIT_CONFIG = {
  serverUrl: process.env.EXPO_PUBLIC_LIVEKIT_URL || 'wss://your-livekit-server.com',
  token: process.env.EXPO_PUBLIC_LIVEKIT_TOKEN || 'your-token-here',
  roomName: 'safety-agent-room',
};

/**
 * Inner component that renders the room view
 * This must be inside LiveKitRoom to access room context
 */
const RoomView = () => {
  const participants = useParticipants();
  const room = useRoomContext();

  // Get all camera and screen share tracks
  const cameraTracks = useTracks([Track.Source.Camera]);
  const screenTracks = useTracks([Track.Source.ScreenShare]);
  const allTracks = [...cameraTracks, ...screenTracks];

  const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({ item }) => {
    if (isTrackReference(item)) {
      const participantName = item.participant.identity || 'Unknown';
      const isAgent = participantName.includes('agent') || participantName.includes('bot');

      return (
        <View style={styles.trackContainer}>
          <VideoTrack trackRef={item} style={styles.videoTrack} />
          <View style={styles.trackInfo}>
            <Text style={styles.participantName}>
              {isAgent ? '🤖 ' : '👤 '}{participantName}
            </Text>
            <Text style={styles.trackType}>
              {item.source === Track.Source.Camera ? 'Camera' : 'Screen'}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.trackContainer, styles.placeholderTrack]}>
          <Text style={styles.placeholderText}>Waiting for participant...</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LiveKit Agent</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, room.state === 'connected' && styles.statusConnected]} />
          <Text style={styles.statusText}>
            {room.state === 'connected' ? 'Connected' : 'Connecting...'}
          </Text>
        </View>
        <Text style={styles.participantCount}>
          {participants.length} participant{participants.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {allTracks.length > 0 ? (
        <FlatList
          data={allTracks}
          renderItem={renderTrack}
          keyExtractor={(item, index) =>
            isTrackReference(item)
              ? `${item.participant.sid}-${item.publication.trackSid}`
              : `placeholder-${index}`
          }
          contentContainerStyle={styles.trackList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>🎥 No video tracks yet</Text>
          <Text style={styles.emptyStateText}>
            Waiting for agent to connect...
          </Text>
          <Text style={styles.emptyStateHint}>
            Make sure your LiveKit agent is running and configured correctly.
          </Text>
        </View>
      )}

      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>Room: {LIVEKIT_CONFIG.roomName}</Text>
        <Text style={styles.debugText}>Server: {LIVEKIT_CONFIG.serverUrl}</Text>
      </View>
    </View>
  );
};

/**
 * Main LiveKit Agent Component
 * Wraps the room view with LiveKitRoom provider
 */
export default function LiveKitAgent() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show error state if configuration is missing
  if (
    LIVEKIT_CONFIG.serverUrl === 'wss://your-livekit-server.com' ||
    LIVEKIT_CONFIG.token === 'your-token-here'
  ) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚙️ Configuration Required</Text>
          <Text style={styles.errorText}>
            Please set your LiveKit server credentials:
          </Text>
          <View style={styles.configSteps}>
            <Text style={styles.configStep}>
              1. Create a .env file with:{'\n'}
              EXPO_PUBLIC_LIVEKIT_URL=wss://your-server.com{'\n'}
              EXPO_PUBLIC_LIVEKIT_TOKEN=your-token
            </Text>
            <Text style={styles.configStep}>
              2. Or update the LIVEKIT_CONFIG in{'\n'}
              components/livekit-agent.tsx
            </Text>
            <Text style={styles.configStep}>
              3. Make sure your LiveKit agent is running
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_CONFIG.serverUrl}
      token={LIVEKIT_CONFIG.token}
      connect={true}
      options={{
        adaptiveStream: { pixelDensity: 'screen' },
      }}
      audio={true}
      video={true}
      onConnected={() => {
        console.log('✅ Connected to LiveKit room');
        setIsConnected(true);
        setError(null);
      }}
      onDisconnected={() => {
        console.log('❌ Disconnected from LiveKit room');
        setIsConnected(false);
      }}
      onError={(err) => {
        console.error('LiveKit error:', err);
        setError(err.message);
      }}
    >
      <RoomView />
    </LiveKitRoom>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginRight: 8,
  },
  statusConnected: {
    backgroundColor: '#10B981',
  },
  statusText: {
    color: '#999',
    fontSize: 14,
  },
  participantCount: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  trackList: {
    padding: 8,
  },
  trackContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  videoTrack: {
    height: 300,
    backgroundColor: '#000',
  },
  trackInfo: {
    padding: 12,
    backgroundColor: '#1a1a1a',
  },
  participantName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trackType: {
    color: '#666',
    fontSize: 12,
  },
  placeholderTrack: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  debugInfo: {
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  debugText: {
    color: '#666',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  configSteps: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  configStep: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
