import _ from 'lodash';

export default function searchPets(str, petsResultSet) {
  const searchStr = str.toLowerCase().trim();
  if (!searchStr) {
    return petsResultSet;
  }

  return _.chain(petsResultSet)
    .filter((pet) => {
      if (pet.name && pet.name.toLowerCase().indexOf(searchStr) !== -1) {
        return true;
      }
      if (
        pet.client_fname &&
        pet.client_fname.toLowerCase().indexOf(searchStr) !== -1
      ) {
        return true;
      }
      if (
        pet.client_lname &&
        pet.client_lname.toLowerCase().indexOf(searchStr) !== -1
      ) {
        return true;
      }
      if (pet.name || pet.client_fname || pet.client_lname) {
        const fullName =
          `${pet.name || ''} ${pet.client_fname || ''} ${pet.client_lname || ''}`
            .trim()
            .toLowerCase();
        if (fullName.indexOf(searchStr) !== -1) {
          return true;
        }
      }
    })
    .value();
}
