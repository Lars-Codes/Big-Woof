import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Switch, Alert, StyleSheet } from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../styles/theme';
import { ScreenProps } from '../../types/navigation';
import Card from '../ui/Card';

const AddClientScreen = ({ navigation }: ScreenProps<'AddClient'>) => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
    enableReminders: true,
    paymentMethod: 'credit_card',
  });

  // Handle text input changes
  const handleChange = (field: any, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle toggle switch changes
  type FormDataKey = keyof typeof formData;

  // Handle toggle switch changes
  const handleToggle = (field: FormDataKey) => {
    setFormData({
      ...formData,
      [field]: !formData[field],
    });
  };

  // Save client
  const handleSave = () => {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields (First Name, Last Name, and Phone)');
      return;
    }

    // In a real app, you would save the client data to your backend/database
    console.log('Saving client:', formData);
    
    // Navigate back to clients list or to add pet
    Alert.alert(
      'Client Added',
      'Would you like to add a pet for this client?',
      [
        {
          text: 'Add Pet',
          onPress: () => {
            // In a real app, you would navigate to the add pet screen
            // with the new client ID
            // navigation.navigate('AddPet', { clientId: 'new-client-id' });
          },
        },
        {
          text: 'Later',
          onPress: () => navigation.goBack(),
          style: 'cancel',
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Add New Client</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Check color={COLORS.white} size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
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
              onChangeText={(text) => handleChange('firstName', text)}
              placeholder="Enter first name"
              placeholderTextColor={COLORS.secondary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Last Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              placeholder="Enter last name"
              placeholderTextColor={COLORS.secondary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Enter email address"
              placeholderTextColor={COLORS.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Phone <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              placeholder="Enter phone number"
              placeholderTextColor={COLORS.secondary}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Street Address</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => handleChange('address', text)}
              placeholder="Enter street address"
              placeholderTextColor={COLORS.secondary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(text) => handleChange('city', text)}
              placeholder="Enter city"
              placeholderTextColor={COLORS.secondary}
            />
          </View>
          
          <View style={styles.rowContainer}>
            <View style={styles.halfColumn}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                value={formData.state}
                onChangeText={(text) => handleChange('state', text)}
                placeholder="State"
                placeholderTextColor={COLORS.secondary}
              />
            </View>
            
            <View style={styles.halfColumn}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={styles.input}
                value={formData.zipCode}
                onChangeText={(text) => handleChange('zipCode', text)}
                placeholder="ZIP"
                placeholderTextColor={COLORS.secondary}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <Card style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Enable Appointment Reminders</Text>
            <Switch
              value={formData.enableReminders}
              onValueChange={() => handleToggle('enableReminders')}
              trackColor={{ false: '#E0E0E0', true: COLORS.secondary }}
              thumbColor={formData.enableReminders ? COLORS.primary : '#f4f3f4'}
            />
          </Card>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Preferred Payment Method</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  formData.paymentMethod === 'credit_card' && styles.selectedButton
                ]}
                onPress={() => handleChange('paymentMethod', 'credit_card')}
              >
                <Text 
                  style={[
                    styles.optionButtonText,
                    formData.paymentMethod === 'credit_card' && styles.selectedButtonText
                  ]}
                >
                  Credit Card
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  formData.paymentMethod === 'cash' && styles.selectedButton
                ]}
                onPress={() => handleChange('paymentMethod', 'cash')}
              >
                <Text 
                  style={[
                    styles.optionButtonText,
                    formData.paymentMethod === 'cash' && styles.selectedButtonText
                  ]}
                >
                  Cash
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  formData.paymentMethod === 'venmo' && styles.selectedButton
                ]}
                onPress={() => handleChange('paymentMethod', 'venmo')}
              >
                <Text 
                  style={[
                    styles.optionButtonText,
                    formData.paymentMethod === 'venmo' && styles.selectedButtonText
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
            style={styles.multilineInput}
            value={formData.notes}
            onChangeText={(text) => handleChange('notes', text)}
            placeholder="Add any additional notes about this client..."
            placeholderTextColor={COLORS.secondary}
            multiline
            textAlignVertical="top"
          />
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
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
  multilineInput: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    color: COLORS.primary,
    height: 96,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  halfColumn: {
    width: '48%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  switchLabel: {
    color: COLORS.primary,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  optionButton: {
    flex: 1,
    padding: SPACING.sm,
    marginHorizontal: SPACING.xs / 2,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  optionButtonText: {
    color: COLORS.primary,
    textAlign: 'center',
  },
  selectedButtonText: {
    color: COLORS.white,
  },
});

export default AddClientScreen;