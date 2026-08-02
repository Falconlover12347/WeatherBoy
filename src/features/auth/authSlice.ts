import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken?: string | null;
        isAuthenticated?: boolean;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.isAuthenticated = action.payload.isAuthenticated ?? true;
    },

    logout: () => initialState,
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
