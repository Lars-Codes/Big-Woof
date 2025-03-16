import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  StyleSheet,
  Modal,
} from "react-native";
import {
  ChevronLeft,
  Check,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react-native";
import { Calendar as CalendarPicker } from "react-native-calendars";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
import { Client, Service, Pet, clients, useServices } from "../../data";

// Define the type for the form data
type FormData = {
  client: Client | null;
  pets: Pet[];
  services: Service[];
  date: string;
  time: string;
  duration: number;
  totalPrice: number;
  notes: string;
  sendReminders: boolean;
  recurring: boolean;
  recurringFrequency: string;
  recurringCount: string;
  location: string;
  travelDistance: number;
  travelFee: number;
};

type AddAppointmentScreenRouteProp = RouteProp<
  RootStackParamList,
  "AddAppointment"
>;
type AddAppointmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddAppointment"
>;

type AddAppointmentScreenProps = {
  route: AddAppointmentScreenRouteProp;
  navigation: AddAppointmentScreenNavigationProp;
};

const AddAppointmentScreen = ({
  route,
  navigation,
}: AddAppointmentScreenProps) => {
  const [step, setStep] = useState(1); // 1: Select pet, 2: Select service, 3: Select date/time
  const [services, setServices] = useServices();

  // In a real app, you might have these pre-filled if coming from client details
  const clientId = route?.params?.clientId;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    client: null,
    pets: [],
    services: [],
    date: "",
    time: "",
    duration: 0,
    totalPrice: 0,
    notes: "",
    sendReminders: true,
    recurring: false,
    recurringFrequency: "1", // in weeks
    recurringCount: "4", // number of appointments
    location: "",
    travelDistance: 0,
    travelFee: 0,
  });

  // UI state
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showClientPicker, setShowClientPicker] = useState(false);

  // Find client by ID if we have one passed in
  useEffect(() => {
    if (clientId) {
      const selectedClient = clients.find((c) => c.id === clientId);
      if (selectedClient) {
        setFormData({
          ...formData,
          client: selectedClient,
        });
      }
    }
  }, [clientId]);

  // Handle changing a pet selection
  const togglePet = (pet: Pet) => {
    const isPetSelected = formData.pets.some((p) => p.id === pet.id);

    if (isPetSelected) {
      setFormData({
        ...formData,
        pets: formData.pets.filter((p) => p.id !== pet.id),
      });
    } else {
      setFormData({
        ...formData,
        pets: [...formData.pets, pet],
      });
    }
  };

  // Handle changing a service selection
  const toggleService = (service: Service) => {
    const isServiceSelected = formData.services.some(
      (s) => s.id === service.id
    );

    if (isServiceSelected) {
      setFormData({
        ...formData,
        services: formData.services.filter((s) => s.id !== service.id),
      });
    } else {
      setFormData({
        ...formData,
        services: [...formData.services, service],
      });
    }

    // Recalculate total price and duration
    setTimeout(calculateTotals, 0);
  };

  // Calculate total price and duration
  const calculateTotals = () => {
    let totalPrice = 0;
    let totalDuration = 0;

    formData.pets.forEach((pet) => {
      formData.services.forEach((service) => {
        totalPrice += service.prices[pet.size as keyof typeof service.prices] || 0;
        totalDuration += service.duration || 0;
      });
    });

    // Add travel fee if applicable
    totalPrice += formData.travelFee;

    setFormData({
      ...formData,
      totalPrice,
      duration: totalDuration,
    });
  };

  // Handle date selection
  const handleDateSelect = (day: any) => {
    setFormData({
      ...formData,
      date: day.dateString,
    });
    setShowCalendar(false);
  };

  // Handle time selection
  const handleTimeConfirm = (time: Date) => {
    const formattedTime = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setFormData({
      ...formData,
      time: formattedTime,
    });
    setShowTimePicker(false);
  };

  // Handle client selection
  const selectClient = (client: Client) => {
    setFormData({
      ...formData,
      client,
      pets: [], // Reset pets when changing client
    });
    setShowClientPicker(false);
  };

  // Handle toggle changes
  const handleToggle = (field: keyof FormData) => {
    if (field === "recurring" || field === "sendReminders") {
      setFormData({
        ...formData,
        [field]: !formData[field],
      });
    }
  };

  // Handle text input changes
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Recalculate totals if travel-related fields changed
    if (field === "travelDistance") {
      // Example: $1 per mile
      const travelFee = parseFloat(value) * 1;
      setFormData({
        ...formData,
        [field]: value,
        travelFee,
      });

      setTimeout(calculateTotals, 0);
    }
  };

  // Save appointment
  const handleSave = () => {
    // Validate form
    if (!formData.client) {
      Alert.alert("Missing Information", "Please select a client");
      return;
    }

    if (formData.pets.length === 0) {
      Alert.alert("Missing Information", "Please select at least one pet");
      return;
    }

    if (formData.services.length === 0) {
      Alert.alert("Missing Information", "Please select at least one service");
      return;
    }

    if (!formData.date || !formData.time) {
      Alert.alert("Missing Information", "Please select a date and time");
      return;
    }

    // In a real app, you would save the appointment data to your backend/database
    console.log("Saving appointment:", formData);

    // Navigate back to appointments list
    navigation.goBack();
  };

  // Render client picker
  const renderClientPicker = () => (
    <View style={styles.clientPickerModal}>
      <View style={styles.clientPickerHeader}>
        <TouchableOpacity onPress={() => setShowClientPicker(false)}>
          <Text style={styles.clientPickerCancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.clientPickerTitle}>Select Client</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.clientPickerList}>
        {clients.map((client) => (
          <TouchableOpacity
            key={client.id}
            style={styles.clientPickerItem}
            onPress={() => selectClient(client)}
          >
            <Text style={styles.clientPickerName}>{client.name}</Text>
            <Text style={styles.clientPickerPets}>
              {client.pets.length} {client.pets.length === 1 ? "pet" : "pets"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              navigation.goBack();
            }
          }}
        >
          <ChevronLeft color={COLORS.primary} size={24} />
          <Text style={styles.headerBackText}>
            {step > 1 ? "Back" : "Cancel"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Appointment</Text>
        {step === 3 ? (
          <TouchableOpacity
            style={styles.headerSaveButton}
            onPress={handleSave}
          >
            <Check color="#fff" size={18} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.headerNextButton}
            onPress={() => setStep(step + 1)}
          >
            <Text style={styles.headerNextText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <View style={[styles.stepCircle, step >= 1 && styles.stepCircleActive]}>
          <Text style={step >= 1 ? styles.stepTextActive : styles.stepText}>
            1
          </Text>
        </View>
        <View style={styles.stepLine}>
          <View
            style={[
              styles.stepLineProgress,
              { width: step >= 2 ? "100%" : "0%" },
            ]}
          />
        </View>
        <View style={[styles.stepCircle, step >= 2 && styles.stepCircleActive]}>
          <Text style={step >= 2 ? styles.stepTextActive : styles.stepText}>
            2
          </Text>
        </View>
        <View style={styles.stepLine}>
          <View
            style={[
              styles.stepLineProgress,
              { width: step >= 3 ? "100%" : "0%" },
            ]}
          />
        </View>
        <View style={[styles.stepCircle, step >= 3 && styles.stepCircleActive]}>
          <Text style={step >= 3 ? styles.stepTextActive : styles.stepText}>
            3
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Step 1: Select Client and Pets */}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Select Client & Pets</Text>

            {/* Client Selector */}
            <TouchableOpacity
              style={styles.clientSelector}
              onPress={() => setShowClientPicker(true)}
            >
              <View>
                <Text style={styles.selectorLabel}>Client</Text>
                <Text style={styles.selectedClient}>
                  {formData.client ? formData.client.name : "Select Client"}
                </Text>
              </View>
              <ChevronDown color={COLORS.primary} size={20} />
            </TouchableOpacity>

            {/* Pet Selector - only show if client is selected */}
            {formData.client && (
              <View style={styles.petSelector}>
                <Text style={styles.selectorLabel}>Select Pet(s)</Text>
                {formData.client.pets.map((pet) => (
                  <TouchableOpacity
                    key={pet.id}
                    style={[
                      styles.petItem,
                      formData.pets.some((p) => p.id === pet.id) &&
                        styles.petItemSelected,
                    ]}
                    onPress={() => togglePet(pet)}
                  >
                    <View
                      style={[
                        styles.checkCircle,
                        formData.pets.some((p) => p.id === pet.id)
                          ? styles.checkCircleSelected
                          : styles.checkCircleUnselected,
                      ]}
                    >
                      {formData.pets.some((p) => p.id === pet.id) && (
                        <Check color={COLORS.primary} size={14} />
                      )}
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.petName,
                          formData.pets.some((p) => p.id === pet.id) &&
                            styles.petNameSelected,
                        ]}
                      >
                        {pet.name}
                      </Text>
                      <Text
                        style={[
                          styles.petDetails,
                          formData.pets.some((p) => p.id === pet.id) &&
                            styles.petDetailsSelected,
                        ]}
                      >
                        {pet.breed} • {pet.size}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Step 2: Select Services */}
        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Select Services</Text>

            {formData.pets.length > 0 ? (
              <>
                <Text style={styles.servicesForLabel}>
                  Services for {formData.pets.map((p) => p.name).join(", ")}
                </Text>

                {services.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={[
                      styles.serviceItem,
                      formData.services.some((s) => s.id === service.id) &&
                        styles.serviceItemSelected,
                    ]}
                    onPress={() => toggleService(service)}
                  >
                    <View style={styles.serviceContent}>
                      <View style={styles.serviceInfo}>
                        <Text
                          style={[
                            styles.serviceName,
                            formData.services.some(
                              (s) => s.id === service.id
                            ) && styles.serviceNameSelected,
                          ]}
                        >
                          {service.name}
                        </Text>
                        <Text
                          style={[
                            styles.serviceDuration,
                            formData.services.some(
                              (s) => s.id === service.id
                            ) && styles.serviceDurationSelected,
                          ]}
                        >
                          {service.duration} min
                        </Text>
                      </View>

                      <View style={styles.servicePrices}>
                        {formData.pets.map((pet) => (
                          <View key={pet.id} style={styles.petPrice}>
                            <Text
                              style={[
                                styles.petPriceAmount,
                                formData.services.some(
                                  (s) => s.id === service.id
                                ) && styles.petPriceAmountSelected,
                              ]}
                            >
                              ${service.prices[pet.size as keyof typeof service.prices] || 0}
                            </Text>
                            <Text
                              style={[
                                styles.petPriceName,
                                formData.services.some(
                                  (s) => s.id === service.id
                                ) && styles.petPriceNameSelected,
                              ]}
                            >
                              {pet.name}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <Text style={styles.emptyMessage}>
                Please select at least one pet first.
              </Text>
            )}
          </View>
        )}

        {/* Step 3: Schedule & Finalize */}
        {step === 3 && (
          <View>
            <Text style={styles.stepTitle}>Schedule & Finalize</Text>

            {/* Date and Time */}
            <View style={styles.dateTimeSection}>
              <Text style={styles.sectionLabel}>Appointment Date & Time</Text>

              <View style={styles.dateTimeSelectors}>
                <TouchableOpacity
                  style={styles.dateSelector}
                  onPress={() => setShowCalendar(true)}
                >
                  <View style={styles.selectorContent}>
                    <Calendar color={COLORS.secondary} size={20} />
                    <Text style={styles.selectorText}>
                      {formData.date ? formData.date : "Select Date"}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.timeSelector}
                  onPress={() => setShowTimePicker(true)}
                >
                  <View style={styles.selectorContent}>
                    <Clock color={COLORS.secondary} size={20} />
                    <Text style={styles.selectorText}>
                      {formData.time ? formData.time : "Select Time"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {showCalendar && (
                <CalendarPicker
                  onDayPress={handleDateSelect}
                  markedDates={{
                    [formData.date]: {
                      selected: true,
                      selectedColor: COLORS.primary,
                    },
                  }}
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
              )}

              <DateTimePickerModal
                isVisible={showTimePicker}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={() => setShowTimePicker(false)}
              />
            </View>

            {/* Recurring Options */}
            <Card style={styles.card}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Recurring Appointment</Text>
                <Switch
                  value={formData.recurring}
                  onValueChange={() => handleToggle("recurring")}
                  trackColor={{ false: "#E0E0E0", true: COLORS.secondary }}
                  thumbColor={formData.recurring ? COLORS.primary : "#f4f3f4"}
                />
              </View>

              {formData.recurring && (
                <View>
                  <View style={styles.recurringOptions}>
                    <View style={styles.recurringFrequency}>
                      <Text style={styles.inputLabel}>Repeat Every</Text>
                      <View style={styles.frequencyInput}>
                        <TextInput
                          style={styles.textInput}
                          value={formData.recurringFrequency}
                          onChangeText={(text) =>
                            handleChange("recurringFrequency", text)
                          }
                          keyboardType="number-pad"
                        />
                        <View style={styles.weekLabel}>
                          <Text style={styles.weekLabelText}>Week(s)</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.recurringCount}>
                      <Text style={styles.inputLabel}>Total Appointments</Text>
                      <TextInput
                        style={styles.countInput}
                        value={formData.recurringCount}
                        onChangeText={(text) =>
                          handleChange("recurringCount", text)
                        }
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                </View>
              )}
            </Card>

            {/* Location & Travel */}
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Location & Travel</Text>

              <View style={styles.addressContainer}>
                <Text style={styles.inputLabel}>Address</Text>
                <View style={styles.addressInputContainer}>
                  <MapPin color={COLORS.secondary} size={20} />
                  <TextInput
                    style={styles.addressInput}
                    value={formData.location}
                    onChangeText={(text) => handleChange("location", text)}
                    placeholder="Enter client address"
                    placeholderTextColor={COLORS.secondary}
                  />
                </View>
              </View>

              <View style={styles.travelOptions}>
                <View style={styles.travelDistance}>
                  <Text style={styles.inputLabel}>Travel Distance (miles)</Text>
                  <TextInput
                    style={styles.distanceInput}
                    value={String(formData.travelDistance)}
                    onChangeText={(text) =>
                      handleChange("travelDistance", text)
                    }
                    keyboardType="decimal-pad"
                    placeholder="0.0"
                    placeholderTextColor={COLORS.secondary}
                  />
                </View>

                <View style={styles.travelFee}>
                  <Text style={styles.inputLabel}>Travel Fee</Text>
                  <View style={styles.feeDisplay}>
                    <Text style={styles.feeText}>
                      ${formData.travelFee.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* Notes */}
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Appointment Notes</Text>
              <TextInput
                style={styles.notesInput}
                value={formData.notes}
                onChangeText={(text) => handleChange("notes", text)}
                placeholder="Add any notes for this appointment..."
                placeholderTextColor={COLORS.secondary}
                multiline
                textAlignVertical="top"
              />
            </Card>

            {/* Appointment Summary */}
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Appointment Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Client:</Text>
                <Text style={styles.summaryValue}>
                  {formData.client?.name || "Not selected"}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pets:</Text>
                <Text style={styles.summaryValue}>
                  {formData.pets.length > 0
                    ? formData.pets.map((p) => p.name).join(", ")
                    : "None selected"}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Services:</Text>
                <Text style={styles.summaryValue}>
                  {formData.services.length > 0
                    ? formData.services.map((s) => s.name).join(", ")
                    : "None selected"}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date & Time:</Text>
                <Text style={styles.summaryValue}>
                  {formData.date && formData.time
                    ? `${formData.date} at ${formData.time}`
                    : "Not scheduled"}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration:</Text>
                <Text style={styles.summaryValue}>
                  {formData.duration} minutes
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Travel Fee:</Text>
                <Text style={styles.summaryValue}>
                  ${formData.travelFee.toFixed(2)}
                </Text>
              </View>

              <View style={styles.summaryTotal}>
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total Price:</Text>
                  <Text style={styles.totalValue}>
                    ${formData.totalPrice.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Reminder Toggle */}
            <Card style={{ ...styles.card, ...styles.reminderCard }}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>
                  Send Appointment Reminders
                </Text>
                <Switch
                  value={formData.sendReminders}
                  onValueChange={() => handleToggle("sendReminders")}
                  trackColor={{ false: "#E0E0E0", true: COLORS.secondary }}
                  thumbColor={
                    formData.sendReminders ? COLORS.primary : "#f4f3f4"
                  }
                />
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Client Picker Modal */}
      {showClientPicker && renderClientPicker()}
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
  headerBackButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerBackText: {
    marginLeft: SPACING.xs,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium as any,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  headerSaveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  headerNextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
  },
  headerNextText: {
    color: COLORS.white,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg * 2,
    paddingVertical: SPACING.md,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
  },
  stepText: {
    color: COLORS.secondary,
  },
  stepTextActive: {
    color: COLORS.white,
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.background,
    alignSelf: "center",
    marginHorizontal: SPACING.sm,
  },
  stepLineProgress: {
    height: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  stepTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  clientSelector: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorLabel: {
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  selectedClient: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  petSelector: {
    marginBottom: SPACING.md,
  },
  petItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
  },
  petItemSelected: {
    backgroundColor: COLORS.primary,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  checkCircleSelected: {
    backgroundColor: COLORS.white,
  },
  checkCircleUnselected: {
    backgroundColor: COLORS.secondary,
  },
  petName: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  petNameSelected: {
    color: COLORS.white,
  },
  petDetails: {
    color: COLORS.secondary,
  },
  petDetailsSelected: {
    color: COLORS.white,
  },
  servicesForLabel: {
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  serviceItem: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
  },
  serviceItemSelected: {
    backgroundColor: COLORS.primary,
  },
  serviceContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  serviceNameSelected: {
    color: COLORS.white,
  },
  serviceDuration: {
    color: COLORS.secondary,
  },
  serviceDurationSelected: {
    color: COLORS.white,
  },
  servicePrices: {
    flexDirection: "row",
  },
  petPrice: {
    marginLeft: SPACING.sm,
  },
  petPriceAmount: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    textAlign: "right",
  },
  petPriceAmountSelected: {
    color: COLORS.white,
  },
  petPriceName: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.secondary,
    textAlign: "right",
  },
  petPriceNameSelected: {
    color: COLORS.white,
  },
  emptyMessage: {
    color: COLORS.secondary,
    fontStyle: "italic",
  },
  dateTimeSection: {
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  dateTimeSelectors: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
  },
  dateSelector: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeSelector: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginLeft: SPACING.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectorText: {
    marginLeft: SPACING.sm,
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  toggleLabel: {
    color: COLORS.primary,
  },
  recurringOptions: {
    flexDirection: "row",
    marginBottom: SPACING.xs,
  },
  recurringFrequency: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  recurringCount: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  inputLabel: {
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  frequencyInput: {
    flexDirection: "row",
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    color: COLORS.primary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  weekLabel: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    flex: 1,
    justifyContent: "center",
  },
  weekLabelText: {
    color: COLORS.primary,
  },
  countInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    color: COLORS.primary,
  },
  cardTitle: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  addressContainer: {
    marginBottom: SPACING.sm,
  },
  addressInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
  },
  addressInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    color: COLORS.primary,
  },
  travelOptions: {
    flexDirection: "row",
    marginBottom: SPACING.xs,
  },
  travelDistance: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  travelFee: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  distanceInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    color: COLORS.primary,
  },
  feeDisplay: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    justifyContent: "center",
  },
  feeText: {
    color: COLORS.primary,
  },
  notesInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    color: COLORS.primary,
    height: 80,
    textAlignVertical: "top",
  },
  summary: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    color: COLORS.white,
  },
  summaryValue: {
    color: COLORS.white,
    fontWeight: FONTS.weights.medium as any,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: COLORS.white,
    paddingTop: SPACING.sm,
    marginTop: SPACING.sm,
  },
  totalLabel: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold as any,
  },
  totalValue: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold as any,
  },
  reminderCard: {
    marginBottom: SPACING.md,
  },
  clientPickerModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    zIndex: 10,
  },
  clientPickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  clientPickerCancel: {
    color: COLORS.primary,
  },
  clientPickerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  clientPickerList: {
    padding: SPACING.md,
  },
  clientPickerItem: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  clientPickerName: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  clientPickerPets: {
    color: COLORS.secondary,
  },
});

export default AddAppointmentScreen;