import { apiSlice } from "@/api/apiSlice";
import { login } from "./authSlice";

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    gender: string;
  };
  token: string;
  refreshToken?: string | null;
  isAuthenticated?: boolean;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            login({
              user: data.user,
              token: data.token,
              refreshToken: data.refreshToken ?? null,
              isAuthenticated: data.isAuthenticated ?? true,
            }),
          );
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;
