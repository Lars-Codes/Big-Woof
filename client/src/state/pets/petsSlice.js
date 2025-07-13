import { createSelector, createSlice } from '@reduxjs/toolkit';

export const petsSlice = createSlice({
  name: 'pets',
  initialState: {
    loading: true,
    pets: [],
    filteredBy: 'all',
    filteredPets: [],
    sortedBy: 'breed',
    sortedDirection: 'asc',
    searchBy: '',
    petsResultSet: [],
    searchResultSet: [],
    searchedResultSet: null,

    deleteMode: false,

    breeds: [],
    coatTypes: [],
    sizeTiers: [],
    hairLengths: [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPets: (state, action) => {
      state.pets = action.payload.map((pet) => ({
        ...pet,
        isSelected: false,
      }));
    },
    removePets: (state, action) => {
      const petIdsToRemove = new Set(action.payload);

      // Remove from all arrays using the same pattern as updatePetFavorite
      [
        state.pets,
        state.petsResultSet,
        state.searchResultSet,
        state.searchedResultSet,
      ].forEach((array) => {
        if (array) {
          // Filter out pets that should be removed
          const filteredArray = array.filter(
            (pet) => !petIdsToRemove.has(pet.pet_id),
          );

          // Update the array reference
          if (array === state.pets) {
            state.pets = filteredArray;
          } else if (array === state.petsResultSet) {
            state.petsResultSet = filteredArray;
          } else if (array === state.searchResultSet) {
            state.searchResultSet = filteredArray;
          } else if (array === state.searchedResultSet) {
            state.searchedResultSet = filteredArray;
          }
        }
      });
    },
    setFilteredBy: (state, action) => {
      state.filteredBy = action.payload;
    },
    setFilteredPets: (state, action) => {
      state.filteredPets = action.payload;
    },
    setSortedBy: (state, action) => {
      state.sortedBy = action.payload;
    },
    setSortedDirection: (state, action) => {
      state.sortedDirection = action.payload;
    },
    setSearchBy: (state, action) => {
      state.searchBy = action.payload;
    },
    setPetsResultSet: (state, action) => {
      state.petsResultSet = action.payload.map((pet) => ({
        ...pet,
        isSelected: pet.isSelected || false,
      }));
    },
    setSearchResultSet: (state, action) => {
      state.searchResultSet = action.payload.map((pet) => ({
        ...pet,
        isSelected: pet.isSelected || false,
      }));
    },
    setSearchedResultSet: (state, action) => {
      if (action.payload) {
        state.searchedResultSet = action.payload.map((pet) => ({
          ...pet,
          isSelected: pet.isSelected || false,
        }));
      } else {
        state.searchedResultSet = action.payload;
      }
    },
    setDeleteMode: (state, action) => {
      state.deleteMode = action.payload;
      if (!action.payload) {
        // Reset selection when exiting delete mode
        state.pets.forEach((pet) => {
          pet.isSelected = false;
        });
        state.petsResultSet.forEach((pet) => {
          pet.isSelected = false;
        });
        if (state.searchResultSet) {
          state.searchResultSet.forEach((pet) => {
            pet.isSelected = false;
          });
        }
        if (state.searchedResultSet) {
          state.searchedResultSet.forEach((pet) => {
            pet.isSelected = false;
          });
        }
      }
    },
    togglePetSelection: (state, action) => {
      const petId = action.payload;

      const mainPet = state.pets.find((pet) => pet.pet_id === petId);
      if (mainPet) {
        mainPet.isSelected = !mainPet.isSelected;

        const resultPet = state.petsResultSet.find(
          (pet) => pet.pet_id === petId,
        );
        if (resultPet) {
          resultPet.isSelected = mainPet.isSelected;
        }

        if (state.searchResultSet) {
          const searchPet = state.searchResultSet.find(
            (pet) => pet.pet_id === petId,
          );
          if (searchPet) {
            searchPet.isSelected = mainPet.isSelected;
          }
        }
      }
    },
    selectAllPets: (state) => {
      // Batch update for better performance
      const shouldSelect = true;

      state.pets.forEach((pet) => {
        pet.isSelected = shouldSelect;
      });
      state.petsResultSet.forEach((pet) => {
        pet.isSelected = shouldSelect;
      });

      if (state.searchResultSet) {
        state.searchResultSet.forEach((pet) => {
          pet.isSelected = shouldSelect;
        });
      }
    },
    deselectAllPets: (state) => {
      // Batch update for better performance
      const shouldSelect = false;

      state.pets.forEach((pet) => {
        pet.isSelected = shouldSelect;
      });
      state.petsResultSet.forEach((pet) => {
        pet.isSelected = shouldSelect;
      });

      if (state.searchResultSet) {
        state.searchResultSet.forEach((pet) => {
          pet.isSelected = shouldSelect;
        });
      }
    },
    batchUpdateSelection: (state, action) => {
      const { petIds, isSelected } = action.payload;

      // Create a Set for O(1) lookups
      const petIdSet = new Set(petIds);

      // Update all arrays efficiently
      [
        state.pets,
        state.petsResultSet,
        state.searchResultSet,
        state.searchedResultSet,
      ].forEach((array) => {
        if (array) {
          array.forEach((pet) => {
            if (petIdSet.has(pet.pet_id)) {
              pet.isSelected = isSelected;
            }
          });
        }
      });
    },
    updatePetDeceased: (state, action) => {
      const { petId, isDeceased } = action.payload;
      [
        state.pets,
        state.petsResultSet,
        state.searchResultSet,
        state.searchedResultSet,
      ].forEach((array) => {
        if (array) {
          const pet = array.find((pet) => pet.pet_id === petId);
          if (pet) {
            pet.deceased = isDeceased ? 1 : 0;
          }
        }
      });
    },
    setBreeds: (state, action) => {
      state.breeds = action.payload;
    },
    removeBreed: (state, action) => {
      const breedId = action.payload;
      state.breeds = state.breeds.filter((breed) => breed.breed_id !== breedId);
    },
    setCoatTypes: (state, action) => {
      state.coatTypes = action.payload;
    },
    removeCoatType: (state, action) => {
      const coatTypeId = action.payload;
      state.coatTypes = state.coatTypes.filter(
        (coatType) => coatType.coat_type_id !== coatTypeId,
      );
    },
    setSizeTiers: (state, action) => {
      state.sizeTiers = action.payload;
    },
    removeSizeTier: (state, action) => {
      const sizeTierId = action.payload;
      state.sizeTiers = state.sizeTiers.filter(
        (sizeTier) => sizeTier.size_tier_id !== sizeTierId,
      );
    },
    setHairLengths: (state, action) => {
      state.hairLengths = action.payload;
    },
    removeHairLength: (state, action) => {
      const hairLengthId = action.payload;
      state.hairLengths = state.hairLengths.filter(
        (hairLength) => hairLength.hair_length_id !== hairLengthId,
      );
    },
  },
});

export const {
  setLoading,
  setPets,
  removePets,
  setFilteredBy,
  setFilteredPets,
  setSortedBy,
  setSortedDirection,
  setSearchBy,
  setPetsResultSet,
  setSearchResultSet,
  setSearchedResultSet,
  setDeleteMode,
  togglePetSelection,
  selectAllPets,
  deselectAllPets,
  batchUpdateSelection,
  updatePetDeceased,
  setBreeds,
  removeBreed,
  setCoatTypes,
  removeCoatType,
  setSizeTiers,
  removeSizeTier,
  setHairLengths,
  removeHairLength,
} = petsSlice.actions;

export const selectLoading = (state) => state.pets.loading;
export const selectPets = (state) => state.pets.pets;
export const selectFilteredBy = (state) => state.pets.filteredBy;
export const selectFilteredPets = (state) => state.pets.filteredPets;
export const selectSortedBy = (state) => state.pets.sortedBy;
export const selectSortedDirection = (state) => state.pets.sortedDirection;
export const selectSearchBy = (state) => state.pets.searchBy;
export const selectPetsResultSet = (state) => state.pets.petsResultSet;
export const selectSearchResultSet = (state) => state.pets.searchResultSet;
export const selectSearchedResultSet = (state) => state.pets.searchedResultSet;
export const selectDeleteMode = (state) => state.pets.deleteMode;
export const selectBreeds = (state) => state.pets.breeds;
export const selectCoatTypes = (state) => state.pets.coatTypes;
export const selectSizeTiers = (state) => state.pets.sizeTiers;
export const selectHairLengths = (state) => state.pets.hairLengths;

export const selectSelectedPets = createSelector(
  [(state) => state.pets.petsResultSet],
  (petsResultSet) => {
    return petsResultSet.filter((pet) => pet.isSelected === true);
  },
);

export const selectSelectedPetsCount = createSelector(
  [selectSelectedPets],
  (selectedPets) => selectedPets.length,
);

export const selectIsAllPetsSelected = createSelector(
  [(state) => state.pets.petsResultSet],
  (resultSet) => {
    return (
      resultSet.length > 0 && resultSet.every((pet) => pet.isSelected === true)
    );
  },
);

export const selectSelectedPetIds = createSelector(
  [(state) => state.pets.petsResultSet],
  (petsResultSet) => {
    return petsResultSet
      .filter((pet) => pet.isSelected === true)
      .map((pet) => pet.pet_id);
  },
);

export default petsSlice.reducer;
