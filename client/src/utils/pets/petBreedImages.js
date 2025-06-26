// eslint-disable-next-line import/named
import { Asset } from 'expo-asset';

// All breed images
export const breedImages = {
  'Labrador Retriever': require('../../assets/images/breeds/labrador_retriever.png'),
  'French Bulldog': require('../../assets/images/breeds/french_bulldog.png'),
  'Golden Retriever': require('../../assets/images/breeds/golden_retriever.png'),
  'German Shepherd': require('../../assets/images/breeds/german_shepherd.png'),
  Poodle: require('../../assets/images/breeds/poodle.png'),
  Bulldog: require('../../assets/images/breeds/bulldog.png'),
  Beagle: require('../../assets/images/breeds/beagle.png'),
  Rottweiler: require('../../assets/images/breeds/rottweiler.png'),
  Dachshund: require('../../assets/images/breeds/dachshund.png'),
  'German Shorthaired Pointer': require('../../assets/images/breeds/german_shorthaired_pointer.png'),
  'Yorkshire Terrier': require('../../assets/images/breeds/yorkshire_terrier.png'),
  Boxer: require('../../assets/images/breeds/boxer.png'),
  'Siberian Husky': require('../../assets/images/breeds/siberian_husky.png'),
  'Cavalier King Charles Spaniel': require('../../assets/images/breeds/cavalier_king_charles_spaniel.png'),
  'Doberman Pinscher': require('../../assets/images/breeds/doberman_pinscher.png'),
  'Great Dane': require('../../assets/images/breeds/great_dane.png'),
  'Miniature Schnauzer': require('../../assets/images/breeds/miniature_schnauzer.png'),
  'Australian Shepherd': require('../../assets/images/breeds/australian_shepherd.png'),
  'Shih Tzu': require('../../assets/images/breeds/shih_tzu.png'),
  'Boston Terrier': require('../../assets/images/breeds/boston_terrier.png'),
  'Bernese Mountain Dog': require('../../assets/images/breeds/bernese_mountain_dog.png'),
  Pomeranian: require('../../assets/images/breeds/pomeranian.png'),
  Havanese: require('../../assets/images/breeds/havanese.png'),
  'English Springer Spaniel': require('../../assets/images/breeds/english_springer_spaniel.png'),
  'Shetland Sheepdog': require('../../assets/images/breeds/shetland_sheepdog.png'),
};

export const preloadBreedImages = async () => {
  const assetPromises = Object.entries(breedImages).map(
    async ([breedName, imageModule]) => {
      const asset = Asset.fromModule(imageModule);
      await asset.downloadAsync();
      return { breedName, success: true };
    },
  );

  await Promise.all(Promise.all(assetPromises));
};

export const getBreedImage = (breed) => {
  return breedImages[breed] || breedImages['Labrador Retriever'];
};
