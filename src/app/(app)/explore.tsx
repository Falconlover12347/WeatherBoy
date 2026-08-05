import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONT } from '../../constants/colors';
import { useColors } from '../../features/theme/themeSlice';
import { Place, useLazySearchPlacesQuery } from '../../features/weather/weatherApi';
import { addPlace, removePlace } from '../../features/weather/watchlistSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default function Explore() {
  const c = useColors();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((st) => st.watchlist.items);

  const [text, setText] = useState('');
  const [trigger, { data, isFetching }] = useLazySearchPlacesQuery();

  useEffect(() => {
    const q = text.trim();
    if (q.length < 2) return;
    const t = setTimeout(() => trigger(q), 400);
    return () => clearTimeout(t);
  }, [text, trigger]);

  const toggle = (p: Place, added: boolean) => {
    if (added) {
      dispatch(removePlace(p.id));
    } else {
      dispatch(
        addPlace({
          id: p.id,
          name: p.name,
          country: p.country,
          latitude: p.latitude,
          longitude: p.longitude,
        })
      );
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[s.screen, { backgroundColor: c.bg }]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={c.text} />
        </Pressable>
        <Text style={[s.title, { color: c.text }]}>Add place</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={[s.searchBox, { borderColor: c.border, backgroundColor: c.card }]}>
        <Ionicons name="search" size={18} color={c.muted} />
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Search a city or country"
          placeholderTextColor={c.muted}
          autoCorrect={false}
          style={[s.input, { color: c.text }]}
        />
        {isFetching && <ActivityIndicator color={c.red} />}
      </View>

      <FlatList
        data={data ?? []}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={{ padding: 16, paddingTop: 4 }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const added = items.some((i) => i.id === item.id);
          return (
            <Pressable
              onPress={() => toggle(item, added)}
              style={[s.row, { backgroundColor: c.card, borderColor: c.border }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[s.name, { color: c.text }]}>{item.name}</Text>
                <Text style={[s.sub, { color: c.muted }]}>{item.country}</Text>
              </View>
              <Ionicons
                name={added ? 'checkmark-circle' : 'add-circle-outline'}
                size={26}
                color={added ? c.red : c.muted}
              />
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Text style={[s.empty, { color: c.muted }]}>
            {text.trim().length < 2 ? 'Type at least 2 letters.' : isFetching ? '' : 'No results.'}
          </Text>
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
  title: { fontFamily: FONT, fontSize: 28 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderRadius: 12,
  },
  input: { flex: 1, fontFamily: FONT, fontSize: 20, paddingVertical: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  name: { fontFamily: FONT, fontSize: 24 },
  sub: { fontFamily: FONT, fontSize: 15 },
  empty: { fontFamily: FONT, fontSize: 18, textAlign: 'center', marginTop: 40 },
});