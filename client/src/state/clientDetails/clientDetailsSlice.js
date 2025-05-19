import { createSlice } from '@reduxjs/toolkit';

export const clientDetailsSlice = createSlice({
  name: 'clientDetails',
  initialState: {
    loading: true,
    clientDetails: null,
    clientProfilePicture: null,
    clientSelectedInfo: 'pets',
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setClientDetails: (state, action) => {
      state.clientDetails = action.payload;
    },
    setClientProfilePicture: (state, action) => {
      state.clientProfilePicture = action.payload;
    },
    setClientSelectedInfo: (state, action) => {
      state.clientSelectedInfo = action.payload;
    },
  },
});

export const {
  setLoading,
  setClientDetails,
  setClientProfilePicture,
  setClientSelectedInfo,
} = clientDetailsSlice.actions;

export const selectLoading = (state) => state.clientDetails.loading;
export const selectClientDetails = (state) => state.clientDetails.clientDetails;
export const selectClientProfilePicture = (state) =>
  state.clientDetails.clientProfilePicture;
export const selectClientSelectedInfo = (state) =>
  state.clientDetails.clientSelectedInfo;

export default clientDetailsSlice.reducer;
