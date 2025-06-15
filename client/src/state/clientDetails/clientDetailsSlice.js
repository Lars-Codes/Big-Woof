import { createSlice } from '@reduxjs/toolkit';

export const clientDetailsSlice = createSlice({
  name: 'clientDetails',
  initialState: {
    loading: true,
    clientDetails: null,
    clientPets: [],
    clientProfilePicture: null,
    clientSelectedInfo: 'pets',
    clientStats: null,
    clientDocuments: [],
    clientAppointments: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setClientDetails: (state, action) => {
      state.clientDetails = action.payload;
      state.clientPets = action.payload.pets || [];
    },
    setClientFavorite: (state, action) => {
      if (state.clientDetails) {
        state.clientDetails.client_data.favorite = action.payload;
      }
    },
    setClientProfilePicture: (state, action) => {
      state.clientProfilePicture = action.payload;
    },
    setClientSelectedInfo: (state, action) => {
      state.clientSelectedInfo = action.payload;
    },
    setClientStats: (state, action) => {
      state.clientStats = action.payload;
    },
    setClientDocuments: (state, action) => {
      state.clientDocuments = action.payload;
    },
    setClientAppointments: (state, action) => {
      state.clientAppointments = action.payload;
    },
  },
});

export const {
  setLoading,
  setClientDetails,
  setClientFavorite,
  setClientProfilePicture,
  setClientSelectedInfo,
  setClientStats,
  setClientDocuments,
  setClientAppointments,
} = clientDetailsSlice.actions;

export const selectLoading = (state) => state.clientDetails.loading;
export const selectClientDetails = (state) => state.clientDetails.clientDetails;
export const selectClientFavorite = (state) =>
  state.clientDetails.clientDetails?.client_data.favorite || false;
export const selectClientPets = (state) => state.clientDetails.clientPets;
export const selectClientProfilePicture = (state) =>
  state.clientDetails.clientProfilePicture;
export const selectClientSelectedInfo = (state) =>
  state.clientDetails.clientSelectedInfo;
export const selectClientStats = (state) => state.clientDetails.clientStats;
export const selectClientDocuments = (state) =>
  state.clientDetails.clientDocuments;
export const selectClientAppointments = (state) =>
  state.clientDetails.clientAppointments;

export default clientDetailsSlice.reducer;
