import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONT } from '../../constants/colors';
import { toggleMode, useColors } from '../../features/theme/themeSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default function Profile() {
  const c = useColors();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((st) => st.theme.mode);

  // TODO: point these at your real auth state / logout action
  const user = useAppSelector((st) => st.auth.user);
  const onLogout = () => {};

  return (
    <SafeAreaView edges={['top']} style={[s.screen, { backgroundColor: c.bg }]}>
      <Text style={[s.title, { color: c.text }]}>Profile</Text>

      <View style={[s.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <View style={[s.avatar, { borderColor: c.border }]}>
          <Ionicons name="person" size={30} color={c.red} />
        </View>
        <Text style={[s.name, { color: c.text }]}>{user?.username ?? '—'}</Text>
        <Text style={[s.email, { color: c.muted }]}>{user?.email ?? '—'}</Text>
      </View>

      <View style={[s.row, { backgroundColor: c.card, borderColor: c.border }]}>
        <Ionicons name={mode === 'dark' ? 'moon' : 'sunny'} size={22} color={c.red} />
        <Text style={[s.rowText, { color: c.text }]}>Dark mode</Text>
        <Switch
          value={mode === 'dark'}
          onValueChange={() => {
            dispatch(toggleMode());
          }}
          trackColor={{ true: c.red, false: c.border }}
        />
      </View>

      <Pressable
        onPress={onLogout}
        style={[s.row, { backgroundColor: c.card, borderColor: c.border }]}
      >
        <Ionicons name="log-out-outline" size={22} color={c.red} />
        <Text style={[s.rowText, { color: c.red }]}>Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  title: { fontFamily: FONT, fontSize: 34, marginBottom: 16 },
  card: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 26,
    marginBottom: 20,
    gap: 4,
  },
  avatar: { borderWidth: 1, borderRadius: 999, padding: 14, marginBottom: 8 },
  name: { fontFamily: FONT, fontSize: 28 },
  email: { fontFamily: FONT, fontSize: 17 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  rowText: { fontFamily: FONT, fontSize: 20, flex: 1 },
});