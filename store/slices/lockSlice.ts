import { createSlice } from '@reduxjs/toolkit';
const slice = createSlice({
  name: 'lock',
  initialState: { locked: false },
  reducers: {
    lock(state){ state.locked = true; },
    unlock(state){ state.locked = false; },
  }
});
export const { lock, unlock } = slice.actions;
export default slice.reducer;
