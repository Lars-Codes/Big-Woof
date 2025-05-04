import React from "react";
import { View, Text, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { loggedInAction } from "../../sagas/loggedIn/action";
import { clientsFilteredByAction } from "../../sagas/clients/clientsFilteredBy/action";
import { clientsSearchByAction } from "../../sagas/clients/clientsSearchBy/action";
import { clientsSortedByAction } from "../../sagas/clients/clientsSortedBy/action";
import { clientsSortedDirection } from "../../sagas/clients/clientsSortedDirection/action";
import {
  selectClientsResultSet,
  selectSearchedResultSet,
  selectSearchBy,
} from "../../state/clients/clientsSlice";
import { processSearchedResultSetAction } from "../../sagas/clients/processSearchedResultSet/action";

export default function TestScreen() {
  const dispatch = useDispatch();
  const clientsResultSet = useSelector(selectClientsResultSet); // Access clients from Redux store
  const searchedResultsSet = useSelector(selectSearchedResultSet); // Access search results
  const searchBy = useSelector(selectSearchBy); // Check if a search is active

  let dataSet = clientsResultSet;
  if (searchBy !== '' && searchedResultsSet) {
    dataSet = searchedResultsSet; // Use search results if a search is active
  }

  const handleLoggedIn = () => {
    dispatch(loggedInAction());
  };

  const handleFilterClients = () => {
    dispatch(clientsFilteredByAction("favorite")); // Example: filter by "favorite"
  };

  const handleSearchClients = () => {
    dispatch(clientsSearchByAction("john")); // Example: search for "john"
    dispatch(processSearchedResultSetAction("john")); // Process search results
  };

  const handleSortClients = () => {
    dispatch(clientsSortedByAction("fname")); // Example: sort by "fname"
  };

  const handleSortDirection = () => {
    dispatch(clientsSortedDirection("desc")); // Example: sort in descending order
  };


  return (
    <View>
      <Text>Test Screen</Text>
      <Text>This is a test screen.</Text>

      <Button title="Dispatch loggedInAction" onPress={handleLoggedIn} />
      <Button title="Filter Clients (Favorite)" onPress={handleFilterClients} />
      <Button title="Search Clients (John)" onPress={handleSearchClients} />
      <Button title="Sort Clients (First Name)" onPress={handleSortClients} />
      <Button
        title="Sort Direction (Descending)"
        onPress={handleSortDirection}
      />

      <Text style={{ marginTop: 20 }}>Clients will be displayed here:</Text>
      {dataSet.length > 0 ? (
        dataSet.map((client, index) => (
          <Text key={index} style={{ marginTop: 5 }}>
            {client.fname} {client.lname} - {client.phone_number}
          </Text>
        ))
      ) : (
        <Text style={{ marginTop: 5 }}>No clients available.</Text>
      )}
    </View>
  );
}
