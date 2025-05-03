import { createSlice } from "@reduxjs/toolkit";

export const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    loading: true,
    clients: [],

    filteredBy: "all",
    filteredClients: true,
    sortedBy: "last_name",
    sortedDirection: "asc",
    searchBy: "",

    clientsResultSet: [], // sorted, filter list used for the client-list component
    searchResultSet: [], // optimized client list used for searching
    contactsResultSetUnfiltered: [],
    searchedResultSet: null, // processed search result set flag
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setClients: (state, action) => {
      state.clients = action.payload;
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
    setContactsResultSetUnfiltered: (state, action) => {
      state.contactsResultSetUnfiltered = action.payload;
    },
    setSearchedResultSet: (state, action) => {
      state.searchedResultSet = action.payload;
    },
  },
});

// action creators are generated for each case reducer function
export const {
  setLoading,
  setClients,
  setFilteredBy,
  setFilteredClients,
  setSortedBy,
  setSortedDirection,
  setSearchBy,
  setClientsResultSet,
  setSearchResultSet,
  setContactsResultSetUnfiltered,
  setSearchedResultSet,
} = clientsSlice.actions;

// selectors
export const selectLoading = (state) => state.clients.loading;
export const selectClients = (state) => state.clients.clients;
export const selectFilteredBy = (state) => state.clients.filteredBy;
export const selectFilteredClients = (state) => state.clients.filteredClients;
export const selectSortedBy = (state) => state.clients.sortedBy;
export const selectSortedDirection = (state) => state.clients.sortedDirection;
export const selectSearchBy = (state) => state.clients.searchBy;
export const selectClientsResultSet = (state) => state.clients.clientsResultSet;
export const selectSearchResultSet = (state) => state.clients.searchResultSet;
export const selectContactsResultSetUnfiltered = (state) =>
  state.clients.contactsResultSetUnfiltered;
export const selectSearchedResultSet = (state) =>
  state.clients.searchedResultSet;

export default clientsSlice.reducer;