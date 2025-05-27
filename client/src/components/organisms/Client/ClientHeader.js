import { useActionSheet } from '@expo/react-native-action-sheet';
import { ListFilter } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clientsFilteredByAction } from '../../../sagas/clients/clientsFilteredBy/action';
import { clientsSearchByAction } from '../../../sagas/clients/clientsSearchBy/action';
import { clientsSortedByAction } from '../../../sagas/clients/clientsSortedBy/action';
import { clientsSortedDirectionAction } from '../../../sagas/clients/clientsSortedDirection/action';
import { processSearchedResultSetAction } from '../../../sagas/clients/processSearchedResultSet/action';
import {
  selectSortedDirection,
  selectSortedBy,
  selectFilteredBy,
} from '../../../state/clients/clientsSlice';
import SearchInput from '../../molecules/SearchInput/SearchInput';

export default function ClientHeader() {
  const dispatch = useDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  const filteredBy = useSelector(selectFilteredBy);
  const sortedDirection = useSelector(selectSortedDirection);
  const sortedBy = useSelector(selectSortedBy);

  const [searchMode, setSearchMode] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [searchStr, setSearchStr] = useState('');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: searchMode ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [searchMode, fadeAnim]);

  const handleClientSearch = (e) => {
    dispatch(clientsSearchByAction(e));
    setSearchStr(e);
    dispatch(processSearchedResultSetAction(e));
  };

  const handleOrderBy = (order) => {
    dispatch(clientsSortedByAction(order));
    if (searchStr) {
      dispatch(processSearchedResultSetAction(searchStr));
    }
  };

  const handleSortDirection = () => {
    const newDir = sortedDirection === 'asc' ? 'desc' : 'asc';
    dispatch(clientsSortedDirectionAction(newDir));
    if (searchStr) {
      dispatch(processSearchedResultSetAction(searchStr));
    }
  };

  const handleFilterBy = () => {
    const newFilter = filteredBy === 'all' ? 'favorite' : 'all';
    dispatch(clientsFilteredByAction(newFilter));
    if (searchStr) {
      dispatch(processSearchedResultSetAction(searchStr));
    }
  };

  const handleShowSortMenu = () => {
    const options = [
      sortedBy === 'fname' ? 'Sort by Last Name' : 'Sort by First Name',
      sortedDirection === 'asc' ? 'Sort Descending' : 'Sort Ascending',
      filteredBy === 'all' ? 'Filter by Favorites' : 'Show All Clients',
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
            handleFilterBy();
            break;
          default:
            break;
        }
      },
    );
  };

  return (
    <>
      <View className="flex-1 items-start absolute bottom-0">
        <Animated.Text
          className="text-4xl font-hn-bold"
          style={{ opacity: fadeAnim }}
        >
          Clients
        </Animated.Text>
      </View>
      <View className="flex-row items-center justify-end">
        <TouchableOpacity
          onPress={handleShowSortMenu}
          className="mr-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ListFilter size={32} color="#888" />
        </TouchableOpacity>
        <SearchInput
          searchStr={searchStr}
          handleSearch={handleClientSearch}
          onSearchModeChange={setSearchMode}
        />
      </View>
    </>
  );
}
