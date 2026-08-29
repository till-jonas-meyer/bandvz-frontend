import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AudioState {
  url: string | null;
  bandName: string;
  trackTitle: string;
}

const initialState: AudioState = {
  url: null,
  bandName: '',
  trackTitle: '',
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setAudioData(state, action: PayloadAction<AudioState>) {
      return action.payload;
    },
    closeAudioPlayer(state) {
      return initialState;
    },
  },
});

export const {
  setAudioData,
  closeAudioPlayer,
} = audioSlice.actions;

export default audioSlice.reducer;
