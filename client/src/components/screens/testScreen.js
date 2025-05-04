import React from "react";
import { View, Text, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { loggedInAction } from "../../sagas/loggedIn/action";
import { clientsFilteredByAction } from "../../sagas/clients/clientsFilteredBy/action";
import { clientsSearchByAction } from "../../sagas/clients/clientsSearchBy/action";
import { clientsSortedByAction } from "../../sagas/clients/clientsSortedBy/action";
import { clientsSortedDirection } from "../../sagas/clients/clientsSortedDirection/action";
import { selectClientsResultSet, selectSearchResultSet } from "../../state/clients/clientsSlice";

export default function TestScreen() {
  const dispatch = useDispatch();
  const clients = useSelector(selectClientsResultSet); // Access clients from Redux store

  const handleLoggedIn = () => {
    dispatch(loggedInAction());
  };

  const handleFilterClients = () => {
    dispatch(clientsFilteredByAction("favorite")); // Example: filter by "favorite"
  };

  const handleSearchClients = () => {
    dispatch(clientsSearchByAction("john")); // Example: search for "john"
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
      {clients.length > 0 ? (
        clients.map((client, index) => (
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
