import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { appointments } from "../../data";

const HomeScreen = () => {
  // Mock data for weekly earnings
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [150, 220, 180, 250, 300, 280, 200],
        color: (opacity = 1) => `rgba(80, 61, 66, ${opacity})`, // #503D42 with opacity
        strokeWidth: 2,
      },
    ],
  };

  const screenWidth = Dimensions.get("window").width - 40;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#503D42",
            marginBottom: 8,
          }}
        >
          Dashboard
        </Text>
        <Text style={{ color: "#748B75" }}>Welcome to Big Woof!</Text>
      </View>

      {/* Today's Summary */}
      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#F5FBEF",
            borderRadius: 8,
            padding: 16,
            marginRight: 8,
          }}
        >
          <Text
            style={{ color: "#503D42", fontWeight: "600", marginBottom: 4 }}
          >
            Today's Appointments
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#503D42" }}>
            2
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "#F5FBEF",
            borderRadius: 8,
            padding: 16,
            marginLeft: 8,
          }}
        >
          <Text
            style={{ color: "#503D42", fontWeight: "600", marginBottom: 4 }}
          >
            Expected Revenue
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#503D42" }}>
            $150
          </Text>
        </View>
      </View>

      {/* Weekly Earnings Chart */}
      <View
        style={{
          backgroundColor: "#F5FBEF",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <Text style={{ color: "#503D42", fontWeight: "600", marginBottom: 8 }}>
          Weekly Earnings
        </Text>
        <LineChart
          data={weeklyData}
          width={screenWidth - 32} // Account for padding
          height={180}
          chartConfig={{
            backgroundColor: "#F5FBEF",
            backgroundGradientFrom: "#F5FBEF",
            backgroundGradientTo: "#F5FBEF",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(116, 139, 117, ${opacity})`, // #748B75 with opacity
            labelColor: (opacity = 1) => `rgba(80, 61, 66, ${opacity})`, // #503D42 with opacity
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#503D42",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      {/* Upcoming Appointments */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#503D42",
            marginBottom: 16,
          }}
        >
          Upcoming Appointments
        </Text>
        {appointments.map((appointment) => (
          <View
            key={appointment.id}
            style={{
              backgroundColor: "#F5FBEF",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#503D42" }}>
                {appointment.date} • {appointment.time}
              </Text>
              <Text style={{ color: "#748B75" }}>{appointment.service}</Text>
            </View>
            <Text style={{ color: "#503D42" }}>
              {appointment.clientName} • {appointment.petName}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
