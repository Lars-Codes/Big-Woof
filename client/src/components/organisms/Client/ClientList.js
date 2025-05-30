import { useActionSheet } from '@expo/react-native-action-sheet';
import { Star } from 'lucide-react-native';
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useSelector, useDispatch } from 'react-redux';
import { clientsSearchByAction } from '../../../sagas/clients/clientsSearchBy/action';
import { clientsSortedByAction } from '../../../sagas/clients/clientsSortedBy/action';
import { clientsSortedDirectionAction } from '../../../sagas/clients/clientsSortedDirection/action';
import { fetchClientsAction } from '../../../sagas/clients/fetchClients/action';
import { processSearchedResultSetAction } from '../../../sagas/clients/processSearchedResultSet/action';
import {
  selectClientsResultSet,
  selectDeleteMode,
  selectHideHeaders,
  selectLoading,
  selectSearchBy,
  selectSearchedResultSet,
  selectSortedBy,
  selectSortedDirection,
  setHideHeaders,
} from '../../../state/clients/clientsSlice';
import ClientItem from '../../molecules/Client/ClientItem';
import SearchInput from '../../molecules/SearchInput/SearchInput';

// Section Header Component
const SectionHeader = ({ title, icon }) => (
  <View className="bg-gray-100 px-4 py-2 border-b border-gray-200">
    <View className="flex-row items-center">
      <Text className="text-lg font-semibold text-gray-700">{title}</Text>
      {icon && <View className="ml-2">{icon}</View>}
    </View>
  </View>
);

// Function to transform clients data into sectioned format
const createSectionedData = (clients, sortedBy = 'fname') => {
  if (!clients || clients.length === 0) return [];

  // Separate favorites and non-favorites
  const favorites = clients.filter((client) => client.favorite);
  const nonFavorites = clients.filter((client) => !client.favorite);

  const result = [];

  // Add favorites section if there are any
  if (favorites.length > 0) {
    result.push({
      id: 'favorites-header',
      type: 'section-header',
      title: 'Favorites',
      icon: <Star size={16} color="#000" />,
    });

    favorites.forEach((client) => {
      result.push({
        ...client,
        type: 'client',
      });
    });
  }

  // Group non-favorites by first letter of the specified field
  const groupedClients = nonFavorites.reduce((acc, client) => {
    const name = sortedBy === 'fname' ? client.fname : client.lname;
    const firstLetter = (name || '').charAt(0).toUpperCase();
    const letter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';

    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(client);
    return acc;
  }, {});

  // Sort letters and add to result
  const sortedLetters = Object.keys(groupedClients).sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });

  sortedLetters.forEach((letter) => {
    // Add section header
    result.push({
      id: `section-${letter}`,
      type: 'section-header',
      title: letter,
    });

    // Add clients for this letter
    groupedClients[letter].forEach((client) => {
      result.push({
        ...client,
        type: 'client',
      });
    });
  });

  return result;
};

export default function ClientList() {
  const dispatch = useDispatch();
  const { showActionSheetWithOptions } = useActionSheet();
  const clientsResultSet = useSelector(selectClientsResultSet);
  const searchedResultsSet = useSelector(selectSearchedResultSet);
  const sortedDirection = useSelector(selectSortedDirection);
  const sortedBy = useSelector(selectSortedBy);
  const hideHeaders = useSelector(selectHideHeaders);
  const searchBy = useSelector(selectSearchBy);
  const loading = useSelector(selectLoading);
  const deleteMode = useSelector(selectDeleteMode);
  const [searchStr, setSearchStr] = useState('');

  const rawClients =
    searchBy && searchBy.length > 0 ? searchedResultsSet : clientsResultSet;

  // Transform clients into sectioned data
  const sectionedData = useMemo(() => {
    return createSectionedData(rawClients, sortedBy);
  }, [rawClients, sortedBy]);

  // Memoize the search handler to prevent unnecessary re-renders
  const handleClientSearch = useCallback(
    (e) => {
      dispatch(clientsSearchByAction(e));
      setSearchStr(e);
      dispatch(processSearchedResultSetAction(e));
    },
    [dispatch],
  );

  const handleClientFilter = () => {
    const options = [
      sortedBy === 'fname' ? 'Sort by Last Name' : 'Sort by First Name',
      sortedDirection === 'asc' ? 'Sort Descending' : 'Sort Ascending',
      hideHeaders === true ? 'Show Headers' : 'Hide Headers',
      'Cancel',
    ];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            handleOrderBy(sortedBy === 'fname' ? 'lname' : 'fname');
            break;
          case 1:
            handleSortDirection();
            break;
          case 2:
            handleHeaders();
            break;
          default:
            break;
        }
      },
    );
  };

  const handleOrderBy = useCallback(
    (order) => {
      dispatch(clientsSortedByAction(order));
      if (searchStr) {
        dispatch(processSearchedResultSetAction(searchStr));
      }
    },
    [dispatch, searchStr],
  );

  const handleSortDirection = useCallback(() => {
    const newDir = sortedDirection === 'asc' ? 'desc' : 'asc';
    dispatch(clientsSortedDirectionAction(newDir));
    if (searchStr) {
      dispatch(processSearchedResultSetAction(searchStr));
    }
  }, [dispatch, sortedDirection, searchStr]);

  const handleHeaders = useCallback(() => {
    const newHideHeaders = !hideHeaders;
    dispatch(setHideHeaders(newHideHeaders));
  }, [dispatch, hideHeaders]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchClientsAction());
  }, [dispatch]);

  // Filter the data based on hideHeaders setting
  const filteredSectionedData = useMemo(() => {
    if (hideHeaders) {
      // Filter out section headers when hideHeaders is true
      return sectionedData.filter((item) => item.type !== 'section-header');
    }
    return sectionedData;
  }, [sectionedData, hideHeaders]);

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'section-header') {
      return <SectionHeader title={item.title} icon={item.icon} />;
    }

    return <ClientItem client={item} />;
  }, []);

  const renderListHeader = useMemo(
    () => (
      <SearchInput
        searchStr={searchStr}
        handleSearch={handleClientSearch}
        handleFilter={handleClientFilter}
      />
    ),
    [searchStr, handleClientSearch, handleClientFilter],
  );

  // Custom keyExtractor to handle both clients and headers
  const keyExtractor = useCallback((item) => {
    if (item.type === 'section-header') {
      return item.id;
    }
    return item.client_id.toString();
  }, []);

  if (loading && sectionedData.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <SwipeListView
        data={filteredSectionedData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center min-h-80">
            <Text className="text-lg text-gray-500">No clients available.</Text>
          </View>
        )}
        onRefresh={handleRefresh}
        refreshing={loading}
        disableRightSwipe={true}
        rightOpenValue={-75} // Only allow swipe for client items, not headers
        disableRowSwipeForHandler={(item) => item.type === 'section-header'}
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustContentInsets={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          paddingBottom: deleteMode ? 52 : 0,
        }}
      />
    </View>
  );
}
