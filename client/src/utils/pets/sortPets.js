import _ from 'lodash';

export default function sortPets(petList, sortBy) {
  switch (sortBy) {
    case 'name':
      return _.sortBy(petList, (pet) => (pet.name || '').toLowerCase());
    case 'breed':
      return _.sortBy(petList, (pet) =>
        (pet.breed || 'Unknown Breed').toLowerCase(),
      );
    case 'client_fname':
      return _.sortBy(petList, (pet) => (pet.client_fname || '').toLowerCase());
    case 'client_lname':
      return _.sortBy(petList, (pet) => (pet.client_lname || '').toLowerCase());
    default:
      return petList;
  }
}
