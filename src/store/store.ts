import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";

import { apiSlice } from "../api/apiSlice";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import themeReducer from "../features/theme/themeSlice";
import { weatherApi } from "../features/weather/weatherApi";
import watchlistReducer from "../features/weather/watchlistSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  blacklist: [apiSlice.reducerPath, weatherApi.reducerPath],
};

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  watchlist: watchlistReducer,
  theme: themeReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [weatherApi.reducerPath]: weatherApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).concat(apiSlice.middleware, weatherApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;