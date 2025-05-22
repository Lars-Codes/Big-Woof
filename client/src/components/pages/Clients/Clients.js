import React from 'react';
import { View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientsAction } from '../../../sagas/clients/fetchClients/action';
import {
  selectLoading,
  selectClientsResultSet,
  selectSearchedResultSet,
  selectSearchBy,
  selectCurrentPage,
  selectTotalPages,
  selectPageSize,
  setCurrentPage,
} from '../../../state/clients/clientsSlice';
import ClientList from '../../organisms/Client/ClientList';

export default function Clients() {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const clientsResultSet = useSelector(selectClientsResultSet);
  const searchedResultsSet = useSelector(selectSearchedResultSet);
  const searchBy = useSelector(selectSearchBy);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const pageSize = useSelector(selectPageSize);

  const clients =
    searchBy && searchBy.length > 0 ? searchedResultsSet : clientsResultSet;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
      dispatch(
        fetchClientsAction({
          page: newPage,
          pageSize: pageSize,
          searchBy: searchBy,
        }),
      );
    }
  };

  return (
    <View className="flex-1">
      <ClientList clients={clients} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 12,
        }}
      >
        <Button
          title="Previous"
          disabled={currentPage <= 1}
          onPress={() => handlePageChange(currentPage - 1)}
        />
        <Text style={{ marginHorizontal: 16 }}>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          title="Next"
          disabled={currentPage >= totalPages}
          onPress={() => handlePageChange(currentPage + 1)}
        />
      </View>
    </View>
  );
}
