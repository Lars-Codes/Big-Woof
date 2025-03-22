// components/forms/ClientForm.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { ChevronDown, X, Search } from "lucide-react-native";
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "../../../styles/theme";
import Card from "../../ui/Card";

// US States array for dropdown
export const US_STATES = [
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

// Client form data interface
export interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  aptSuite: string;
  city: string;
  state: string;
  zipCode: string;
  secondaryEmail: string;
  secondaryPhone: string;
  notes: string;
  enableReminders: boolean;
  paymentMethod: string;
}

// Props for the ClientForm component
interface ClientFormProps {
  formData: ClientFormData;
  errors: { [key: string]: string | null };
  isSubmitting: boolean;
  handleChange: (field: keyof ClientFormData, value: any) => void;
  handlePhoneChange: (field: "phone" | "secondaryPhone", value: string) => void;
  handleToggle: (field: keyof ClientFormData) => void;
  handleSubmit: () => void;
  submitLabel: string;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  formData,
  errors,
  isSubmitting,
  handleChange,
  handlePhoneChange,
  handleToggle,
  handleSubmit,
  submitLabel,
}) => {
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

  // Select a state from the dropdown
  const selectState = (stateCode: string) => {
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
                    onPress={() => selectState(item.value)}
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
    <>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Information Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              First Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
              placeholder="First Name"
              placeholderTextColor={COLORS.secondary}
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Last Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              ref={lastNameRef}
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
              placeholder="Last Name"
              placeholderTextColor={COLORS.secondary}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              ref={emailRef}
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              placeholder="Email Address"
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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Phone <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              ref={phoneRef}
              style={styles.input}
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
        </Card>

        {/* Additional Contact Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Contact</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Secondary Email</Text>
            <TextInput
              ref={secondaryEmailRef}
              style={styles.input}
              value={formData.secondaryEmail}
              onChangeText={(text) => handleChange("secondaryEmail", text)}
              placeholder="Secondary Email"
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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Secondary Phone</Text>
            <TextInput
              ref={secondaryPhoneRef}
              style={styles.input}
              value={formData.secondaryPhone}
              onChangeText={(text) => handlePhoneChange("secondaryPhone", text)}
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
        </Card>

        {/* Address Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Street Address</Text>
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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Apartment/Suite</Text>
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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City</Text>
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
              <Text style={styles.inputLabel}>State</Text>
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
              <Text style={styles.inputLabel}>ZIP Code</Text>
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
              />
            </View>
          </View>
        </Card>

        {/* Preferences Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Enable Email Notifications</Text>
            <Switch
              value={formData.enableReminders}
              onValueChange={() => handleToggle("enableReminders")}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
              thumbColor={
                formData.enableReminders ? COLORS.background : "#f4f3f4"
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Preferred Payment Method</Text>
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
                  formData.paymentMethod === "cash" && styles.selectedButton,
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
                  formData.paymentMethod === "venmo" && styles.selectedButton,
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
        </Card>

        {/* Notes Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>

          <TextInput
            ref={notesRef}
            style={styles.textArea}
            value={formData.notes}
            onChangeText={(text) => handleChange("notes", text)}
            placeholder="Add notes about this client..."
            placeholderTextColor={COLORS.secondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={Keyboard.dismiss}
          />
        </Card>

        {/* Submit button for keyboard users */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>{submitLabel}</Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* State selection modal */}
      {renderStateModal()}
    </>
  );
};

