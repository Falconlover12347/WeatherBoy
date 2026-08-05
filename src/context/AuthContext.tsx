import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  type PropsWithChildren,
} from "react";
import { useDispatch } from "react-redux";

import { persistor } from "@/store/store";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../features/auth/authApi";
import { logout } from "../features/auth/authSlice";
import { useAppSelector } from "../store/hooks";

const AuthContext = createContext<{
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
} | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  const signUp = async (
    username: string,
    password: string,
    name: string
  ) => {
    try {
      await register({
        firstName: name,
        lastName: "",
        age: 20,
      }).unwrap();

      console.log("Account created successfully!");
      // Navigation is handled by the calling screen (SignupScreen shows a
      // success modal and redirects when the user taps its button).
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Failed to create account");
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      await login({
        username,
        password,
      }).unwrap();

      router.replace("/(app)");
    } catch (error) {
      throw new Error("Failed to sign in");
    }
  };

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("persist:root");
      await persistor.purge();
      dispatch(logout());
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
      router.replace("/(auth)/login");
    }
  }, [dispatch, router]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
