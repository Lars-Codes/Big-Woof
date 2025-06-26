import React from 'react';
import { Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectPetDetails,
  selectPetProfilePicture,
} from '../../../state/petDetails/petDetailsSlice';
import { getBreedImage } from '../../../utils/pets/petBreedImages';

export default function AutoPetProfilePicture({
  children,
  pet: propPet,
  size = 100,
}) {
  const pet = propPet || useSelector(selectPetDetails);
  const petProfilePicture = useSelector(selectPetProfilePicture);

  const isDeceased = pet?.pet_data?.deceased === 1;

  const shouldUseBreedImage = propPet || !petProfilePicture;

  if (shouldUseBreedImage) {
    // Use breed-based image
    const breed = pet?.pet_data?.breed || '';
    const imageSource = getBreedImage(breed);

    return (
      <View
        className="items-center overflow-visible"
        style={{ marginTop: propPet ? 0 : 16, marginBottom: propPet ? 0 : 8 }}
      >
        <View className="relative">
          <View
            className="rounded-full bg-gray-300 justify-center items-center overflow-visible"
            style={{ width: size, height: size, opacity: isDeceased ? 0.5 : 1 }}
          >
            <Image
              source={imageSource}
              style={{
                width: size * 0.8,
                height: size * 0.8,
                borderRadius: (size * 0.8) / 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
                elevation: 8,
                overflow: 'visible',
              }}
              resizeMode="cover"
              fadeDuration={0}
            />
          </View>
          {children}
        </View>
      </View>
    );
  }

  // Use uploaded profile picture
  const imageUri = petProfilePicture?.startsWith('data:')
    ? petProfilePicture
    : `data:image/jpeg;base64,${petProfilePicture}`;

  return (
    <View className="items-center mt-4 mb-2">
      <View className="relative">
        <Image
          source={{ uri: imageUri }}
          className="w-[100px] h-[100px] rounded-full"
          style={isDeceased ? { opacity: 0.5 } : {}}
        />
        {children}
      </View>
    </View>
  );
}
