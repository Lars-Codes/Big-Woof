import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { ScreenProps } from '../../types/navigation';

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
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-[#F5FBEF] border-b border-gray-200">
        <TouchableOpacity 
          className="flex-row items-center" 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="#503D42" size={24} />
          <Text className="ml-1 text-[#503D42] font-medium">Back</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#503D42]">Add New Client</Text>
        <TouchableOpacity 
          className="bg-[#503D42] rounded-full w-8 h-8 items-center justify-center"
          onPress={handleSave}
        >
          <Check color="#fff" size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Basic Information Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#503D42] mb-4">Basic Information</Text>
          
          <View className="mb-4">
            <Text className="text-[#748B75] mb-1">First Name <Text className="text-red-500">*</Text></Text>
            <TextInput
              className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
              value={formData.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              placeholder="Enter first name"
              placeholderTextColor="#A8BCAA"
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-[#748B75] mb-1">Last Name <Text className="text-red-500">*</Text></Text>
            <TextInput
              className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
              value={formData.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              placeholder="Enter last name"
              placeholderTextColor="#A8BCAA"
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-[#748B75] mb-1">Email</Text>
            <TextInput
              className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Enter email address"
              placeholderTextColor="#A8BCAA"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-[#748B75] mb-1">Phone <Text className="text-red-500">*</Text></Text>
            <TextInput
              className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              placeholder="Enter phone number"
              placeholderTextColor="#A8BCAA"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Address Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#503D42] mb-4">Address</Text>
          
          <View className="mb-4">
            <Text className="text-[#748B75] mb-1">Street Address</Text>
            <TextInput
              className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
              value={formData.address}
              onChangeText={(text) => handleChange('address', text)}
              placeholder="Enter street address"
              placeholderTextColor="#A8BCAA"
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-[#748B75] mb-1">City</Text>
            <TextInput
              className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
              value={formData.city}
              onChangeText={(text) => handleChange('city', text)}
              placeholder="Enter city"
              placeholderTextColor="#A8BCAA"
            />
          </View>
          
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-[#748B75] mb-1">State</Text>
              <TextInput
                className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
                value={formData.state}
                onChangeText={(text) => handleChange('state', text)}
                placeholder="State"
                placeholderTextColor="#A8BCAA"
              />
            </View>
            
            <View className="flex-1 ml-2">
              <Text className="text-[#748B75] mb-1">ZIP Code</Text>
              <TextInput
                className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
                value={formData.zipCode}
                onChangeText={(text) => handleChange('zipCode', text)}
                placeholder="ZIP"
                placeholderTextColor="#A8BCAA"
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#503D42] mb-4">Preferences</Text>
          
          <View className="flex-row items-center justify-between mb-4 bg-[#F5FBEF] rounded-lg p-4">
            <Text className="text-[#503D42]">Enable Appointment Reminders</Text>
            <Switch
              value={formData.enableReminders}
              onValueChange={() => handleToggle('enableReminders')}
              trackColor={{ false: '#E0E0E0', true: '#748B75' }}
              thumbColor={formData.enableReminders ? '#503D42' : '#f4f3f4'}
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-[#748B75] mb-1">Preferred Payment Method</Text>
            <View className="flex-row mt-2">
              <TouchableOpacity
                className={`flex-1 p-3 mr-2 rounded-lg ${formData.paymentMethod === 'credit_card' ? 'bg-[#503D42]' : 'bg-[#F5FBEF]'}`}
                onPress={() => handleChange('paymentMethod', 'credit_card')}
              >
                <Text className={`text-center ${formData.paymentMethod === 'credit_card' ? 'text-white' : 'text-[#503D42]'}`}>
                  Credit Card
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`flex-1 p-3 mr-2 rounded-lg ${formData.paymentMethod === 'cash' ? 'bg-[#503D42]' : 'bg-[#F5FBEF]'}`}
                onPress={() => handleChange('paymentMethod', 'cash')}
              >
                <Text className={`text-center ${formData.paymentMethod === 'cash' ? 'text-white' : 'text-[#503D42]'}`}>
                  Cash
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`flex-1 p-3 rounded-lg ${formData.paymentMethod === 'venmo' ? 'bg-[#503D42]' : 'bg-[#F5FBEF]'}`}
                onPress={() => handleChange('paymentMethod', 'venmo')}
              >
                <Text className={`text-center ${formData.paymentMethod === 'venmo' ? 'text-white' : 'text-[#503D42]'}`}>
                  Venmo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notes Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#503D42] mb-4">Notes</Text>
          
          <TextInput
            className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42] h-24"
            value={formData.notes}
            onChangeText={(text) => handleChange('notes', text)}
            placeholder="Add any additional notes about this client..."
            placeholderTextColor="#A8BCAA"
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddClientScreen;