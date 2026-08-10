import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type UserState = User | null;

const initialState: UserState = null as UserState | null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state: UserState, action: PayloadAction<User>) {
      return action.payload;
    },
    unsetUser() {
      return null;
    },
  },
});

export const {
  setUser,
  unsetUser,
} = userSlice.actions;

export default userSlice.reducer;