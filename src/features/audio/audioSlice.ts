import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AudioState {
  url: string | null;
}

const initialState: AudioState = {
  url: null,
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setAudioUrl(state, action: PayloadAction<string | null>) {
      state.url = action.payload;
    },
    closeAudioPlayer(state) {
      state.url = null;
    },
  },
});

export const {
  setAudioUrl,
  closeAudioPlayer,
} = audioSlice.actions;

export default audioSlice.reducer;
