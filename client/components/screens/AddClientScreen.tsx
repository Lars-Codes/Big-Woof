import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  FlatList,
} from "react-native";
import {
  ChevronLeft,
  Check,
  ChevronDown,
  X,
  Search,
} from "lucide-react-native";
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "../../styles/theme";
import { ScreenProps } from "../../types/navigation";
import Card from "../ui/Card";
import { addClient } from "@/services/clientService";

// US States array for dropdown
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

const AddClientScreen = ({ navigation }: ScreenProps<"AddClient">) => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    aptSuite: "", // Added apartment/suite field
    city: "",
    state: "",
    zipCode: "",
    notes: "",
    enableReminders: true,
    paymentMethod: "credit_card",
    secondaryEmail: "",
    secondaryPhone: "",
    disableEmails: false,
  });

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({
    email: null,
    secondaryEmail: null,
    phone: null,
    secondaryPhone: null,
  });

  // State for the state selection dropdown
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [stateSearch, setStateSearch] = useState("");

  // Input refs for keyboard navigation
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const secondaryEmailRef = useRef<TextInput>(null);
  const secondaryPhoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const aptSuiteRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const zipCodeRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  // Handle text input changes
  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Validate as user types
    if (field === "email" || field === "secondaryEmail") {
      validateEmail(field, value);
    } else if (field === "phone" || field === "secondaryPhone") {
      validatePhone(field, value);
    }
  };

  // Email validation
  const validateEmail = (field: string, value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [field]: null }));
      return true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);

    setErrors((prev) => ({
      ...prev,
      [field]: isValid ? null : "Please enter a valid email address",
    }));

    return isValid;
  };

  // Phone validation
  const validatePhone = (field: string, value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [field]: null }));
      return true;
    }

    // Remove all non-digits for validation
    const digits = value.replace(/\D/g, "");
    const isValid = digits.length >= 10;

    setErrors((prev) => ({
      ...prev,
      [field]: isValid ? null : "Please enter a valid phone number",
    }));

    return isValid;
  };

  // Handle toggle switch changes
  const handleToggle = (field: keyof typeof formData) => {
    setFormData({
      ...formData,
      [field]: !formData[field as keyof typeof formData],
    });
  };

  // Format phone number as user types
  const formatPhoneNumber = (phone: string) => {
    // Strip all non-digit characters
    const digits = phone.replace(/\D/g, "");

    // Format the number
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`;
    }
  };

  // Handle phone input changes with formatting
  const handlePhoneChange = (
    field: "phone" | "secondaryPhone",
    value: string
  ) => {
    const formattedPhone = formatPhoneNumber(value);
    handleChange(field, formattedPhone);
  };

  // Select a state from the dropdown
  const selectState = (stateCode: string, stateName: string) => {
    handleChange("state", stateCode);
    setStateModalVisible(false);
  };

  // Filtered states for search
  const filteredStates = stateSearch
    ? US_STATES.filter(
        (state) =>
          state.label.toLowerCase().includes(stateSearch.toLowerCase()) ||
          state.value.toLowerCase().includes(stateSearch.toLowerCase())
      )
    : US_STATES;

  // Save client
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

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
    if (formData.email && !validateEmail("email", formData.email)) {
      isValid = false;
    }

    // Validate secondary email if provided
    if (
      formData.secondaryEmail &&
      !validateEmail("secondaryEmail", formData.secondaryEmail)
    ) {
      isValid = false;
    }

    // Validate phone
    if (!validatePhone("phone", formData.phone)) {
      isValid = false;
    }

    // Validate secondary phone if provided
    if (
      formData.secondaryPhone &&
      !validatePhone("secondaryPhone", formData.secondaryPhone)
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
      // Build the full address from components
      const addressComponents = [
        formData.address,
        formData.aptSuite && `Apt/Suite ${formData.aptSuite}`,
        formData.city,
        formData.state && formData.zipCode
          ? `${formData.state} ${formData.zipCode}`
          : formData.state || formData.zipCode,
      ].filter(Boolean);

      const fullAddress =
        addressComponents.length > 0 ? addressComponents.join(", ") : null;

      // Transform the data for the API
      const clientData = {
        fname: formData.firstName,
        lname: formData.lastName,
        email: formData.email || null,
        phone_number: formData.phone.replace(/\D/g, "") || null, // Strip formatting for API
        address: fullAddress,
        secondary_email: formData.secondaryEmail || null,
        secondary_phone: formData.secondaryPhone.replace(/\D/g, "") || null, // Strip formatting for API
        notes: formData.notes || null,
        disable_emails: !formData.enableReminders, // Inverse of enableReminders
        payment_types: [formData.paymentMethod], // Send as array of payment types
      };

      const response = await addClient(clientData);

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

  // Render the state selection modal
  const renderStateModal = () => (
    <Modal
      visible={stateModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setStateModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setStateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select State</Text>
                <TouchableOpacity
                  onPress={() => setStateModalVisible(false)}
                  style={styles.closeButton}
                >
                  <X color={COLORS.primary} size={20} />
                </TouchableOpacity>
              </View>

              <View style={styles.searchContainer}>
                <Search color={COLORS.secondary} size={20} />
                <TextInput
                  style={styles.searchInput}
                  value={stateSearch}
                  onChangeText={setStateSearch}
                  placeholder="Search states..."
                  placeholderTextColor={COLORS.secondary}
                  autoFocus
                />
                {stateSearch ? (
                  <TouchableOpacity onPress={() => setStateSearch("")}>
                    <X color={COLORS.secondary} size={16} />
                  </TouchableOpacity>
                ) : null}
              </View>

              <FlatList
                data={filteredStates}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.stateItem}
                    onPress={() => selectState(item.value, item.label)}
                  >
                    <Text style={styles.stateCode}>{item.value}</Text>
                    <Text style={styles.stateName}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={10}
                style={styles.stateList}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

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

          <ScrollView
            style={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Basic Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  First Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(text) => handleChange("firstName", text)}
                  placeholder="Enter first name"
                  placeholderTextColor={COLORS.secondary}
                  returnKeyType="next"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Last Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  ref={lastNameRef}
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(text) => handleChange("lastName", text)}
                  placeholder="Enter last name"
                  placeholderTextColor={COLORS.secondary}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  ref={emailRef}
                  style={[styles.input, errors.email && styles.inputError]}
                  value={formData.email}
                  onChangeText={(text) => handleChange("email", text)}
                  placeholder="Enter email address"
                  placeholderTextColor={COLORS.secondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => phoneRef.current?.focus()}
                  blurOnSubmit={false}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Phone <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  ref={phoneRef}
                  style={[styles.input, errors.phone && styles.inputError]}
                  value={formData.phone}
                  onChangeText={(text) => handlePhoneChange("phone", text)}
                  placeholder="(555) 123-4567"
                  placeholderTextColor={COLORS.secondary}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  onSubmitEditing={() => secondaryEmailRef.current?.focus()}
                  blurOnSubmit={false}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Secondary Email</Text>
                <TextInput
                  ref={secondaryEmailRef}
                  style={[
                    styles.input,
                    errors.secondaryEmail && styles.inputError,
                  ]}
                  value={formData.secondaryEmail}
                  onChangeText={(text) => handleChange("secondaryEmail", text)}
                  placeholder="Enter secondary email (optional)"
                  placeholderTextColor={COLORS.secondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => secondaryPhoneRef.current?.focus()}
                  blurOnSubmit={false}
                />
                {errors.secondaryEmail && (
                  <Text style={styles.errorText}>{errors.secondaryEmail}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Secondary Phone</Text>
                <TextInput
                  ref={secondaryPhoneRef}
                  style={[
                    styles.input,
                    errors.secondaryPhone && styles.inputError,
                  ]}
                  value={formData.secondaryPhone}
                  onChangeText={(text) =>
                    handlePhoneChange("secondaryPhone", text)
                  }
                  placeholder="(555) 123-4567"
                  placeholderTextColor={COLORS.secondary}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  onSubmitEditing={() => addressRef.current?.focus()}
                  blurOnSubmit={false}
                />
                {errors.secondaryPhone && (
                  <Text style={styles.errorText}>{errors.secondaryPhone}</Text>
                )}
              </View>
            </View>

            {/* Address Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Street Address</Text>
                <TextInput
                  ref={addressRef}
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(text) => handleChange("address", text)}
                  placeholder="Enter street address"
                  placeholderTextColor={COLORS.secondary}
                  returnKeyType="next"
                  onSubmitEditing={() => aptSuiteRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Apartment/Suite</Text>
                <TextInput
                  ref={aptSuiteRef}
                  style={styles.input}
                  value={formData.aptSuite}
                  onChangeText={(text) => handleChange("aptSuite", text)}
                  placeholder="Apt, Suite, Unit, etc."
                  placeholderTextColor={COLORS.secondary}
                  returnKeyType="next"
                  onSubmitEditing={() => cityRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  ref={cityRef}
                  style={styles.input}
                  value={formData.city}
                  onChangeText={(text) => handleChange("city", text)}
                  placeholder="Enter city"
                  placeholderTextColor={COLORS.secondary}
                  returnKeyType="next"
                  onSubmitEditing={() => setStateModalVisible(true)}
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.halfColumn}>
                  <Text style={styles.label}>State</Text>
                  <TouchableOpacity
                    style={styles.dropdownInput}
                    onPress={() => setStateModalVisible(true)}
                  >
                    <Text
                      style={
                        formData.state
                          ? styles.dropdownText
                          : styles.placeholderText
                      }
                    >
                      {formData.state || "Select State"}
                    </Text>
                    <ChevronDown size={16} color={COLORS.secondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.halfColumn}>
                  <Text style={styles.label}>ZIP Code</Text>
                  <TextInput
                    ref={zipCodeRef}
                    style={styles.input}
                    value={formData.zipCode}
                    onChangeText={(text) => handleChange("zipCode", text)}
                    placeholder="ZIP"
                    placeholderTextColor={COLORS.secondary}
                    keyboardType="number-pad"
                    maxLength={10}
                    returnKeyType="next"
                    onSubmitEditing={() => notesRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>
              </View>
            </View>

            {/* Preferences Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>

              <Card style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                  Enable Appointment Reminders
                </Text>
                <Switch
                  value={formData.enableReminders}
                  onValueChange={() => handleToggle("enableReminders")}
                  trackColor={{ false: "#E0E0E0", true: COLORS.secondary }}
                  thumbColor={
                    formData.enableReminders ? COLORS.primary : "#f4f3f4"
                  }
                />
              </Card>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Preferred Payment Method</Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      formData.paymentMethod === "credit_card" &&
                        styles.selectedButton,
                    ]}
                    onPress={() => handleChange("paymentMethod", "credit_card")}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        formData.paymentMethod === "credit_card" &&
                          styles.selectedButtonText,
                      ]}
                    >
                      Credit Card
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      formData.paymentMethod === "cash" &&
                        styles.selectedButton,
                    ]}
                    onPress={() => handleChange("paymentMethod", "cash")}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        formData.paymentMethod === "cash" &&
                          styles.selectedButtonText,
                      ]}
                    >
                      Cash
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      formData.paymentMethod === "venmo" &&
                        styles.selectedButton,
                    ]}
                    onPress={() => handleChange("paymentMethod", "venmo")}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        formData.paymentMethod === "venmo" &&
                          styles.selectedButtonText,
                      ]}
                    >
                      Venmo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Notes Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>

              <TextInput
                ref={notesRef}
                style={styles.multilineInput}
                value={formData.notes}
                onChangeText={(text) => handleChange("notes", text)}
                placeholder="Add any additional notes about this client..."
                placeholderTextColor={COLORS.secondary}
                multiline
                textAlignVertical="top"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            {/* Submit button for keyboard users */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Add Client</Text>
              )}
            </TouchableOpacity>

            {/* Bottom spacing */}
            <View style={styles.bottomPadding} />
          </ScrollView>

          {/* State selection modal */}
          {renderStateModal()}
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
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  required: {
    color: COLORS.error,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    color: COLORS.primary,
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    marginTop: 4,
  },
  dropdownInput: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    color: COLORS.primary,
  },
  placeholderText: {
    color: COLORS.secondary,
  },
  multilineInput: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    color: COLORS.primary,
    height: 96,
    textAlignVertical: "top",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  halfColumn: {
    width: "48%",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  switchLabel: {
    color: COLORS.primary,
  },
  buttonGroup: {
    flexDirection: "row",
    marginTop: SPACING.sm,
  },
  optionButton: {
    flex: 1,
    padding: SPACING.sm,
    marginHorizontal: SPACING.xs / 2,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  optionButtonText: {
    color: COLORS.primary,
    textAlign: "center",
  },
  selectedButtonText: {
    color: COLORS.white,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    marginVertical: SPACING.md,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold as any,
    fontSize: FONTS.sizes.md,
  },
  bottomPadding: {
    height: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    color: COLORS.primary,
  },
  stateList: {
    flexGrow: 0,
  },
  stateItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  stateCode: {
    width: 40,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  stateName: {
    flex: 1,
    color: COLORS.secondary,
  },
});

export default AddClientScreen;
