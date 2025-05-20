import { createSlice } from '@reduxjs/toolkit';

export const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    loading: true,
    clients: [], // List of all clients
    filteredBy: 'all',
    filteredClients: [],
    sortedBy: 'lname',
    sortedDirection: 'asc',
    searchBy: '',
    clientsResultSet: [], // sorted, filtered list used for the client-list component
    searchResultSet: [], // optimized client list used for searching
    searchedResultSet: null, // process search result set flag

    currentPage: 1,
    totalPages: 0,
    pageSize: 10,

    createClientResult: null,
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
    setSearchedResultSet: (state, action) => {
      state.searchedResultSet = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setCreateClientResult: (state, action) => {
      state.createClientResult = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
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
  setSearchedResultSet,
  setCurrentPage,
  setTotalPages,
  setPageSize,
  setCreateClientResult,
} = clientsSlice.actions;

// Selectors
export const selectLoading = (state) => state.clients.loading;
export const selectClients = (state) => state.clients.clients;
export const selectFilteredBy = (state) => state.clients.filteredBy;
export const selectFilteredClients = (state) => state.clients.filteredClients;
export const selectSortedBy = (state) => state.clients.sortedBy;
export const selectSortedDirection = (state) => state.clients.sortedDirection;
export const selectSearchBy = (state) => state.clients.searchBy;
export const selectClientsResultSet = (state) => state.clients.clientsResultSet;
export const selectSearchResultSet = (state) => state.clients.searchResultSet;
export const selectSearchedResultSet = (state) =>
  state.clients.searchedResultSet;
export const selectCurrentPage = (state) => state.clients.currentPage;
export const selectTotalPages = (state) => state.clients.totalPages;
export const selectPageSize = (state) => state.clients.pageSize;
export const selectCreateClientResult = (state) =>
  state.clients.createClientResult;

export default clientsSlice.reducer;
