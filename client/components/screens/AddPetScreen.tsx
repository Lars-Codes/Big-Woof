import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { ChevronLeft, Check, Camera, X, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScreenProps } from '../../types/navigation';

// Define the type for a problem
type Problem = {
  problem: string;
  solution: string;
};

// Define the type for the form data
type FormData = {
  name: string;
  breed: string;
  age: string;
  weight: string;
  size: 'small' | 'medium' | 'large';
  vaccinated: boolean;
  rabiesExpiration: string;
  notes: string;
  problems: Problem[];
  photo: string | null;
};

const AddPetScreen = ({ route, navigation }: ScreenProps<'AddPet'>) => {
  // In a real app, you would use the client ID from route.params
  const clientId = route?.params?.clientId || '1';
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    breed: '',
    age: '',
    weight: '',
    size: 'medium', // 'small', 'medium', 'large'
    vaccinated: false,
    rabiesExpiration: '',
    notes: '',
    problems: [],
    photo: null,
  });

  // State for new problem
  const [newProblem, setNewProblem] = useState<Problem>({ problem: '', solution: '' });

  // Handle text input changes
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Add a problem
  const addProblem = () => {
    if (newProblem.problem && newProblem.solution) {
      setFormData({
        ...formData,
        problems: [...formData.problems, { ...newProblem }],
      });
      setNewProblem({ problem: '', solution: '' });
    } else {
      Alert.alert('Missing Information', 'Please add both a problem and solution');
    }
  };

  // Remove a problem
  const removeProblem = (index: number) => {
    const updatedProblems = [...formData.problems];
    updatedProblems.splice(index, 1);
    setFormData({
      ...formData,
      problems: updatedProblems,
    });
  };

  // Handle image picker
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to allow access to your photos to add a pet photo');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        photo: result.assets[0].uri,
      });
    }
  };

  // Take a photo with camera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to allow access to your camera to take a pet photo');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        photo: result.assets[0].uri,
      });
    }
  };

  // Save pet
  const handleSave = () => {
    // Validate form
    if (!formData.name || !formData.breed) {
      Alert.alert('Missing Information', 'Please fill in all required fields (Name and Breed)');
      return;
    }

    // In a real app, you would save the pet data to your backend/database
    console.log('Saving pet:', formData);
    
    // Navigate back to client details
    navigation.goBack();
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
        <Text className="text-lg font-bold text-[#503D42]">Add New Pet</Text>
        <TouchableOpacity 
          className="bg-[#503D42] rounded-full w-8 h-8 items-center justify-center"
          onPress={handleSave}
        >
          <Check color="#fff" size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Pet Photo */}
        <View className="items-center mb-6">
          {formData.photo ? (
            <View>
              <Image 
                source={{ uri: formData.photo }} 
                className="w-24 h-24 rounded-full" 
              />
              <TouchableOpacity 
                className="absolute right-0 top-0 bg-[#503D42] rounded-full w-6 h-6 items-center justify-center"
                onPress={() => handleChange('photo', null)}
              >
                <X color="#fff" size={14} />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="w-24 h-24 rounded-full bg-[#F5FBEF] items-center justify-center">
              <Camera color="#748B75" size={32} />
            </View>
          )}
          
          <View className="flex-row mt-3">
            <TouchableOpacity 
              className="bg-[#F5FBEF] rounded-lg px-3 py-2 mr-2"
              onPress={pickImage}
            >
              <Text className="text-[#503D42]">Choose Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-[#F5FBEF] rounded-lg px-3 py-2"
              onPress={takePhoto}
            >
              <Text className="text-[#503D42]">Take Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Information Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#503D42] mb-4">Basic Information</Text>
          
          <View className="mb-4">
            <Text className="text-[#748B75] mb-1">Name <Text className="text-red-500">*</Text></Text>
            <TextInput
              className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Enter pet name"
              placeholderTextColor="#A8BCAA"
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-[#748B75] mb-1">Breed <Text className="text-red-500">*</Text></Text>
            <TextInput
              className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
              value={formData.breed}
              onChangeText={(text) => handleChange('breed', text)}
              placeholder="Enter breed"
              placeholderTextColor="#A8BCAA"
            />
          </View>
          
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-[#748B75] mb-1">Age (years)</Text>
              <TextInput
                className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
                value={formData.age}
                onChangeText={(text) => handleChange('age', text)}
                placeholder="Age"
                placeholderTextColor="#A8BCAA"
                keyboardType="number-pad"
              />
            </View>
            
            <View className="flex-1 ml-2">
              <Text className="text-[#748B75] mb-1">Weight (lbs)</Text>
              <TextInput
                className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
                value={formData.weight}
                onChangeText={(text) => handleChange('weight', text)}
                placeholder="Weight"
                placeholderTextColor="#A8BCAA"
                keyboardType="number-pad"
              />
            </View>
          </View>
          
          <View className="mb-4">
            <Text className="text-[#748B75] mb-1">Size</Text>
            <View className="flex-row mt-2">
              <TouchableOpacity
                className={`flex-1 p-3 mr-2 rounded-lg ${formData.size === 'small' ? 'bg-[#503D42]' : 'bg-[#F5FBEF]'}`}
                onPress={() => handleChange('size', 'small')}
              >
                <Text className={`text-center ${formData.size === 'small' ? 'text-white' : 'text-[#503D42]'}`}>
                  Small
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`flex-1 p-3 mr-2 rounded-lg ${formData.size === 'medium' ? 'bg-[#503D42]' : 'bg-[#F5FBEF]'}`}
                onPress={() => handleChange('size', 'medium')}
              >
                <Text className={`text-center ${formData.size === 'medium' ? 'text-white' : 'text-[#503D42]'}`}>
                  Medium
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`flex-1 p-3 rounded-lg ${formData.size === 'large' ? 'bg-[#503D42]' : 'bg-[#F5FBEF]'}`}
                onPress={() => handleChange('size', 'large')}
              >
                <Text className={`text-center ${formData.size === 'large' ? 'text-white' : 'text-[#503D42]'}`}>
                  Large
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Health Information Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#503D42] mb-4">Health Information</Text>
          
          <TouchableOpacity 
            className={`flex-row items-center justify-between p-4 mb-4 rounded-lg ${formData.vaccinated ? 'bg-green-100' : 'bg-[#F5FBEF]'}`}
            onPress={() => handleChange('vaccinated', !formData.vaccinated)}
          >
            <Text className={`${formData.vaccinated ? 'text-green-700' : 'text-[#503D42]'}`}>
              Vaccinated
            </Text>
            <View className={`w-6 h-6 rounded-full items-center justify-center ${formData.vaccinated ? 'bg-green-700' : 'bg-[#748B75]'}`}>
              {formData.vaccinated && <Check color="#fff" size={14} />}
            </View>
          </TouchableOpacity>
          
          <View className="mb-4">
            <Text className="text-[#748B75] mb-1">Rabies Vaccination Expiration</Text>
            <TextInput
              className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42]"
              value={formData.rabiesExpiration}
              onChangeText={(text) => handleChange('rabiesExpiration', text)}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#A8BCAA"
            />
          </View>
        </View>

        {/* Problems & Solutions Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#503D42] mb-4">Problems & Solutions</Text>
          
          {formData.problems.map((problem, index) => (
            <View key={index} className="bg-[#F5FBEF] rounded-lg p-4 mb-3">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="font-bold text-[#503D42] mb-1">Problem:</Text>
                  <Text className="text-[#503D42] mb-2">{problem.problem}</Text>
                  <Text className="font-bold text-[#503D42] mb-1">Solution:</Text>
                  <Text className="text-[#503D42]">{problem.solution}</Text>
                </View>
                <TouchableOpacity 
                  className="bg-red-100 rounded-full w-6 h-6 items-center justify-center"
                  onPress={() => removeProblem(index)}
                >
                  <X color="#FF6B6B" size={14} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          <View className="bg-[#F5FBEF] rounded-lg p-4 mb-3">
            <View className="mb-3">
              <Text className="text-[#748B75] mb-1">Problem</Text>
              <TextInput
                className="bg-white rounded-lg p-3 text-[#503D42]"
                value={newProblem.problem}
                onChangeText={(text) => setNewProblem({ ...newProblem, problem: text })}
                placeholder="Describe the issue (e.g., Bites during nail trims)"
                placeholderTextColor="#A8BCAA"
              />
            </View>
            
            <View className="mb-3">
              <Text className="text-[#748B75] mb-1">Solution</Text>
              <TextInput
                className="bg-white rounded-lg p-3 text-[#503D42]"
                value={newProblem.solution}
                onChangeText={(text) => setNewProblem({ ...newProblem, solution: text })}
                placeholder="Describe the solution (e.g., Use muzzle)"
                placeholderTextColor="#A8BCAA"
              />
            </View>
            
            <TouchableOpacity 
              className="bg-[#503D42] rounded-lg p-3 items-center justify-center"
              onPress={addProblem}
            >
              <Text className="text-white font-medium">Add Problem</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#503D42] mb-4">Notes</Text>
          
          <TextInput
            className="bg-[#F5FBEF] rounded-lg p-3 text-[#503D42] h-24"
            value={formData.notes}
            onChangeText={(text) => handleChange('notes', text)}
            placeholder="Add any additional notes about this pet..."
            placeholderTextColor="#A8BCAA"
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddPetScreen;