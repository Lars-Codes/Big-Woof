import filterPetList from './filterPetList';
import sortPets from './sortPets';

export default function getPetResultSet(
  petList,
  filterBy,
  sortBy,
  sortedDirection,
) {
  let petsList = filterPetList(petList, filterBy);

  petsList = sortPets(petsList, sortBy);

  if (sortedDirection === 'desc') {
    // petsList.reverse();
    petsList = petsList.slice().reverse(); // Create a new array to avoid mutating the original
  }

  return petsList;
}
