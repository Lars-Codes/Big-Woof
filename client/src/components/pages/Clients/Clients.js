import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useRef, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectClientsResultSet,
  selectSearchedResultSet,
  selectSearchBy,
  addClient,
} from '../../../state/clients/clientsSlice';
import ClientFAB from '../../atoms/Clients/ClientFAB';
import ClientList from '../../organisms/Client/ClientList';
import ClientForm from '../../templates/forms/Client/ClientForm';

export default function Clients({ navigation }) {
  const dispatch = useDispatch();
  const clientsResultSet = useSelector(selectClientsResultSet);
  const searchedResultsSet = useSelector(selectSearchedResultSet);
  const searchBy = useSelector(selectSearchBy);

  // Bottom sheet ref
  const bottomSheetRef = useRef(null);

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const clients =
    searchBy && searchBy.length > 0 ? searchedResultsSet : clientsResultSet;

  // Handle opening bottom sheet when FAB "Add Client" is pressed
  const handleAddClient = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  // Handle closing bottom sheet
  const handleCloseBottomSheet = useCallback(
    (newClient) => {
      bottomSheetRef.current?.close();
      navigation.navigate('ClientDetails');
      if (newClient) {
        setTimeout(() => {
          dispatch(addClient(newClient));
        }, 500);
      }
    },
    [navigation, dispatch],
  );

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <View className="flex-1">
      <ClientList clients={clients} />
      <ClientFAB onAddClient={handleAddClient} />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Start closed
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{
          backgroundColor: '#f8f9fa',
        }}
        handleIndicatorStyle={{
          backgroundColor: '#d1d5db',
        }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          <ClientForm
            onSuccess={handleCloseBottomSheet} // Close sheet on success
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
