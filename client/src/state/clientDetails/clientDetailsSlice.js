import { createSlice } from '@reduxjs/toolkit';

export const clientDetailsSlice = createSlice({
  name: 'clientDetails',
  initialState: {
    loading: true,
    clientDetails: null,
    clientPets: [],
    clientVets: [],
    clientVetDetails: null,
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
      state.clientPets = action.payload?.pets || [];
      state.clientVets = action.payload?.client_vets || [];
    },
    removeClientVet: (state, action) => {
      const vetId = action.payload;
      state.clientVets = state.clientVets.filter((vet) => vet.id !== vetId);
      if (state.clientDetails?.client_vets) {
        state.clientDetails.client_vets =
          state.clientDetails.client_vets.filter((vet) => vet.id !== vetId);
      }
    },
    setClientVetDetails: (state, action) => {
      state.clientVetDetails = action.payload;
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
  removeClientPet,
  removeClientVet,
  setClientVetDetails,
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
export const selectClientVets = (state) => state.clientDetails.clientVets;
export const selectClientVetDetails = (state) =>
  state.clientDetails.clientVetDetails;
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
