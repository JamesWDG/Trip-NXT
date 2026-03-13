import { createSlice } from '@reduxjs/toolkit';

export type Currency = 'USD' | 'NGN';

const initialState = {
  currency: 'NGN' as Currency,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCurrency: (state, action: { payload: Currency }) => {
      state.currency = action.payload;
    },
  },
});

export const { setCurrency } = settingsSlice.actions;
export default settingsSlice.reducer;
