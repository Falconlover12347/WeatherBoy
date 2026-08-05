import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WeatherIcon, { weatherLabel } from '../../components/weather-icon';
import { FONT } from '../../constants/colors';
import { useColors } from '../../features/theme/themeSlice';
import { useGetForecastQuery } from '../../features/weather/weatherApi';
import { toggleNotify } from '../../features/weather/watchlistSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const dayName = (iso: string, i: number) =>
  i === 0 ? 'Today' : new Date(iso).toLocaleDateString('en-US', { weekday: 'short' });

export default function Detail() {
  const c = useColors();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  const item = useAppSelector((st) => st.watchlist.items.find((i) => String(i.id) === id));

  const { data, isLoading } = useGetForecastQuery(
    item ? { lat: item.latitude, lon: item.longitude } : { lat: 0, lon: 0 },
    { skip: !item }
  );

  if (!item) {
    return (
      <SafeAreaView style={[s.screen, { backgroundColor: c.bg }]}>
        <Text style={[s.empty, { color: c.muted }]}>Place not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[s.screen, { backgroundColor: c.bg }]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={c.text} />
        </Pressable>

        <Text style={[s.title, { color: c.text }]} numberOfLines={1}>
          {item.name}
        </Text>

        <Pressable onPress={() => dispatch(toggleNotify(item.id))} hitSlop={12}>
          <Ionicons
            name={item.notify ? 'notifications' : 'notifications-off-outline'}
            size={24}
            color={item.notify ? c.red : c.muted}
          />
        </Pressable>
      </View>

      {isLoading || !data ? (
        <ActivityIndicator color={c.red} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={[s.hero, { backgroundColor: c.card, borderColor: c.border }]}>
            <WeatherIcon code={data.current.weather_code} size={54} color={c.red} />
            <Text style={[s.heroTemp, { color: c.text }]}>
              {Math.round(data.current.temperature_2m)}°
            </Text>
            <Text style={[s.heroLabel, { color: c.muted }]}>
              {weatherLabel(data.current.weather_code)} · {item.country}
            </Text>
          </View>

          <Text style={[s.section, { color: c.text }]}>This week</Text>

          {data.daily.time.map((t, i) => (
            <View key={t} style={[s.day, { backgroundColor: c.card, borderColor: c.border }]}>
              <Text style={[s.dayName, { color: c.text }]}>{dayName(t, i)}</Text>
              <WeatherIcon code={data.daily.weather_code[i]} size={24} color={c.red} />
              <Text style={[s.dayTemp, { color: c.text }]}>
                {Math.round(data.daily.temperature_2m_max[i])}°
                <Text style={{ color: c.muted }}>
                  {'  '}
                  {Math.round(data.daily.temperature_2m_min[i])}°
                </Text>
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  title: { fontFamily: FONT, fontSize: 28, flex: 1, textAlign: 'center' },
  hero: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 28,
    marginBottom: 22,
    gap: 4,
  },
  heroTemp: { fontFamily: FONT, fontSize: 64 },
  heroLabel: { fontFamily: FONT, fontSize: 18 },
  section: { fontFamily: FONT, fontSize: 24, marginBottom: 10 },
  day: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  dayName: { fontFamily: FONT, fontSize: 20, width: 70 },
  dayTemp: { fontFamily: FONT, fontSize: 20 },
  empty: { fontFamily: FONT, fontSize: 20, textAlign: 'center', marginTop: 40 },
});