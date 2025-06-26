import _ from 'lodash';

export default function filterPetList(petList, filterBy) {
  switch (filterBy) {
    case 'all':
      return petList;
    // breeds, etc...
    default:
      return _.filter(petList, (pet) => pet.type === filterBy);
  }
}
