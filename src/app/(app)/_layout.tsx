import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { FONT } from '../../constants/colors';
import { useColors } from '../../features/theme/themeSlice';
import { checkWeatherAlerts } from '../../features/weather/alerts';
import { useAppSelector } from '../../store/hooks';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function AppLayout() {
  const c = useColors();
  const items = useAppSelector((st) => st.watchlist.items);

  useEffect(() => {
    checkWeatherAlerts(items);
    // deliberately runs once per app open, not on every watchlist edit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.red,
        tabBarInactiveTintColor: c.muted,
        tabBarLabelStyle: { fontFamily: FONT, fontSize: 13 },
        tabBarStyle: {
          backgroundColor: c.bg,
          borderTopColor: c.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="detail" options={{ href: null }} />
    </Tabs>
  );
}