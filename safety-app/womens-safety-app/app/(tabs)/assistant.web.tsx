import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function VoiceAssistantScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.webNotSupported}>
        <Text style={styles.webNotSupportedTitle}>📱 Native App Required</Text>
        <Text style={styles.webNotSupportedText}>
          The voice assistant requires native audio/video features.
        </Text>
        <Text style={styles.webNotSupportedText}>
          Please run on iOS or Android:
        </Text>
        <View style={styles.commandBox}>
          <Text style={styles.commandText}>npm run ios</Text>
          <Text style={styles.commandText}>or</Text>
          <Text style={styles.commandText}>npm run android</Text>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webNotSupported: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  webNotSupportedTitle: {
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  webNotSupportedText: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 12,
    textAlign: 'center',
  },
  commandBox: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  commandText: {
    fontSize: 16,
    color: '#00ff00',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textAlign: 'center',
    marginVertical: 4,
  },
  backButton: {
    backgroundColor: '#002CF2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
