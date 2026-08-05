import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WeatherIcon, { weatherLabel } from '../../components/weather-icon';
import { FONT } from '../../constants/colors';
import { useColors } from '../../features/theme/themeSlice';
import { useGetForecastQuery } from '../../features/weather/weatherApi';
import { WatchItem } from '../../features/weather/watchlistSlice';
import { useAppSelector } from '../../store/hooks';

const PAGE = 8;

function Row({ item }: { item: WatchItem }) {
  const c = useColors();
  const router = useRouter();
  const { data, isLoading } = useGetForecastQuery({
    lat: item.latitude,
    lon: item.longitude,
  });

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/detail', params: { id: String(item.id) } })}
      style={[s.row, { backgroundColor: c.card, borderColor: c.border }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[s.name, { color: c.text }]}>{item.name}</Text>
        <Text style={[s.country, { color: c.muted }]}>
          {isLoading || !data ? '—' : weatherLabel(data.current.weather_code)}
        </Text>
      </View>

      {isLoading || !data ? (
        <ActivityIndicator color={c.red} />
      ) : (
        <View style={s.right}>
          <Text style={[s.temp, { color: c.text }]}>
            {Math.round(data.current.temperature_2m)}°
          </Text>
          <WeatherIcon code={data.current.weather_code} color={c.red} />
        </View>
      )}
    </Pressable>
  );
}

export default function Home() {
  const c = useColors();
  const router = useRouter();
  const items = useAppSelector((st) => st.watchlist.items);
  const [count, setCount] = useState(PAGE);

  return (
    <SafeAreaView edges={['top']} style={[s.screen, { backgroundColor: c.bg }]}>
      <View style={s.header}>
        <Text style={[s.title, { color: c.text }]}>WeatherBoy</Text>
        <Pressable
          onPress={() => router.push('/explore')}
          hitSlop={12}
          style={[s.add, { borderColor: c.border }]}
        >
          <Ionicons name="add" size={24} color={c.red} />
        </Pressable>
      </View>

      <FlatList
        data={items.slice(0, count)}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => <Row item={item} />}
        onEndReachedThreshold={0.4}
        onEndReached={() => setCount((n) => (n < items.length ? n + PAGE : n))}
        contentContainerStyle={{ padding: 16, paddingTop: 4 }}
        ListEmptyComponent={
          <Text style={[s.empty, { color: c.muted }]}>No countries yet. Tap + to add one.</Text>
        }
      />
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
  },
  title: { fontFamily: FONT, fontSize: 34 },
  add: { borderWidth: 1, borderRadius: 999, padding: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  name: { fontFamily: FONT, fontSize: 26 },
  country: { fontFamily: FONT, fontSize: 16 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  temp: { fontFamily: FONT, fontSize: 30 },
  empty: { fontFamily: FONT, fontSize: 20, textAlign: 'center', marginTop: 40 },
});