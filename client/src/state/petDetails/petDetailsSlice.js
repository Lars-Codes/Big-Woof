import { createSlice } from '@reduxjs/toolkit';

export const petDetailsSlice = createSlice({
  name: 'petDetails',
  initialState: {
    loading: true,
    petDetails: null,
    petProfilePicture: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPetDetails: (state, action) => {
      state.petDetails = action.payload;
    },
    setPetDeceased: (state, action) => {
      if (state.petDetails) {
        state.petDetails.pet_data.deceased = action.payload;
      }
    },
    setPetProfilePicture: (state, action) => {
      state.petProfilePicture = action.payload;
    },
    setGender: (state, action) => {
      if (state.petDetails) {
        state.petDetails.pet_data.gender = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setPetDetails,
  setPetDeceased,
  setPetProfilePicture,
  setGender,
} = petDetailsSlice.actions;

export const selectLoading = (state) => state.petDetails.loading;
export const selectPetDetails = (state) => state.petDetails.petDetails;
export const selectPetProfilePicture = (state) =>
  state.petDetails.petProfilePicture;

export default petDetailsSlice.reducer;
