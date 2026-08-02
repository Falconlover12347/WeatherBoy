import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";

import { apiSlice } from "../api/apiSlice";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  blacklist: ["api"], // Prevent caching API data in persisted storage
};

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(apiSlice.middleware), // This activates caching and background updates
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
