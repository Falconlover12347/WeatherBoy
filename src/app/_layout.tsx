import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AuthProvider, { useAuth } from "@/context/AuthContext";
import { persistor, store } from "@/store/store";

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

const RootLayout = () => {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <AnimatedSplashOverlay />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </PersistGate>
        </Provider>
      </PaperProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
