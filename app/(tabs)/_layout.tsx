import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0d0d0d' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: { backgroundColor: '#111111', borderTopColor: '#2a2a2a' },
        tabBarActiveTintColor: '#e50914',
        tabBarInactiveTintColor: '#aaaaaa',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Movies',
          tabBarLabel: 'Movies',
          tabBarIcon: ({ color }) => <TabIcon label="🎬" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tv"
        options={{
          title: 'TV Shows',
          tabBarLabel: 'TV',
          tabBarIcon: ({ color }) => <TabIcon label="📺" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => <TabIcon label="🔍" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ label, color }: { label: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 20, color }}>{label}</Text>;
}
