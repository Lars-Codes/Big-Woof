import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Plus } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../../styles/theme";
import Card from "../ui/Card";
import { appointments } from "../../data";
import ScreenHeader from "../ui/ScreenHeader";
import AddButton from "../ui/AddButton";

type AppointmentsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Appointments"
>;

const AppointmentsScreen = ({ navigation }: AppointmentsScreenProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [view, setView] = useState("calendar"); // 'calendar' or 'list'

  // Filter appointments for the selected date
  const filteredAppointments = selectedDate
    ? appointments.filter((appt) => appt.date === selectedDate)
    : appointments;

  // Create marked dates object for the calendar
  const markedDates = {} as { [key: string]: any };
  appointments.forEach((appt) => {
    markedDates[appt.date] = { marked: true, dotColor: COLORS.primary };
  });

  // If a date is selected, highlight it
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: COLORS.primary,
    };
  }

  const renderAppointmentItem = ({ item }: { item: any }) => (
    <Card style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentTime}>{item.time}</Text>
        <Text
          style={[
            styles.appointmentStatus,
            {
              color:
                item.status === "confirmed" ? COLORS.success : COLORS.warning,
            },
          ]}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
      <Text style={styles.appointmentClient}>
        {item.clientName} • {item.petName}
      </Text>
      <View style={styles.appointmentFooter}>
        <Text style={styles.appointmentService}>{item.service}</Text>
        <Text style={styles.appointmentDuration}>{item.duration} min</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header with view toggle */}
      <ScreenHeader style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              view === "calendar" && styles.toggleButtonActive,
            ]}
            onPress={() => setView("calendar")}
          >
            <Text
              style={[
                styles.toggleText,
                view === "calendar" && styles.toggleTextActive,
              ]}
            >
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              view === "list" && styles.toggleButtonActive,
            ]}
            onPress={() => setView("list")}
          >
            <Text
              style={[
                styles.toggleText,
                view === "list" && styles.toggleTextActive,
              ]}
            >
              List
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenHeader>

      <ScrollView style={styles.scrollContainer}>
        {view === "calendar" ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Calendar View */}
            <Calendar
              markedDates={markedDates}
              onDayPress={(day: any) => setSelectedDate(day.dateString)}
              theme={{
                calendarBackground: COLORS.white,
                textSectionTitleColor: COLORS.primary,
                selectedDayBackgroundColor: COLORS.primary,
                selectedDayTextColor: COLORS.white,
                todayTextColor: COLORS.primary,
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
                dotColor: COLORS.primary,
                selectedDotColor: COLORS.white,
                arrowColor: COLORS.primary,
                monthTextColor: COLORS.primary,
                indicatorColor: COLORS.primary,
              }}
            />

            {/* Appointments for selected date */}
            <View style={styles.appointmentListHeader}>
              <Text style={styles.appointmentListTitle}>
                {selectedDate
                  ? `Appointments for ${selectedDate}`
                  : "All Upcoming Appointments"}
              </Text>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((item) => (
                  <View key={item.id}>{renderAppointmentItem({ item })}</View>
                ))
              ) : (
                <Text style={styles.emptyText}>No appointments found.</Text>
              )}
            </View>
          </ScrollView>
        ) : (
          /* List View */
          <FlatList
            data={appointments}
            renderItem={renderAppointmentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No appointments found.</Text>
            }
          />
        )}
      </ScrollView>

      {/* Add Appointment Button */}
      <AddButton navigation={navigation} location="AddAppointment" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
  },
  toggleButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    color: COLORS.primary,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  scrollContainer: {
    padding: SPACING.md,
  },
  appointmentListHeader: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xxl + 50,
  },
  appointmentListTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold as any,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  appointmentCard: {
    backgroundColor: COLORS.background,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  appointmentTime: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  appointmentStatus: {
    fontWeight: FONTS.weights.medium as any,
  },
  appointmentClient: {
    fontWeight: FONTS.weights.medium as any,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  appointmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.sm,
  },
  appointmentService: {
    color: COLORS.secondary,
  },
  appointmentDuration: {
    color: COLORS.secondary,
  },
  emptyText: {
    color: COLORS.secondary,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: SPACING.md,
  },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.lg,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.medium,
  },
});

export default AppointmentsScreen;
