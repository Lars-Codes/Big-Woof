import { createSlice, createSelector } from '@reduxjs/toolkit';

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
    // Removed clientsDeleteSet since we're using isSelected on each client

    createClientResult: null,
    updateClientResult: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setClients: (state, action) => {
      // Add isSelected: false to each client when setting them
      state.clients = action.payload.map((client) => ({
        ...client,
        isSelected: false,
      }));
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
      // Ensure isSelected property exists on result set items
      state.clientsResultSet = action.payload.map((client) => ({
        ...client,
        isSelected: client.isSelected || false,
      }));
    },
    setSearchResultSet: (state, action) => {
      // Ensure isSelected property exists on search result set items
      state.searchResultSet = action.payload.map((client) => ({
        ...client,
        isSelected: client.isSelected || false,
      }));
    },
    setSearchedResultSet: (state, action) => {
      if (action.payload) {
        state.searchedResultSet = action.payload.map((client) => ({
          ...client,
          isSelected: client.isSelected || false,
        }));
      } else {
        state.searchedResultSet = action.payload;
      }
    },
    setHideHeaders: (state, action) => {
      state.hideHeaders = action.payload;
    },
    setDeleteMode: (state, action) => {
      state.deleteMode = action.payload;
      if (!action.payload) {
        // Clear all selections when exiting delete mode
        state.clients.forEach((client) => {
          client.isSelected = false;
        });
        state.clientsResultSet.forEach((client) => {
          client.isSelected = false;
        });
        if (state.searchResultSet) {
          state.searchResultSet.forEach((client) => {
            client.isSelected = false;
          });
        }
        if (state.searchedResultSet) {
          state.searchedResultSet.forEach((client) => {
            client.isSelected = false;
          });
        }
      }
    },
    toggleClientSelection: (state, action) => {
      const clientId = action.payload;

      // More efficient: only update the main source array and let derived arrays be computed
      const mainClient = state.clients.find((c) => c.client_id === clientId);
      if (mainClient) {
        mainClient.isSelected = !mainClient.isSelected;

        // Update result set more efficiently
        const resultClient = state.clientsResultSet.find(
          (c) => c.client_id === clientId,
        );
        if (resultClient) {
          resultClient.isSelected = mainClient.isSelected;
        }

        // Only update search arrays if they exist and contain the client
        if (state.searchedResultSet) {
          const searchedClient = state.searchedResultSet.find(
            (c) => c.client_id === clientId,
          );
          if (searchedClient) {
            searchedClient.isSelected = mainClient.isSelected;
          }
        }
      }
    },

    selectAllClients: (state) => {
      // Batch update for better performance
      const shouldSelect = true;

      // Update main clients array
      state.clients.forEach((client) => {
        client.isSelected = shouldSelect;
      });

      // Update result set
      state.clientsResultSet.forEach((client) => {
        client.isSelected = shouldSelect;
      });

      // Update search arrays if they exist
      if (state.searchedResultSet) {
        state.searchedResultSet.forEach((client) => {
          client.isSelected = shouldSelect;
        });
      }
    },

    deselectAllClients: (state) => {
      // Batch update for better performance
      const shouldSelect = false;

      // Update main clients array
      state.clients.forEach((client) => {
        client.isSelected = shouldSelect;
      });

      // Update result set
      state.clientsResultSet.forEach((client) => {
        client.isSelected = shouldSelect;
      });

      // Update search arrays if they exist
      if (state.searchedResultSet) {
        state.searchedResultSet.forEach((client) => {
          client.isSelected = shouldSelect;
        });
      }
    },
    batchUpdateSelection: (state, action) => {
      const { clientIds, isSelected } = action.payload;

      // Create a Set for O(1) lookups
      const clientIdSet = new Set(clientIds);

      // Update all arrays efficiently
      [
        state.clients,
        state.clientsResultSet,
        state.searchResultSet,
        state.searchedResultSet,
      ].forEach((array) => {
        if (array) {
          array.forEach((client) => {
            if (clientIdSet.has(client.client_id)) {
              client.isSelected = isSelected;
            }
          });
        }
      });
    },
    setCreateClientResult: (state, action) => {
      state.createClientResult = action.payload;
    },
    setUpdateClientResult: (state, action) => {
      state.updateClientResult = action.payload;
    },
    updateClientFavorite: (state, action) => {
      const { clientId, isFavorite } = action.payload;
      [
        state.clients,
        state.clientsResultSet,
        state.searchResultSet,
        state.searchedResultSet,
      ].forEach((array) => {
        if (array) {
          const client = array.find((c) => c.client_id === clientId);
          if (client) {
            client.favorite = isFavorite ? 1 : 0;
          }
        }
      });
    },
  },
});

// Action creators
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
  setHideHeaders,
  setDeleteMode,
  toggleClientSelection,
  selectAllClients,
  deselectAllClients,
  batchUpdateSelection,
  setCreateClientResult,
  setUpdateClientResult,
  updateClientFavorite,
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
export const selectCreateClientResult = (state) =>
  state.clients.createClientResult;
export const selectUpdateClientResult = (state) =>
  state.clients.updateClientResult;

// Updated derived selectors to use isSelected instead of clientsDeleteSet
export const selectSelectedClients = createSelector(
  [(state) => state.clients.clientsResultSet],
  (clientsResultSet) => {
    return clientsResultSet.filter((client) => client.isSelected === true);
  },
);

export const selectSelectedClientsCount = createSelector(
  [selectSelectedClients],
  (selectedClients) => selectedClients.length,
);

export const selectIsAllClientsSelected = createSelector(
  [(state) => state.clients.clientsResultSet],
  (resultSet) => {
    return (
      resultSet.length > 0 &&
      resultSet.every((client) => client.isSelected === true)
    );
  },
);

// New selector to get array of selected client IDs (if needed for API calls)
export const selectSelectedClientIds = createSelector(
  [(state) => state.clients.clientsResultSet],
  (clientsResultSet) => {
    return clientsResultSet
      .filter((client) => client.isSelected === true)
      .map((client) => client.client_id);
  },
);

export default clientsSlice.reducer;
