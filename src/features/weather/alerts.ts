import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { isClear, isWet } from '../../components/weather-icon';
import type { WatchItem } from './watchlistSlice';

const SEEN_KEY = 'alertsSeen';

type Seen = Record<string, string>;

async function fetchWeek(item: WatchItem) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${item.latitude}&longitude=${item.longitude}` +
    `&daily=weather_code&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = (await res.json()) as { daily: { time: string[]; weather_code: number[] } };
  return json.daily;
}

/** Odd day out: a wet day in a mostly-clear week, or a clear day in a mostly-wet week. */
function findOddDay(codes: number[], times: string[]) {
  const wet = codes.filter(isWet).length;
  const clear = codes.filter(isClear).length;

  if (clear >= 5) {
    const i = codes.findIndex(isWet);
    if (i > 0) return { day: times[i], kind: 'rain' as const };
  }
  if (wet >= 5) {
    const i = codes.findIndex(isClear);
    if (i > 0) return { day: times[i], kind: 'sun' as const };
  }
  return null;
}

export async function checkWeatherAlerts(items: WatchItem[]) {
  const watched = items.filter((i) => i.notify);
  if (watched.length === 0) return;

  const { status } = await Notifications.getPermissionsAsync();
  let granted = status === 'granted';
  if (!granted) {
    const req = await Notifications.requestPermissionsAsync();
    granted = req.status === 'granted';
  }
  if (!granted) return;

  const raw = await AsyncStorage.getItem(SEEN_KEY);
  const seen: Seen = raw ? JSON.parse(raw) : {};

  for (const item of watched) {
    try {
      const daily = await fetchWeek(item);
      if (!daily) continue;

      const odd = findOddDay(daily.weather_code, daily.time);
      if (!odd) continue;

      const key = String(item.id);
      if (seen[key] === odd.day) continue; // already told them about this one

      const label = new Date(odd.day).toLocaleDateString('en-US', { weekday: 'long' });
      const body =
        odd.kind === 'rain'
          ? `Rain expected on ${label} in an otherwise clear week.`
          : `Clear skies on ${label} in an otherwise wet week.`;

      await Notifications.scheduleNotificationAsync({
        content: { title: item.name, body },
        trigger: null,
      });

      seen[key] = odd.day;
    } catch {
      // network hiccup — skip this place
    }
  }

  await AsyncStorage.setItem(SEEN_KEY, JSON.stringify(seen));
}