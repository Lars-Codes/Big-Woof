// screens/client/AddClientScreen.tsx
import React, { useState } from "react";
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
import { ChevronLeft, Check } from "lucide-react-native";
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "../../../styles/theme";
import { ScreenProps } from "../../../types/navigation";
import { createClient } from "../../../services/clientService";
import {
  ClientForm,
  ClientFormData,
  validateEmail,
  validatePhone,
  formatPhoneNumber,
  transformClientDataForApi,
} from "../../forms/ClientForm";

const AddClientScreen = ({ navigation }: ScreenProps<"AddClient">) => {
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

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({
    email: null,
    secondaryEmail: null,
    phone: null,
    secondaryPhone: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle text input changes
  const handleChange = (field: keyof ClientFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });

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
    setFormData({
      ...formData,
      [field]: !formData[field],
    });
  };

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

  const handleSubmit = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform the data for the API
      const clientData = transformClientDataForApi(formData);

      const response = await createClient(clientData);

      if (response && response.success) {
        // Client was successfully added
        const newClientId = response.client.id.toString();

        Alert.alert(
          "Client Added",
          "Would you like to add a pet for this client?",
          [
            {
              text: "Add Pet",
              onPress: () => {
                // Navigate to add pet screen with the new client ID
                navigation.navigate("AddPet", { clientId: newClientId });
              },
            },
            {
              text: "Later",
              onPress: () => navigation.goBack(),
              style: "cancel",
            },
          ]
        );
      } else {
        // Handle unexpected response format
        Alert.alert("Error", "Failed to add client. Please try again.");
      }
    } catch (error) {
      console.error("Error adding client:", error);
      Alert.alert("Error", "Failed to add client. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft color={COLORS.primary} size={24} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Client</Text>
            <TouchableOpacity
              style={[
                styles.saveButton,
                isSubmitting && styles.saveButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Check color={COLORS.white} size={18} />
              )}
            </TouchableOpacity>
          </View>

          <ClientForm
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            handlePhoneChange={handlePhoneChange}
            handleToggle={handleToggle}
            handleSubmit={handleSubmit}
            submitLabel="Add Client"
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
    marginLeft: SPACING.xs,
    color: COLORS.primary,
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
  saveButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
});

export default AddClientScreen;
