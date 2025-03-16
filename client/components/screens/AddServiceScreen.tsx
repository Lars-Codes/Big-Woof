import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import {
  ChevronLeft,
  Check,
  DollarSign,
  Clock,
} from "lucide-react-native";
import { Service } from "../../data";
import { useServices } from "../../data";
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "../../styles/theme";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import Card from "../ui/Card";

type AddServiceScreenRouteProp = RouteProp<RootStackParamList, 'AddService'>;
type AddServiceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddService'>;

type AddServiceScreenProps = {
  route: AddServiceScreenRouteProp;
  navigation: AddServiceScreenNavigationProp;
};

const AddServiceScreen = ({ route, navigation }: AddServiceScreenProps) => {
  const [services, setServices] = useServices();
  const editingService = route.params?.service;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prices: {
      Small: "",
      Medium: "",
      Large: "",
    },
    duration: "",
    active: true,
  });

  // Initialize form if editing
  useEffect(() => {
    if (editingService) {
      setFormData({
        name: editingService.name,
        description: editingService.description,
        prices: {
          Small: String(editingService.prices.Small),
          Medium: String(editingService.prices.Medium),
          Large: String(editingService.prices.Large),
        },
        duration: String(editingService.duration),
        active: editingService.active,
      });
    }
  }, [editingService]);

  // Handle text input changes
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle price changes
  const handlePriceChange = (size: string, value: string) => {
    setFormData({
      ...formData,
      prices: {
        ...formData.prices,
        [size]: value,
      },
    });
  };

  // Save service (create or update)
  const handleSave = () => {
    // Validate form
    if (!formData.name) {
      Alert.alert("Missing Information", "Please enter a service name");
      return;
    }

    if (
      !formData.prices.Small ||
      !formData.prices.Medium ||
      !formData.prices.Large
    ) {
      Alert.alert(
        "Missing Information",
        "Please enter prices for all pet sizes"
      );
      return;
    }

    if (!formData.duration) {
      Alert.alert("Missing Information", "Please enter a service duration");
      return;
    }

    // Convert string values to numbers
    const processedFormData = {
      ...formData,
      prices: {
        Small: parseFloat(formData.prices.Small),
        Medium: parseFloat(formData.prices.Medium),
        Large: parseFloat(formData.prices.Large),
      },
      duration: parseInt(formData.duration),
    };

    if (editingService) {
      // Update existing service
      setServices(
        services.map((service) =>
          service.id === editingService.id
            ? { ...service, ...processedFormData }
            : service
        )
      );
    } else {
      // Create new service
      const newService = {
        id: String(Date.now()), // Simple way to generate unique ID
        ...processedFormData,
      };
      setServices([...services, newService]);
    }

    // Navigate back
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color={COLORS.primary} size={24} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editingService ? "Edit Service" : "Add Service"}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Check color={COLORS.white} size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.formSection}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Service Name</Text>
            <TextInput
              style={styles.textInput}
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
              placeholder="Enter service name"
              placeholderTextColor={COLORS.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={formData.description}
              onChangeText={(text) => handleChange("description", text)}
              placeholder="Describe the service..."
              placeholderTextColor={COLORS.secondary}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Duration (minutes)</Text>
            <View style={styles.iconInput}>
              <Clock color={COLORS.secondary} size={16} />
              <TextInput
                style={styles.iconTextInput}
                value={formData.duration}
                onChangeText={(text) => handleChange("duration", text)}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={COLORS.secondary}
              />
            </View>
          </View>
        </Card>

        <Card style={styles.formSection}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <Text style={styles.sectionSubtitle}>Set prices based on pet size</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Small Pets</Text>
            <View style={styles.iconInput}>
              <DollarSign color={COLORS.secondary} size={16} />
              <TextInput
                style={styles.iconTextInput}
                value={formData.prices.Small}
                onChangeText={(text) => handlePriceChange("Small", text)}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={COLORS.secondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Medium Pets</Text>
            <View style={styles.iconInput}>
              <DollarSign color={COLORS.secondary} size={16} />
              <TextInput
                style={styles.iconTextInput}
                value={formData.prices.Medium}
                onChangeText={(text) => handlePriceChange("Medium", text)}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={COLORS.secondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Large Pets</Text>
            <View style={styles.iconInput}>
              <DollarSign color={COLORS.secondary} size={16} />
              <TextInput
                style={styles.iconTextInput}
                value={formData.prices.Large}
                onChangeText={(text) => handlePriceChange("Large", text)}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={COLORS.secondary}
              />
            </View>
          </View>
        </Card>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
          <Text style={styles.primaryButtonText}>
            {editingService ? "Update Service" : "Add Service"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: COLORS.primary,
    marginLeft: SPACING.xs,
    fontWeight: FONTS.weights.medium as any,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  formSection: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    color: COLORS.secondary,
    marginBottom: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    color: COLORS.primary,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  iconInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  iconTextInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    color: COLORS.primary,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    marginVertical: SPACING.md,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold as any,
  },
});

export default AddServiceScreen;