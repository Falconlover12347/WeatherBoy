import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AuthProvider, { useAuth } from "@/context/AuthContext";
import { useAppFonts } from "@/hooks/use-app-fonts";
import { persistor, store, type RootState } from "@/store/store";

SplashScreen.preventAutoHideAsync();

const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Protected routes - only accessible when logged in */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      {/* Auth routes - only accessible when logged out */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
};

const Themed = () => {
  const mode = useSelector((s: RootState) => s.theme.mode);

  return (
    <ThemeProvider value={mode === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <AnimatedSplashOverlay />
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </PaperProvider>
    </ThemeProvider>
  );
};

const RootLayout = () => {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Themed />
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;