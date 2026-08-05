import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type WatchItem = {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  notify: boolean;
};

const initialState = { items: [] as WatchItem[] };

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addPlace: (state, action: PayloadAction<Omit<WatchItem, 'notify'>>) => {
      if (state.items.some((i) => i.id === action.payload.id)) return;
      state.items.push({ ...action.payload, notify: true });
    },
    removePlace: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    toggleNotify: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.notify = !item.notify;
    },
  },
});

export const { addPlace, removePlace, toggleNotify } = watchlistSlice.actions;
export default watchlistSlice.reducer;