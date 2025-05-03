// test screen

import React from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { loggedInAction } from "../../sagas/loggedIn/action";
import { selectClients } from "../../state/clients/clientsSlice";

export default function TestScreen() {
  const dispatch = useDispatch();
  const clients = useSelector(selectClients); // Access clients from Redux store

  const handleButtonClick = () => {
    dispatch(loggedInAction());
  };

  return (
    <View>
      <Text>Test Screen</Text>
      <Text>This is a test screen.</Text>
      <Text
        onPress={handleButtonClick}
        style={{ color: "blue", marginTop: 20 }}
      >
        Click me to dispatch loggedInAction (gets clients)
      </Text>
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
