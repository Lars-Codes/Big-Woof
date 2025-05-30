import { createSlice } from '@reduxjs/toolkit';

export const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    loading: true,
    clients: [],
    filteredBy: 'all',
    filteredClients: [],
    sortedBy: 'lname',
    sortedDirection: 'asc',
    searchBy: '',
    clientsResultSet: [],
    searchResultSet: [],
    searchedResultSet: null,
    hideHeaders: false,

    deleteMode: false,
    clientsDeleteSet: [],

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
    setHideHeaders: (state, action) => {
      state.hideHeaders = action.payload;
    },
    setDeleteMode: (state, action) => {
      state.deleteMode = action.payload;
      // Clear delete set when exiting delete mode
      if (!action.payload) {
        state.clientsDeleteSet = [];
      }
    },
    setClientsDeleteSet: (state, action) => {
      state.clientsDeleteSet = action.payload;
    },
    // Optimized toggle function - single action for add/remove
    toggleClientInDeleteSet: (state, action) => {
      const clientId = action.payload;
      const index = state.clientsDeleteSet.indexOf(clientId);
      if (index === -1) {
        state.clientsDeleteSet.push(clientId);
      } else {
        state.clientsDeleteSet.splice(index, 1);
      }
    },
    addClientToDeleteSet: (state, action) => {
      const clientId = action.payload;
      if (!state.clientsDeleteSet.includes(clientId)) {
        state.clientsDeleteSet.push(clientId);
      }
    },
    removeClientFromDeleteSet: (state, action) => {
      const clientId = action.payload;
      const index = state.clientsDeleteSet.indexOf(clientId);
      if (index !== -1) {
        state.clientsDeleteSet.splice(index, 1);
      }
    },
    // Batch operations for select all/deselect all
    addMultipleClientsToDeleteSet: (state, action) => {
      const clientIds = action.payload;
      const newIds = clientIds.filter(
        (id) => !state.clientsDeleteSet.includes(id),
      );
      state.clientsDeleteSet.push(...newIds);
    },
    removeMultipleClientsFromDeleteSet: (state, action) => {
      const clientIds = action.payload;
      state.clientsDeleteSet = state.clientsDeleteSet.filter(
        (id) => !clientIds.includes(id),
      );
    },
    // Select all clients in current result set
    selectAllClients: (state) => {
      const allClientIds = state.clientsResultSet.map(
        (client) => client.client_id,
      );
      state.clientsDeleteSet = [
        ...new Set([...state.clientsDeleteSet, ...allClientIds]),
      ];
    },
    // Deselect all clients
    deselectAllClients: (state) => {
      state.clientsDeleteSet = [];
    },
    setCreateClientResult: (state, action) => {
      state.createClientResult = action.payload;
    },
    setUpdateClientResult: (state, action) => {
      state.updateClientResult = action.payload;
    },
  },
});

// Action creators
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
  setHideHeaders,
  setDeleteMode,
  setClientsDeleteSet,
  toggleClientInDeleteSet,
  addClientToDeleteSet,
  removeClientFromDeleteSet,
  addMultipleClientsToDeleteSet,
  removeMultipleClientsFromDeleteSet,
  selectAllClients,
  deselectAllClients,
  setCreateClientResult,
  setUpdateClientResult,
} = clientsSlice.actions;

// Selectors (memoized for better performance)
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
export const selectHideHeaders = (state) => state.clients.hideHeaders;
export const selectDeleteMode = (state) => state.clients.deleteMode;
export const selectClientsDeleteSet = (state) => state.clients.clientsDeleteSet;
export const selectCreateClientResult = (state) =>
  state.clients.createClientResult;
export const selectUpdateClientResult = (state) =>
  state.clients.updateClientResult;

// Derived selectors
export const selectIsAllClientsSelected = (state) => {
  const resultSet = state.clients.clientsResultSet;
  const deleteSet = state.clients.clientsDeleteSet;
  return (
    resultSet.length > 0 &&
    resultSet.every((client) => deleteSet.includes(client.client_id))
  );
};

export const selectSelectedClientsCount = (state) =>
  state.clients.clientsDeleteSet.length;

export default clientsSlice.reducer;
