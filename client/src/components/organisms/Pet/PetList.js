import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPetsAction } from '../../../sagas/pets/fetchPets/action';
import { petsSearchByAction } from '../../../sagas/pets/petsSearchBy/action';
import { petsSortedByAction } from '../../../sagas/pets/petsSortedBy/action';
import { petsSortedDirectionAction } from '../../../sagas/pets/petsSortedDirection/action';
import { processPetSearchedResultSetAction } from '../../../sagas/pets/processPetSearchedResultSet/action';
import {
  setHideHeaders,
  selectHideHeaders,
} from '../../../state/list/listSlice';
import {
  selectPetsResultSet,
  selectDeleteMode,
  selectLoading,
  selectSearchBy,
  selectSearchedResultSet,
  selectSortedBy,
  selectSortedDirection,
} from '../../../state/pets/petsSlice';
import { petSectionedData } from '../../../utils/pets/petSectionedData';
import CustomSectionedHeader from '../../atoms/CustomSectionedHeader/CustomSectionedHeader';
import PetItem from '../../molecules/Pet/PetItem';
import SearchInput from '../../molecules/SearchInput/SearchInput';

export default function PetList() {
  const dispatch = useDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  const petsResultSet = useSelector(selectPetsResultSet);
  const searchedResultsSet = useSelector(selectSearchedResultSet);
  const sortedDirection = useSelector(selectSortedDirection);
  const sortedBy = useSelector(selectSortedBy);
  const hideHeaders = useSelector(selectHideHeaders);
  const searchBy = useSelector(selectSearchBy);
  const loading = useSelector(selectLoading);
  const deleteMode = useSelector(selectDeleteMode);
  const [searchStr, setSearchStr] = useState('');

  const rawPets =
    searchBy && searchBy.length > 0 ? searchedResultsSet : petsResultSet;

  const sectionedData = useMemo(() => {
    return petSectionedData(rawPets, sortedBy, sortedDirection);
  }, [rawPets, sortedBy, sortedDirection]);

  const handlePetSearch = useCallback(
    (e) => {
      dispatch(petsSearchByAction(e));
      setSearchStr(e);
      dispatch(processPetSearchedResultSetAction(e));
    },
    [dispatch],
  );

  const handlePetFilter = () => {
    const options = [
      'Sort Options',
      sortedDirection === 'asc' ? 'Sort Descending' : 'Sort Ascending',
      hideHeaders ? 'Show Headers' : 'Hide Headers',
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
            handleSortOptions();
            break;
          case 1:
            handleSortDirection();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 2:
            handleHeaders();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          default:
            break;
        }
      },
    );
  };

  const handleSortOptions = () => {
    const sortingOptions = [
      { label: 'Sort by Name', value: 'name' },
      { label: 'Sort by Breed', value: 'breed' },
      { label: 'Sort by Client First Name', value: 'client_fname' },
      { label: 'Sort by Client Last Name', value: 'client_lname' },
    ];

    const options = [...sortingOptions.map((option) => option.label), 'Cancel'];

    const cancelButtonIndex = options.length - 1;

    const disabledButtonIndices = [];
    sortingOptions.forEach((option, index) => {
      if (option.value === sortedBy) {
        disabledButtonIndices.push(index);
      }
    });

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        disabledButtonIndices,
      },
      (buttonIndex) => {
        if (
          buttonIndex !== cancelButtonIndex &&
          buttonIndex < sortingOptions.length
        ) {
          const selectedOption = sortingOptions[buttonIndex];
          if (selectedOption.value !== sortedBy) {
            handleOrderBy(selectedOption.value);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }
      },
    );
  };

  const handleOrderBy = useCallback(
    (order) => {
      dispatch(petsSortedByAction(order));
      if (searchStr) {
        dispatch(processPetSearchedResultSetAction(searchStr));
      }
    },
    [dispatch, searchStr],
  );

  const handleSortDirection = useCallback(() => {
    const newDir = sortedDirection === 'asc' ? 'desc' : 'asc';
    dispatch(petsSortedDirectionAction(newDir));
    if (searchStr) {
      dispatch(processPetSearchedResultSetAction(searchStr));
    }
  }, [dispatch, sortedDirection, searchStr]);

  const handleHeaders = useCallback(() => {
    const newHideHeaders = !hideHeaders;
    dispatch(setHideHeaders(newHideHeaders));
  }, [dispatch, hideHeaders]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchPetsAction());
  }, [dispatch]);

  const filteredSectionedData = useMemo(() => {
    if (hideHeaders) {
      return sectionedData.filter((item) => item.type !== 'section-header');
    }
    return sectionedData;
  }, [sectionedData, hideHeaders]);

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'section-header') {
      return <CustomSectionedHeader title={item.title} icon={item.icon} />;
    }

    return <PetItem pet={item} />;
  }, []);

  const renderListHeader = useMemo(
    () => (
      <SearchInput
        searchStr={searchStr}
        handleSearch={handlePetSearch}
        handleFilter={handlePetFilter}
        placeholder="Search Pets"
      />
    ),
    [searchStr, handlePetSearch, handlePetFilter],
  );

  const keyExtractor = useCallback((item) => {
    if (item.type === 'section-header') {
      return item.id;
    }
    return item.pet_id.toString();
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
      <FlatList
        data={filteredSectionedData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center min-h-80">
            <Text className="text-lg text-gray-500 font-hn-medium">
              No Pets available.
            </Text>
          </View>
        )}
        onRefresh={handleRefresh}
        refreshing={loading}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={10}
        updateCellsBatchingPeriod={100}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          paddingBottom: deleteMode ? 52 : 0,
        }}
        disableVirtualization={false}
      />
    </View>
  );
}
