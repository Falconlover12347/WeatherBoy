import { useRouter } from "expo-router";
import { createContext, useContext, type PropsWithChildren } from "react";

import { useLoginMutation, useLogoutMutation } from "../features/auth/authApi";
import { useAppSelector } from "../store/hooks";

const AuthContext = createContext<{
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
} | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const [logout] = useLogoutMutation();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const signUp = async (username: string, password: string, name: string) => {
    try {
      console.log("I am at signUp::::");
    } catch (error) {
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

  const signOut = async () => {
    try {
      await logout().unwrap();
      router.replace("/(auth)/login");
    } catch (error) {
      throw new Error("Failed to sign out");
    }
  };

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
