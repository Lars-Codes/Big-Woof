import _ from 'lodash';

export default function searchPets(str, petsResultSet, sortedBy = null) {
  const searchStr = str.toLowerCase().trim();
  if (!searchStr) {
    return petsResultSet;
  }

  // Split search string into individual terms
  const searchTerms = searchStr.split(/\s+/);

  return _.chain(petsResultSet)
    .filter((pet) => {
      // Check if ALL search terms match somewhere in the pet data
      const allTermsMatch = searchTerms.every((term) => {
        // First check category match if sortedBy is specified
        if (sortedBy) {
          let categoryMatch = false;

          switch (sortedBy) {
            case 'name': {
              if (pet.name && pet.name.toLowerCase().indexOf(term) !== -1) {
                categoryMatch = true;
              }
              break;
            }
            case 'breed': {
              if (pet.breed && pet.breed.toLowerCase().indexOf(term) !== -1) {
                categoryMatch = true;
              }
              break;
            }
            case 'coat_type': {
              if (
                pet.coat_type &&
                pet.coat_type.toLowerCase().indexOf(term) !== -1
              ) {
                categoryMatch = true;
              }
              break;
            }
            case 'hair_length': {
              if (
                pet.hair_length &&
                pet.hair_length.toLowerCase().indexOf(term) !== -1
              ) {
                categoryMatch = true;
              }
              break;
            }
            case 'size_tier': {
              if (
                pet.size_tier &&
                pet.size_tier.toLowerCase().indexOf(term) !== -1
              ) {
                categoryMatch = true;
              }
              break;
            }
            // case 'age': {
            //   const age = pet.age || 0;
            //   const ageStr = age.toString();
            //   if (ageStr.indexOf(term) !== -1) {
            //     categoryMatch = true;
            //   }
            //   // Also search age range descriptions
            //   let ageRange = '';
            //   if (age === 0) ageRange = 'unknown age';
            //   else if (age < 1) ageRange = 'puppy';
            //   else if (age <= 3) ageRange = 'young';
            //   else if (age <= 7) ageRange = 'adult';
            //   else ageRange = 'senior';

            //   if (ageRange.indexOf(term) !== -1) {
            //     categoryMatch = true;
            //   }
            //   break;
            // }
            // case 'weight': {
            //   const weight = pet.weight || 0;
            //   const weightStr = weight.toString();
            //   if (weightStr.indexOf(term) !== -1) {
            //     categoryMatch = true;
            //   }
            //   // Also search weight range descriptions
            //   let weightRange = '';
            //   if (weight === 0) weightRange = 'unknown weight';
            //   else if (weight <= 10) weightRange = 'small';
            //   else if (weight <= 25) weightRange = 'medium';
            //   else if (weight <= 60) weightRange = 'large';
            //   else weightRange = 'extra large';

            //   if (weightRange.indexOf(term) !== -1) {
            //     categoryMatch = true;
            //   }
            //   break;
            // }
            case 'client_fname': {
              if (
                pet.client_fname &&
                pet.client_fname.toLowerCase().indexOf(term) !== -1
              ) {
                categoryMatch = true;
              }
              break;
            }
            case 'client_lname': {
              if (
                pet.client_lname &&
                pet.client_lname.toLowerCase().indexOf(term) !== -1
              ) {
                categoryMatch = true;
              }
              break;
            }
          }

          // If we found a category match for this term, return true
          if (categoryMatch) {
            return true;
          }
        }

        // Fallback: check if this term matches any field
        const termMatches = [
          // Name
          pet.name && pet.name.toLowerCase().indexOf(term) !== -1,
          // Client names
          pet.client_fname &&
            pet.client_fname.toLowerCase().indexOf(term) !== -1,
          pet.client_lname &&
            pet.client_lname.toLowerCase().indexOf(term) !== -1,
          // Pet attributes
          pet.breed && pet.breed.toLowerCase().indexOf(term) !== -1,
          pet.coat_type && pet.coat_type.toLowerCase().indexOf(term) !== -1,
          pet.hair_length && pet.hair_length.toLowerCase().indexOf(term) !== -1,
          pet.size_tier && pet.size_tier.toLowerCase().indexOf(term) !== -1,
          // Age ranges
          (() => {
            const age = pet.age || 0;
            if (age.toString().indexOf(term) !== -1) return true;
            let ageRange = '';
            if (age === 0) ageRange = 'unknown age';
            else if (age < 1) ageRange = 'puppy';
            else if (age <= 3) ageRange = 'young';
            else if (age <= 7) ageRange = 'adult';
            else ageRange = 'senior';
            return ageRange.indexOf(term) !== -1;
          })(),
          // Weight ranges
          (() => {
            const weight = pet.weight || 0;
            if (weight.toString().indexOf(term) !== -1) return true;
            let weightRange = '';
            if (weight === 0) weightRange = 'unknown weight';
            else if (weight <= 10) weightRange = 'small';
            else if (weight <= 25) weightRange = 'medium';
            else if (weight <= 60) weightRange = 'large';
            else weightRange = 'extra large';
            return weightRange.indexOf(term) !== -1;
          })(),
          // Full name search
          (() => {
            if (pet.name || pet.client_fname || pet.client_lname) {
              const fullName =
                `${pet.name || ''} ${pet.client_fname || ''} ${pet.client_lname || ''}`
                  .trim()
                  .toLowerCase();
              return fullName.indexOf(term) !== -1;
            }
            return false;
          })(),
        ];

        // Return true if ANY field matches this term
        return termMatches.some((match) => match);
      });

      return allTermsMatch;
    })
    .value();
}
