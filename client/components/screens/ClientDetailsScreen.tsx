import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import {
  Mail,
  Phone,
  MapPin,
  Edit2,
  Plus,
  Calendar,
  Clock,
  DollarSign,
} from "lucide-react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../../styles/theme";
import Card from "../ui/Card";
import { Client, clients } from "../../data";

type ClientDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "ClientDetails"
>;
type ClientDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ClientDetails"
>;

type ClientDetailsScreenProps = {
  route: ClientDetailsScreenRouteProp;
  navigation: ClientDetailsScreenNavigationProp;
};

const ClientDetailsScreen = ({
  route,
  navigation,
}: ClientDetailsScreenProps) => {
  const clientId = route?.params?.id || "1";
  const [client, setClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("info"); // 'info', 'pets', 'appointments', 'billing'

  useEffect(() => {
    // Fetch client data based on clientId
    const fetchClientData = async () => {
      const client = clients.find((c) => c.id === clientId) || null;
      setClient(client);
    };

    fetchClientData();
  }, [clientId]);

  if (!client) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Client Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.clientName}>{client.name}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Edit2 color={COLORS.primary} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.contactItem}>
          <Mail color={COLORS.secondary} size={16} />
          <Text style={styles.contactText}>{client.email}</Text>
        </View>

        <View style={styles.contactItem}>
          <Phone color={COLORS.secondary} size={16} />
          <Text style={styles.contactText}>{client.phone}</Text>
        </View>

        <View style={styles.contactItem}>
          <MapPin color={COLORS.secondary} size={16} />
          <Text style={styles.contactText}>{client.address}</Text>
        </View>
      </View>

      {/* Tabs Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "info" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("info")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "info" && styles.activeTabText,
            ]}
          >
            Info
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "pets" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("pets")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pets" && styles.activeTabText,
            ]}
          >
            Pets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "appointments" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("appointments")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "appointments" && styles.activeTabText,
            ]}
          >
            Appointments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "billing" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("billing")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "billing" && styles.activeTabText,
            ]}
          >
            Billing
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {/* Info Tab */}
        {activeTab === "info" && (
          <View>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Payment Method</Text>
              <View style={styles.iconRow}>
                <DollarSign color={COLORS.secondary} size={16} />
                <Text style={styles.iconText}>{client.paymentMethod}</Text>
              </View>
            </Card>

            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Client Statistics</Text>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Appointments</Text>
                <Text style={styles.statValue}>
                  {client.stats.totalAppointments}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>No-Shows</Text>
                <Text style={styles.statValue}>{client.stats.noShows}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Late Appointments</Text>
                <Text style={styles.statValue}>
                  {client.stats.lateAppointments}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Spent</Text>
                <Text style={styles.statValue}>${client.stats.totalSpent}</Text>
              </View>
            </Card>

            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Notes</Text>
              <Text style={styles.noteText}>{client.notes}</Text>
            </Card>
          </View>
        )}

        {/* Pets Tab */}
        {activeTab === "pets" && (
          <View>
            {client.pets.map((pet) => (
              <Card key={pet.id} style={styles.card}>
                <TouchableOpacity
                  style={styles.petCard}
                  onPress={() => {
                    // Navigate to pet details
                    // navigation.navigate('PetDetails', { clientId: client.id, petId: pet.id });
                  }}
                >
                  {pet.image ? (
                    <Image
                      source={{ uri: pet.image }}
                      style={styles.petImage}
                    />
                  ) : (
                    <View style={styles.petImagePlaceholder}>
                      <Text style={styles.petImagePlaceholderText}>
                        {pet.name.charAt(0)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.petInfo}>
                    <View style={styles.petNameRow}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      {pet.vaccinated && (
                        <View style={styles.vaccinatedBadge}>
                          <Text style={styles.vaccinatedText}>Vaccinated</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.petDetails}>
                      {pet.breed} • {pet.size} • {pet.age} years old
                    </Text>
                    <Text style={styles.petVisit}>
                      Last visit: {pet.lastVisit}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Card>
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                // Navigate to add pet screen
                navigation.navigate("AddPet", { clientId: client.id });
              }}
            >
              <Plus color={COLORS.primary} size={18} />
              <Text style={styles.addButtonText}>Add New Pet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <Card style={styles.card}>
              <TouchableOpacity style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentTitle}>
                    Mar 16, 2025 • 10:00 AM
                  </Text>
                  <Text style={styles.appointmentConfirmed}>Confirmed</Text>
                </View>
                <Text style={styles.appointmentDetails}>Max • Full Groom</Text>
                <View style={styles.appointmentFooter}>
                  <View style={styles.appointmentMetric}>
                    <Clock color={COLORS.secondary} size={14} />
                    <Text style={styles.appointmentMetricText}>90 min</Text>
                  </View>
                  <Text style={styles.appointmentDivider}>•</Text>
                  <View style={styles.appointmentMetric}>
                    <DollarSign color={COLORS.secondary} size={14} />
                    <Text style={styles.appointmentMetricText}>$85</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>

            <View style={[styles.sectionHeader, styles.pastAppointmentsHeader]}>
              <Text style={styles.sectionTitle}>Past Appointments</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <Card style={styles.card}>
              <TouchableOpacity style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentTitle}>
                    Feb 28, 2025 • 11:30 AM
                  </Text>
                  <Text style={styles.appointmentCompleted}>Completed</Text>
                </View>
                <Text style={styles.appointmentDetails}>
                  Max • Full Groom + Nail Trim
                </Text>
                <View style={styles.appointmentFooter}>
                  <View style={styles.appointmentMetric}>
                    <Clock color={COLORS.secondary} size={14} />
                    <Text style={styles.appointmentMetricText}>105 min</Text>
                  </View>
                  <Text style={styles.appointmentDivider}>•</Text>
                  <View style={styles.appointmentMetric}>
                    <DollarSign color={COLORS.secondary} size={14} />
                    <Text style={styles.appointmentMetricText}>$100</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>

            <TouchableOpacity
              style={[styles.addButton, styles.scheduleButton]}
              onPress={() => {
                // Navigate to add appointment screen
                navigation.navigate("AddAppointment", { clientId: client.id });
              }}
            >
              <Calendar color={COLORS.primary} size={18} />
              <Text style={styles.addButtonText}>Schedule New Appointment</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <View>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Payment Method</Text>
              <View style={styles.paymentMethodRow}>
                <Text style={styles.paymentMethodLabel}>Current Method</Text>
                <Text style={styles.paymentMethodValue}>
                  {client.paymentMethod}
                </Text>
              </View>
              <TouchableOpacity style={styles.updateButton}>
                <Text style={styles.updateButtonText}>
                  Update Payment Method
                </Text>
              </TouchableOpacity>
            </Card>

            <View style={styles.billingHistory}>
              <Text style={[styles.cardTitle, styles.billingHistoryTitle]}>
                Billing History
              </Text>

              <Card style={styles.card}>
                <View style={styles.billingItem}>
                  <View style={styles.billingHeader}>
                    <Text style={styles.billingDate}>Feb 28, 2025</Text>
                    <Text style={styles.billingAmount}>$100</Text>
                  </View>
                  <Text style={styles.billingService}>
                    Full Groom + Nail Trim (Max)
                  </Text>
                  <View style={styles.billingStatus}>
                    <View style={styles.paidBadge}>
                      <Text style={styles.paidText}>Paid</Text>
                    </View>
                    <Text style={styles.paymentMethod}>Credit Card</Text>
                  </View>
                </View>
              </Card>

              <Card style={styles.card}>
                <View style={styles.billingItem}>
                  <View style={styles.billingHeader}>
                    <Text style={styles.billingDate}>Jan 10, 2025</Text>
                    <Text style={styles.billingAmount}>$45</Text>
                  </View>
                  <Text style={styles.billingService}>Bath & Brush (Max)</Text>
                  <View style={styles.billingStatus}>
                    <View style={styles.paidBadge}>
                      <Text style={styles.paidText}>Paid</Text>
                    </View>
                    <Text style={styles.paymentMethod}>Cash</Text>
                  </View>
                </View>
              </Card>
            </View>

            <TouchableOpacity
              style={[styles.addButton, styles.requestButton]}
              onPress={() => {
                // Send payment request
                // navigation.navigate('SendPaymentRequest', { clientId: client.id });
              }}
            >
              <DollarSign color={COLORS.primary} size={18} />
              <Text style={styles.addButtonText}>Send Payment Request</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  clientName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  editButton: {
    padding: SPACING.xs,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  contactText: {
    marginLeft: SPACING.sm,
    color: COLORS.primary,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  tabButton: {
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.secondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold as any,
  },
  tabContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.background,
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    marginLeft: SPACING.sm,
    color: COLORS.primary,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  statLabel: {
    color: COLORS.secondary,
  },
  statValue: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium as any,
  },
  noteText: {
    color: COLORS.primary,
  },
  petCard: {
    flexDirection: "row",
  },
  petImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: SPACING.md,
  },
  petImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondary,
    marginRight: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },
  petImagePlaceholderText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
  },
  petInfo: {
    flex: 1,
  },
  petNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  petName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  vaccinatedBadge: {
    backgroundColor: "#E6F7E9",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.round,
  },
  vaccinatedText: {
    color: "#388E3C",
    fontSize: FONTS.sizes.xs,
  },
  petDetails: {
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  petVisit: {
    color: COLORS.secondary,
  },
  addButton: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    marginLeft: SPACING.sm,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium as any,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  seeAllText: {
    color: COLORS.primary,
  },
  pastAppointmentsHeader: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  appointmentCard: {
    padding: SPACING.xs,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  appointmentTitle: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  appointmentConfirmed: {
    color: COLORS.success,
  },
  appointmentCompleted: {
    color: COLORS.primary,
  },
  appointmentDetails: {
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  appointmentFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  appointmentMetric: {
    flexDirection: "row",
    alignItems: "center",
  },
  appointmentMetricText: {
    marginLeft: SPACING.xs / 2,
    color: COLORS.secondary,
  },
  appointmentDivider: {
    marginHorizontal: SPACING.sm,
    color: COLORS.secondary,
  },
  scheduleButton: {
    marginTop: SPACING.md,
  },
  paymentMethodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  paymentMethodLabel: {
    color: COLORS.secondary,
  },
  paymentMethodValue: {
    color: COLORS.primary,
  },
  updateButton: {
    marginTop: SPACING.xs,
  },
  updateButtonText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium as any,
  },
  billingHistory: {
    marginBottom: SPACING.md,
  },
  billingHistoryTitle: {
    marginBottom: SPACING.sm,
  },
  billingItem: {
    padding: SPACING.xs,
  },
  billingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
  },
  billingDate: {
    fontWeight: FONTS.weights.medium as any,
    color: COLORS.primary,
  },
  billingAmount: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  billingService: {
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  billingStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  paidBadge: {
    backgroundColor: "#E6F7E9",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.round,
  },
  paidText: {
    color: "#388E3C",
    fontSize: FONTS.sizes.xs,
  },
  paymentMethod: {
    color: COLORS.secondary,
    marginLeft: SPACING.sm,
  },
  requestButton: {
    marginTop: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ClientDetailsScreen;
