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

    deleteMode: false,
    clientsDeleteSet: [],
    closeAllRows: false,

    createClientResult: null,
    updateClientResult: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    addClient: (state, action) => {
      const newClient = action.payload;
      state.clients.push(newClient);
      state.clientsResultSet = [...state.clients];
      state.clientsResultSet.sort((a, b) => a.lname.localeCompare(b.lname));
      state.searchResultSet = [...state.clients];
      state.searchResultSet.sort((a, b) => a.lname.localeCompare(b.lname));
    },
    updateClient: (state, action) => {
      const updatedClient = action.payload;
      const index = state.clients.findIndex(
        (client) => client.client_id === updatedClient.client_id,
      );
      if (index !== -1) {
        state.clients[index] = updatedClient;
      }
    },
    removeClient: (state, action) => {
      const clientId = action.payload;
      state.clients = state.clients.filter(
        (client) => client.client_id !== clientId,
      );
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
    setDeleteMode: (state, action) => {
      state.deleteMode = action.payload;
    },
    setClientsDeleteSet: (state, action) => {
      state.clientsDeleteSet = action.payload;
    },
    addClientToDeleteSet: (state, action) => {
      const clientId = action.payload;
      if (!state.clientsDeleteSet.includes(clientId)) {
        state.clientsDeleteSet.push(clientId);
      }
    },
    removeClientFromDeleteSet: (state, action) => {
      const clientId = action.payload;
      state.clientsDeleteSet = state.clientsDeleteSet.filter(
        (id) => id !== clientId,
      );
    },
    setCloseAllRows: (state, action) => {
      state.closeAllRows = action.payload;
    },
    setCreateClientResult: (state, action) => {
      state.createClientResult = action.payload;
    },
    setUpdateClientResult: (state, action) => {
      state.updateClientResult = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setLoading,
  setClients,
  addClient,
  updateClient,
  removeClient,
  setFilteredBy,
  setFilteredClients,
  setSortedBy,
  setSortedDirection,
  setSearchBy,
  setClientsResultSet,
  setSearchResultSet,
  setSearchedResultSet,
  setDeleteMode,
  setClientsDeleteSet,
  addClientToDeleteSet,
  removeClientFromDeleteSet,
  setCloseAllRows,
  setCreateClientResult,
  setUpdateClientResult,
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
export const selectDeleteMode = (state) => state.clients.deleteMode;
export const selectClientsDeleteSet = (state) => state.clients.clientsDeleteSet;
export const selectCloseAllRows = (state) => state.clients.closeAllRows;
export const selectCreateClientResult = (state) =>
  state.clients.createClientResult;
export const selectUpdateClientResult = (state) =>
  state.clients.updateClientResult;

export default clientsSlice.reducer;