// Form utilities
export const formatPhoneNumber = (phone: string) => {
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

// Client form validation
export const validateEmail = (value: string) => {
  if (!value) return true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const validatePhone = (value: string) => {
  if (!value) return true;

  // Remove all non-digits for validation
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10;
};

export const validateClientForm = (formData: ClientFormData) => {
  const errors: { [key: string]: string | null } = {
    email: null,
    secondaryEmail: null,
    phone: null,
    secondaryPhone: null,
  };

  let isValid = true;

  // Validate required fields
  if (
    !formData.firstName.trim() ||
    !formData.lastName.trim() ||
    !formData.phone.trim()
  ) {
    isValid = false;
  }

  // Validate email
  if (formData.email && !validateEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  // Validate secondary email
  if (formData.secondaryEmail && !validateEmail(formData.secondaryEmail)) {
    errors.secondaryEmail = "Please enter a valid email address";
    isValid = false;
  }

  // Validate phone
  if (!validatePhone(formData.phone)) {
    errors.phone = "Please enter a valid phone number";
    isValid = false;
  }

  // Validate secondary phone
  if (formData.secondaryPhone && !validatePhone(formData.secondaryPhone)) {
    errors.secondaryPhone = "Please enter a valid phone number";
    isValid = false;
  }

  return { isValid, errors };
};

// Function to build address string from components
export const buildAddress = (
  address: string,
  aptSuite: string,
  city: string,
  state: string,
  zipCode: string
) => {
  const addressComponents = [
    address,
    aptSuite && `Apt/Suite ${aptSuite}`,
    city,
    state && zipCode ? `${state} ${zipCode}` : state || zipCode,
  ].filter(Boolean);

  return addressComponents.length > 0 ? addressComponents.join(", ") : null;
};

// Function to transform form data for API
export const transformClientDataForApi = (formData: ClientFormData) => {
  // Build the full address from components
  const fullAddress = buildAddress(
    formData.address,
    formData.aptSuite,
    formData.city,
    formData.state,
    formData.zipCode
  );

  // Transform the data for the API
  return {
    fname: formData.firstName,
    lname: formData.lastName,
    email: formData.email || null,
    phone_number: formData.phone.replace(/\D/g, "") || null,
    address: fullAddress,
    secondary_email: formData.secondaryEmail || null,
    secondary_phone: formData.secondaryPhone.replace(/\D/g, "") || null,
    notes: formData.notes || null,
    disable_emails: !formData.enableReminders,
    payment_types: [formData.paymentMethod],
  };
};

// Parse address parts from full address string
export const parseAddress = (fullAddress: string) => {
  const addressParts = {
    address: "",
    aptSuite: "",
    city: "",
    state: "",
    zipCode: "",
  };

  if (!fullAddress) return addressParts;

  // Look for apartment/suite
  const aptMatch = fullAddress.match(/Apt\/Suite\s+([^,]+)/i);
  if (aptMatch) {
    addressParts.aptSuite = aptMatch[1];
  }

  // Look for state and zip
  const stateZipMatch = fullAddress.match(/([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/);
  if (stateZipMatch) {
    addressParts.state = stateZipMatch[1];
    addressParts.zipCode = stateZipMatch[2];
  }

  // Look for city
  const commaSegments = fullAddress.split(",").map((s) => s.trim());

  if (commaSegments.length >= 2) {
    // First segment is likely street address
    addressParts.address = commaSegments[0]
      .replace(/Apt\/Suite\s+([^,]+)/i, "")
      .trim();

    // Second segment is likely city, unless it contains the state/zip
    if (commaSegments[1] && !stateZipMatch?.input?.includes(commaSegments[1])) {
      addressParts.city = commaSegments[1];
    }
  } else {
    // If there's no comma, just use the whole thing as the street address
    addressParts.address = fullAddress;
  }

  return addressParts;
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  required: {
    color: COLORS.error,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    marginTop: 4,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    minHeight: 100,
    textAlignVertical: "top",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  switchLabel: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  halfColumn: {
    width: "48%",
  },
  dropdownInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
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
  buttonGroup: {
    flexDirection: "row",
    marginTop: SPACING.sm,
  },
  optionButton: {
    flex: 1,
    padding: SPACING.sm,
    marginHorizontal: SPACING.xs / 2,
    backgroundColor: COLORS.white,
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
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.7,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.medium as any,
  },
  bottomPadding: {
    height: 20,
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
