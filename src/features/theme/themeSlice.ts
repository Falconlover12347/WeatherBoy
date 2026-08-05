import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DARK, LIGHT, Palette } from '../../constants/colors';
import { useAppSelector } from '../../store/hooks';

export type Mode = 'light' | 'dark';

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: 'light' as Mode },
  reducers: {
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },
    toggleMode: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { setMode, toggleMode } = themeSlice.actions;
export default themeSlice.reducer;

export const useColors = (): Palette =>
  useAppSelector((s) => s.theme.mode) === 'dark' ? DARK : LIGHT;