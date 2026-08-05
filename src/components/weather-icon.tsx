import { Ionicons } from '@expo/vector-icons';

type Props = { code: number; size?: number; color?: string };

const map: Record<number, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  0: { icon: 'sunny', label: 'Clear' },
  1: { icon: 'partly-sunny', label: 'Mostly clear' },
  2: { icon: 'partly-sunny', label: 'Partly cloudy' },
  3: { icon: 'cloud', label: 'Overcast' },
  45: { icon: 'cloudy', label: 'Fog' },
  48: { icon: 'cloudy', label: 'Fog' },
  51: { icon: 'rainy', label: 'Drizzle' },
  53: { icon: 'rainy', label: 'Drizzle' },
  55: { icon: 'rainy', label: 'Drizzle' },
  61: { icon: 'rainy', label: 'Rain' },
  63: { icon: 'rainy', label: 'Rain' },
  65: { icon: 'rainy', label: 'Heavy rain' },
  71: { icon: 'snow', label: 'Snow' },
  73: { icon: 'snow', label: 'Snow' },
  75: { icon: 'snow', label: 'Heavy snow' },
  77: { icon: 'snow', label: 'Snow grains' },
  80: { icon: 'rainy', label: 'Showers' },
  81: { icon: 'rainy', label: 'Showers' },
  82: { icon: 'rainy', label: 'Heavy showers' },
  85: { icon: 'snow', label: 'Snow showers' },
  86: { icon: 'snow', label: 'Snow showers' },
  95: { icon: 'thunderstorm', label: 'Thunderstorm' },
  96: { icon: 'thunderstorm', label: 'Thunderstorm' },
  99: { icon: 'thunderstorm', label: 'Thunderstorm' },
};

const fallback = { icon: 'cloud' as const, label: 'Unknown' };

export const weatherLabel = (code: number) => (map[code] ?? fallback).label;

export const isWet = (code: number) => code >= 51;
export const isClear = (code: number) => code <= 2;

export default function WeatherIcon({ code, size = 28, color = '#FF5C5C' }: Props) {
  const { icon } = map[code] ?? fallback;
  return <Ionicons name={icon} size={size} color={color} />;
}