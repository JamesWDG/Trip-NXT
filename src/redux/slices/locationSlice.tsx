import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    latitude: 0,
    longitude: 0,
};

interface LocationState {
    latitude: number;
    longitude: number;
}

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: { payload: LocationState }) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;