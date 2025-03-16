import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
} from "lucide-react-native";
import { Service } from "../../data";
import { useServices } from "../../data";
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import Card from "../ui/Card";
import ScreenHeader from "../ui/ScreenHeader";
import AddButton from "../ui/AddButton";

type ServicesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Services'>;

const ServicesScreen = () => {
  const navigation = useNavigation<ServicesScreenNavigationProp>();
  const [services, setServices] = useServices();

  // Toggle service active status
  const toggleServiceStatus = (id: string) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service
      )
    );
  };

  // Delete service
  const handleDeleteService = (id: string) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setServices(services.filter((service) => service.id !== id));
          },
        },
      ]
    );
  };

  // Navigate to edit service screen
  const handleEditService = (service: Service) => {
    navigation.navigate('AddService', { service });
  };

  // Render each service item
  const renderServiceItem = (item: Service) => (
    <Card key={item.id} style={{ ...styles.serviceCard, ...(item.active ? {} : styles.inactiveService) }}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.serviceDescription}>{item.description}</Text>

          <View style={styles.durationContainer}>
            <Clock color={COLORS.secondary} size={16} />
            <Text style={styles.durationText}>{item.duration} min</Text>
          </View>

          <View style={styles.pricesContainer}>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>Small: ${item.prices.Small}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>Medium: ${item.prices.Medium}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>Large: ${item.prices.Large}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditService(item)}
          >
            <Edit2 color={COLORS.primary} size={16} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteService(item.id)}
          >
            <Trash2 color={COLORS.red} size={16} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.serviceFooter}>
        <Text style={styles.statusText}>
          {item.active ? "Active" : "Inactive"}
        </Text>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { backgroundColor: item.active ? COLORS.primary : COLORS.secondary }
          ]}
          onPress={() => toggleServiceStatus(item.id)}
        >
          <Text style={styles.toggleButtonText}>
            {item.active ? "Deactivate" : "Activate"}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader>
        <Text style={styles.title}>Services</Text>
        <Text style={styles.subtitle}>
          Manage your grooming services and pricing
        </Text>
      </ScreenHeader>

      {/* Services List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {services.length > 0 ? (
          services.map(renderServiceItem)
        ) : (
          <Text style={styles.emptyText}>
            No services found. Add your first service to get started.
          </Text>
        )}
      </ScrollView>

      {/* Add Service Button */}
      {/* <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddService', {})}
      >
        <Plus color={COLORS.white} size={24} />
      </TouchableOpacity> */}
      <AddButton navigation={navigation} location="AddService" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    marginBottom: SPACING.md,
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
  scrollContainer: {
    padding: SPACING.md,
  },
  serviceCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  inactiveService: {
    opacity: 0.6,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    fontSize: FONTS.sizes.lg,
  },
  serviceDescription: {
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  durationText: {
    marginLeft: SPACING.sm,
    color: COLORS.secondary,
  },
  pricesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.sm,
  },
  priceTag: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  priceText: {
    color: COLORS.primary,
  },
  actionsContainer: {
    flexDirection: "row",
  },
  actionButton: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.round,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SPACING.xs,
  },
  serviceFooter: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: {
    color: COLORS.secondary,
  },
  toggleButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.md,
  },
  toggleButtonText: {
    color: COLORS.white,
  },
  emptyText: {
    color: COLORS.secondary,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: SPACING.md,
  },
});

export default ServicesScreen;