import { View, Text, Button, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { loggedInAction } from "../../../sagas/loggedIn/action";
import { clientsFilteredByAction } from "../../../sagas/clients/clientsFilteredBy/action";
import { clientsSearchByAction } from "../../../sagas/clients/clientsSearchBy/action";
import { clientsSortedByAction } from "../../../sagas/clients/clientsSortedBy/action";
import { clientsSortedDirection } from "../../../sagas/clients/clientsSortedDirection/action";
import {
  selectClientsResultSet,
  selectSearchedResultSet,
  selectSearchBy,
  selectFilteredBy,
  selectSortedBy,
  selectSortedDirection,
} from "../../../state/clients/clientsSlice";
import { processSearchedResultSetAction } from "../../../sagas/clients/processSearchedResultSet/action";

export default function ClientsScreen() {
  const dispatch = useDispatch();

  // Redux state selectors
  const clientsResultSet = useSelector(selectClientsResultSet);
  const searchedResultsSet = useSelector(selectSearchedResultSet);
  const searchBy = useSelector(selectSearchBy);
  const filteredBy = useSelector(selectFilteredBy);
  const sortedBy = useSelector(selectSortedBy);
  const sortedDirection = useSelector(selectSortedDirection);

  // Determine the dataset to display
  const dataSet =
    searchBy !== "" && searchedResultsSet ? searchedResultsSet : clientsResultSet;

  // Handlers for actions
  const handleLoggedIn = () => {
    dispatch(loggedInAction());
  };

  const handleFilterClients = () => {
    dispatch(clientsFilteredByAction(filteredBy === "all" ? "favorite" : "all"));
  };

  const handleSearchClients = () => {
    const searchQuery = "john"; // Replace with dynamic input if needed
    dispatch(clientsSearchByAction(searchQuery));
    dispatch(processSearchedResultSetAction(searchQuery));
  };

  const handleSortClients = () => {
    dispatch(clientsSortedByAction(sortedBy === "fname" ? "lname" : "fname"));
  };

  const handleSortDirection = () => {
    dispatch(
      clientsSortedDirection(sortedDirection === "asc" ? "desc" : "asc")
    );
  };

  // Render a single client item
  const renderClientItem = ({ item }) => (
    <Text className="text-lg text-gray-800 my-2">
      {item.fname} {item.lname}
    </Text>
  );

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-primary mb-4">Clients</Text>

      <View className="flex-row flex-wrap justify-between mb-4">
        <Button title="Log In" onPress={handleLoggedIn} />
        <Button
          title={`Filter (${filteredBy === "all" ? "Favorite" : "All"})`}
          onPress={handleFilterClients}
        />
        <Button title="Search (John)" onPress={handleSearchClients} />
        <Button
          title={`Sort (${sortedBy === "fname" ? "Last Name" : "First Name"})`}
          onPress={handleSortClients}
        />
        <Button
          title={`Sort Direction (${sortedDirection === "asc" ? "Desc" : "Asc"})`}
          onPress={handleSortDirection}
        />
      </View>

      {dataSet.length > 0 ? (
        <FlatList
          data={dataSet}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderClientItem}
          className="bg-white rounded-lg shadow-md p-4"
        />
      ) : (
        <Text className="text-lg text-gray-500">No clients available.</Text>
      )}
    </View>
  );
}