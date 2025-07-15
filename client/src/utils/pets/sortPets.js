import _ from 'lodash';

export default function sortPets(petList, sortBy) {
  switch (sortBy) {
    case 'name':
      return _.sortBy(petList, (pet) => (pet.name || '').toLowerCase());
    case 'breed':
      return _.sortBy(petList, (pet) =>
        (pet.breed || 'Unknown Breed').toLowerCase(),
      );
    case 'coat_type':
      return _.sortBy(petList, (pet) =>
        (pet.coat_type || 'Unknown Coat Type').toLowerCase(),
      );
    case 'hair_length':
      return _.sortBy(petList, (pet) =>
        (pet.hair_length || 'Unknown Hair Length').toLowerCase(),
      );
    case 'size_tier':
      return _.sortBy(petList, (pet) =>
        (pet.size_tier || 'Unknown Size Tier').toLowerCase(),
      );
    case 'age':
      return _.sortBy(petList, (pet) => pet.age || 0);
    case 'weight':
      return _.sortBy(petList, (pet) => pet.weight || 0);
    case 'client_fname':
      return _.sortBy(petList, (pet) => (pet.client_fname || '').toLowerCase());
    case 'client_lname':
      return _.sortBy(petList, (pet) => (pet.client_lname || '').toLowerCase());
    default:
      return petList;
  }
}
