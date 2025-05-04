import { createSlice } from "@reduxjs/toolkit";

export const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    loading: true,
    clients: [], // List of all clients
    selectedClient: null, // Detailed data for a selected client
    filteredBy: "all",
    filteredClients: [],
    sortedBy: "lname",
    sortedDirection: "asc",
    searchBy: "",
    clientsResultSet: [], // sorted, filtered list used for the client-list component
    searchResultSet: [], // optimized client list used for searching
    searchedResultSet: null, // process search result set flag
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload;
    },
    setFilteredBy: (state, action) => {
      state.filteredBy = action.payload;
    },
    setFilteredClients: (state, action) => {
      state.filteredClients = action.payload;
    },
    setSortedBy: (state, action) => {
      state.sortedBy = action.payload;
    },
    setSortedDirection: (state, action) => {
      state.sortedDirection = action.payload;
    },
    setSearchBy: (state, action) => {
      state.searchBy = action.payload;
    },
    setClientsResultSet: (state, action) => {
      state.clientsResultSet = action.payload;
    },
    setSearchResultSet: (state, action) => {
      state.searchResultSet = action.payload;
    },
    setSearchedResultSet: (state, action) => {
      state.searchedResultSet = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setLoading,
  setClients,
  setSelectedClient,
  setFilteredBy,
  setFilteredClients,
  setSortedBy,
  setSortedDirection,
  setSearchBy,
  setClientsResultSet,
  setSearchResultSet,
  setSearchedResultSet,
} = clientsSlice.actions;

// Selectors
export const selectLoading = (state) => state.clients.loading;
export const selectClients = (state) => state.clients.clients;
export const selectSelectedClient = (state) => state.clients.selectedClient;
export const selectFilteredBy = (state) => state.clients.filteredBy;
export const selectFilteredClients = (state) => state.clients.filteredClients;
export const selectSortedBy = (state) => state.clients.sortedBy;
export const selectSortedDirection = (state) => state.clients.sortedDirection;
export const selectSearchBy = (state) => state.clients.searchBy;
export const selectClientsResultSet = (state) => state.clients.clientsResultSet;
export const selectSearchResultSet = (state) => state.clients.searchResultSet;
export const selectSearchedResultSet = (state) =>
  state.clients.searchedResultSet;

export default clientsSlice.reducer;
