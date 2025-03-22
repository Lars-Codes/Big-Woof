// screens/client/EditClientScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types/navigation";
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "../../../styles/theme";
import { ArrowLeft, Save } from "lucide-react-native";
import { useClientDetails } from "../../../hooks/useClientDetails";
import { updateClient } from "../../../services/clientService";
import ScreenHeader from "../../ui/ScreenHeader";
import {
  ClientForm,
  ClientFormData,
  validateEmail,
  validatePhone,
  formatPhoneNumber,
  parseAddress,
  transformClientDataForApi,
} from "./ClientForm";

// Define the types for navigation and route props
type EditClientRouteProp = RouteProp<RootStackParamList, "EditClient">;
type EditClientNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditClient"
>;

const EditClientScreen: React.FC = () => {
  const navigation = useNavigation<EditClientNavigationProp>();
  const route = useRoute<EditClientRouteProp>();
  const { id } = route.params;

  const { client, loading, error, refreshClient } = useClientDetails(id);
  const [isSaving, setIsSaving] = useState(false);

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({
    email: null,
    secondaryEmail: null,
    phone: null,
    secondaryPhone: null,
  });

  // Form state
  const [formData, setFormData] = useState<ClientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    aptSuite: "",
    city: "",
    state: "",
    zipCode: "",
    secondaryEmail: "",
    secondaryPhone: "",
    notes: "",
    enableReminders: true,
    paymentMethod: "credit_card",
  });

  // Load client data into form when available
  useEffect(() => {
    if (client) {
      // Parse the address into components
      const addressParts = parseAddress(client.address || "");
      const enableReminders = !client.disableEmails;

      // Extract payment method (use first one if available)
      const paymentMethod =
        client.paymentTypes && client.paymentTypes.length > 0
          ? client.paymentTypes[0]
          : "credit_card";

      setFormData({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email || "",
        phone: formatPhoneNumber(client.phone || ""),
        address: addressParts.address,
        aptSuite: addressParts.aptSuite,
        city: addressParts.city,
        state: addressParts.state,
        zipCode: addressParts.zipCode,
        secondaryEmail: client.secondaryEmail || "",
        secondaryPhone: formatPhoneNumber(client.secondaryPhone || ""),
        notes: client.notes || "",
        enableReminders,
        paymentMethod,
      });
    }
  }, [client]);

  // Handle text input changes
  const handleChange = (field: keyof ClientFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate as user types
    if (field === "email" || field === "secondaryEmail") {
      validateEmailField(field, value);
    } else if (field === "phone" || field === "secondaryPhone") {
      validatePhoneField(field, value);
    }
  };

  // Email validation
  const validateEmailField = (field: string, value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [field]: null }));
      return true;
    }

    const isValid = validateEmail(value);
    setErrors((prev) => ({
      ...prev,
      [field]: isValid ? null : "Please enter a valid email address",
    }));

    return isValid;
  };

  // Phone validation
  const validatePhoneField = (field: string, value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [field]: null }));
      return true;
    }

    const isValid = validatePhone(value);
    setErrors((prev) => ({
      ...prev,
      [field]: isValid ? null : "Please enter a valid phone number",
    }));

    return isValid;
  };

  // Handle phone input changes with formatting
  const handlePhoneChange = (
    field: "phone" | "secondaryPhone",
    value: string
  ) => {
    const formattedPhone = formatPhoneNumber(value);
    handleChange(field, formattedPhone);
  };

  // Handle toggle switch changes
  const handleToggle = (field: keyof ClientFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;

    // Validate required fields
    if (!formData.firstName.trim()) {
      Alert.alert("Missing Information", "First name is required");
      return false;
    }

    if (!formData.lastName.trim()) {
      Alert.alert("Missing Information", "Last name is required");
      return false;
    }

    if (!formData.phone.trim()) {
      Alert.alert("Missing Information", "Phone number is required");
      return false;
    }

    // Validate email if provided
    if (formData.email && !validateEmailField("email", formData.email)) {
      isValid = false;
    }

    // Validate secondary email if provided
    if (
      formData.secondaryEmail &&
      !validateEmailField("secondaryEmail", formData.secondaryEmail)
    ) {
      isValid = false;
    }

    // Validate phone
    if (!validatePhoneField("phone", formData.phone)) {
      isValid = false;
    }

    // Validate secondary phone if provided
    if (
      formData.secondaryPhone &&
      !validatePhoneField("secondaryPhone", formData.secondaryPhone)
    ) {
      isValid = false;
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Transform the data for the API
      const clientData = transformClientDataForApi(formData);

      const response = await updateClient(id, clientData);

      if (response && response.success) {
        Alert.alert("Success", "Client information updated successfully.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Error",
          "Failed to update client information. Please try again."
        );
      }
    } catch (error) {
      console.error("Error updating client:", error);
      Alert.alert(
        "Error",
        "Failed to update client information. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !client) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading client information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshClient}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <ScreenHeader>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <ArrowLeft color={COLORS.primary} size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Client</Text>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isSaving && styles.saveButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <>
                    <Save color={COLORS.white} size={16} />
                    <Text style={styles.saveButtonText}>Save</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScreenHeader>

          <ClientForm
            formData={formData}
            errors={errors}
            isSubmitting={isSaving}
            handleChange={handleChange}
            handlePhoneChange={handlePhoneChange}
            handleToggle={handleToggle}
            handleSubmit={handleSubmit}
            submitLabel="Update Client"
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  innerContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  backButton: {
    padding: SPACING.sm,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.7,
    backgroundColor: COLORS.gray,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.medium as any,
    marginLeft: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.medium as any,
  },
});

export default EditClientScreen;
