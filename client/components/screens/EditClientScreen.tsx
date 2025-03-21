import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../styles/theme';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useClientDetails } from '../../hooks/useClientDetails';
import ScreenHeader from '../ui/ScreenHeader';
import Card from '../ui/Card';

// Define the types for navigation and route props
type EditClientRouteProp = RouteProp<RootStackParamList, 'EditClient'>;
type EditClientNavigationProp = StackNavigationProp<RootStackParamList, 'EditClient'>;

// Define the client update payload interface
interface ClientUpdatePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  secondaryEmail: string;
  secondaryPhone: string;
  notes: string;
  disableEmails: boolean;
}

const EditClientScreen: React.FC = () => {
  const navigation = useNavigation<EditClientNavigationProp>();
  const route = useRoute<EditClientRouteProp>();
  const { id } = route.params;
  
  const { client, loading, error, refreshClient } = useClientDetails(id);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<ClientUpdatePayload>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    secondaryEmail: '',
    secondaryPhone: '',
    notes: '',
    disableEmails: false
  });

  // Load client data into form when available
  useEffect(() => {
    if (client) {
      setFormData({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        secondaryEmail: client.secondaryEmail || '',
        secondaryPhone: client.secondaryPhone || '',
        notes: client.notes || '',
        disableEmails: client.disableEmails
      });
    }
  }, [client]);

  // Handle form input changes
  const handleInputChange = (field: keyof ClientUpdatePayload, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert('Missing Information', 'First name and last name are required.');
      return;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (formData.secondaryEmail && !isValidEmail(formData.secondaryEmail)) {
      Alert.alert('Invalid Secondary Email', 'Please enter a valid secondary email address.');
      return;
    }

    // TODO: Implement the actual API call to update the client
    // This is a placeholder until you implement the API service
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success
      Alert.alert(
        'Success',
        'Client information updated successfully.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update client information. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
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
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
              placeholder="First Name"
              placeholderTextColor={COLORS.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
              placeholder="Last Name"
              placeholderTextColor={COLORS.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="Email Address"
              placeholderTextColor={COLORS.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="Phone Number"
              placeholderTextColor={COLORS.secondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              placeholder="Address"
              placeholderTextColor={COLORS.secondary}
            />
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Contact</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Secondary Email</Text>
            <TextInput
              style={styles.input}
              value={formData.secondaryEmail}
              onChangeText={(text) => handleInputChange('secondaryEmail', text)}
              placeholder="Secondary Email"
              placeholderTextColor={COLORS.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Secondary Phone</Text>
            <TextInput
              style={styles.input}
              value={formData.secondaryPhone}
              onChangeText={(text) => handleInputChange('secondaryPhone', text)}
              placeholder="Secondary Phone"
              placeholderTextColor={COLORS.secondary}
              keyboardType="phone-pad"
            />
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Disable Email Notifications</Text>
            <Switch
              value={formData.disableEmails}
              onValueChange={(value) => handleInputChange('disableEmails', value)}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => handleInputChange('notes', text)}
            placeholder="Add notes about this client..."
            placeholderTextColor={COLORS.secondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Update Client</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.medium as any,
    marginLeft: SPACING.xs,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
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
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
  },
  textArea: {
    minHeight: 100,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  switchLabel: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
  },
  buttonContainer: {
    marginTop: SPACING.lg,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.medium as any,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
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