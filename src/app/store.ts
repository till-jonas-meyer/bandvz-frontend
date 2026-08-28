import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import audioReducer from '../features/audio/audioSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    audio: audioReducer,
  },
});

// Infer types automatically
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;