import { createSlice } from '@reduxjs/toolkit';

const stored = localStorage.getItem('themeMode');

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: stored === 'dark' ? 'dark' : 'light' },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('themeMode', action.payload);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
