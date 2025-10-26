import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#002CF2',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Safety Map',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="map" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'Voice Agent',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="microphone" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="information-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Simple icon component using emoji
function TabBarIcon({ name, color }: { name: string; color: string }) {
  // Map icon names to emoji for simplicity
  const iconMap: { [key: string]: string } = {
    'home': '🏠',
    'map': '🗺️',
    'microphone': '🎙️',
    'information-circle': 'ℹ️',
  };

  return (
    <Text style={{ fontSize: 24 }}>
      {iconMap[name] || '❓'}
    </Text>
  );
}
