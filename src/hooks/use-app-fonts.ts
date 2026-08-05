import { LeagueGothic_400Regular } from '@expo-google-fonts/league-gothic';
import { useFonts } from 'expo-font';

export function useAppFonts() {
  const [loaded] = useFonts({
    LeagueGothic: LeagueGothic_400Regular,
  });
  return loaded;
}