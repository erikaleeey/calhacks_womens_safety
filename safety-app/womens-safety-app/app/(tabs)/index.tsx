import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Women's Safety App</Text>
        <Text style={styles.subtitle}>Your personal safety companion</Text>
      </View>

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Quick Access</Text>

        <Link href="/(tabs)/map" asChild>
          <TouchableOpacity style={styles.featureCard}>
            <Text style={styles.featureIcon}>🗺️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Safety Map</Text>
              <Text style={styles.featureDescription}>
                View risk levels in your area
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/assistant" asChild>
          <TouchableOpacity style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎙️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Voice Agent</Text>
              <Text style={styles.featureDescription}>
                Talk to your AI safety assistant
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🛡️</Text>
          <Text style={styles.infoText}>
            Your safety is our priority. Use the tabs below to access the safety map and voice assistant.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 32,
    backgroundColor: '#002CF2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E6F4FE',
  },
  features: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4FE',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#002CF2',
    lineHeight: 20,
  },
});
