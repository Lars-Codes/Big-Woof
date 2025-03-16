import React from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { appointments } from "../../data";
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "../../styles/theme";
import Card from "../ui/Card";

const HomeScreen = () => {
  // Mock data for weekly earnings
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [150, 220, 180, 250, 300, 280, 200],
        color: (opacity = 1) => `rgba(${hexToRgb(COLORS.primary)}, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const screenWidth = Dimensions.get("window").width - 40;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to Big Woof!</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Today's Summary */}
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Text style={styles.cardLabel}>Today's Appointments</Text>
            <Text style={styles.cardValue}>2</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.cardLabel}>Expected Revenue</Text>
            <Text style={styles.cardValue}>$150</Text>
          </Card>
        </View>

        {/* Weekly Earnings Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly Earnings</Text>
          <LineChart
            data={weeklyData}
            width={screenWidth - 32} // Account for padding
            height={180}
            chartConfig={{
              backgroundColor: COLORS.background,
              backgroundGradientFrom: COLORS.background,
              backgroundGradientTo: COLORS.background,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(${hexToRgb(COLORS.secondary)}, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(${hexToRgb(COLORS.primary)}, ${opacity})`,
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: COLORS.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card>

        {/* Upcoming Appointments */}
        <View style={styles.appointmentsSection}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {appointments.map((appointment) => (
            <Card key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentDate}>
                  {appointment.date} • {appointment.time}
                </Text>
                <Text style={styles.appointmentService}>{appointment.service}</Text>
              </View>
              <Text style={styles.appointmentClient}>
                {appointment.clientName} • {appointment.petName}
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Helper function to convert hex to rgb for chart colors
const hexToRgb = (hex: string) => {
  // Remove the hash if it exists
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    padding: SPACING.md,
    paddingTop: SPACING.lg + 80,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.secondary,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
  },
  cardLabel: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold as any,
    marginBottom: SPACING.xs,
  },
  cardValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  chartCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  chartTitle: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold as any,
    marginBottom: SPACING.sm,
  },
  chart: {
    marginVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  appointmentsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  appointmentCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  appointmentDate: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  appointmentService: {
    color: COLORS.secondary,
  },
  appointmentClient: {
    color: COLORS.primary,
  },
});

export default HomeScreen;