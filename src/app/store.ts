import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Infer types automatically
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;