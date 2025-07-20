import { createSlice } from '@reduxjs/toolkit';

export const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    selectedService: null,
    selectedInfo: 'costs',
    appointmentFees: [],
    standaloneAdditions: [],
    loading: false,
  },
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
    },
    setSelectedInfo: (state, action) => {
      state.selectedInfo = action.payload;
    },
    setAppointmentFees: (state, action) => {
      state.appointmentFees = action.payload;
    },
    setStandaloneAdditions: (state, action) => {
      state.standaloneAdditions = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setServices,
  setSelectedService,
  setSelectedInfo,
  setAppointmentFees,
  setStandaloneAdditions,
  setLoading,
} = servicesSlice.actions;

export const selectServices = (state) => state.services.services;
export const selectSelectedService = (state) => state.services.selectedService;
export const selectSelectedInfo = (state) => state.services.selectedInfo;
export const selectAppointmentFees = (state) => state.services.appointmentFees;
export const selectStandaloneAdditions = (state) =>
  state.services.standaloneAdditions;
export const selectLoading = (state) => state.services.loading;

export default servicesSlice.reducer;
