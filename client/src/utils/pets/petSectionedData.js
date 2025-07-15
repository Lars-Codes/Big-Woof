// Use a more efficient memoization approach
let lastPets = null;
let lastSortedBy = null;
let lastSortedDirection = null;
let cachedResult = null;

export const petSectionedData = (pets, sortedBy, sortedDirection) => {
  // Quick cache check
  if (
    pets === lastPets &&
    sortedBy === lastSortedBy &&
    sortedDirection === lastSortedDirection &&
    cachedResult
  ) {
    return cachedResult;
  }

  if (!pets || pets.length === 0) {
    cachedResult = [];
    return cachedResult;
  }

  const sectionMap = new Map();
  const result = [];

  // Group pets based on sortedBy parameter
  for (let i = 0; i < pets.length; i++) {
    const pet = pets[i];

    let sectionKey;
    switch (sortedBy) {
      case 'name': {
        // Group by first letter of name
        const name = pet.name || '';
        const firstLetter = name.charAt(0).toUpperCase();
        sectionKey = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
        break;
      }

      case 'breed':
        // Group by breed
        sectionKey = pet.breed || 'Unknown Breed';
        break;

      case 'coat_type':
        // Group by coat type
        sectionKey = pet.coat_type || 'Unknown Coat Type';
        break;

      case 'hair_length':
        // Group by hair length
        sectionKey = pet.hair_length || 'Unknown Hair Length';
        break;

      case 'size_tier':
        // Group by size tier
        sectionKey = pet.size_tier || 'Unknown Size Tier';
        break;

      case 'age': {
        // Group by age ranges
        const age = pet.age || 0;
        if (age === 0) sectionKey = 'Unknown Age';
        else if (age < 1) sectionKey = 'Puppy (< 1 year)';
        else if (age <= 3) sectionKey = 'Young (1-3 years)';
        else if (age <= 7) sectionKey = 'Adult (4-7 years)';
        else sectionKey = 'Senior (8+ years)';
        break;
      }

      case 'weight': {
        // Group by weight ranges
        const weight = pet.weight || 0;
        if (weight === 0) sectionKey = 'Unknown Weight';
        else if (weight <= 10) sectionKey = 'Small (≤ 10 lbs)';
        else if (weight <= 25) sectionKey = 'Medium (11-25 lbs)';
        else if (weight <= 60) sectionKey = 'Large (26-60 lbs)';
        else sectionKey = 'Extra Large (61+ lbs)';
        break;
      }

      case 'client_fname':
        // Group by client first name
        sectionKey = pet.client_fname ? pet.client_fname[0].toUpperCase() : '#';
        break;

      case 'client_lname':
        // Group by client last name
        sectionKey = pet.client_lname ? pet.client_lname[0].toUpperCase() : '#';
        break;

      default:
        // Default to breed grouping
        sectionKey = pet.breed || 'Unknown Breed';
        break;
    }

    if (!sectionMap.has(sectionKey)) {
      sectionMap.set(sectionKey, []);
    }
    sectionMap.get(sectionKey).push({ ...pet, type: 'pet' });
  }

  // Sort sections based on the sort type
  const sortedSections = Array.from(sectionMap.keys()).sort((a, b) => {
    // Handle alphabetical sorts (name, client names)
    if (['name', 'client_fname', 'client_lname'].includes(sortedBy)) {
      if (a === '#' && b === '#') return 0;
      if (a === '#') return sortedDirection === 'asc' ? 1 : -1;
      if (b === '#') return sortedDirection === 'asc' ? -1 : 1;
      return sortedDirection === 'asc'
        ? a.localeCompare(b)
        : b.localeCompare(a);
    }

    // Handle age ranges with logical order
    if (sortedBy === 'age') {
      const ageOrder = [
        'Puppy (< 1 year)',
        'Young (1-3 years)',
        'Adult (4-7 years)',
        'Senior (8+ years)',
        'Unknown Age',
      ];
      const aIndex = ageOrder.indexOf(a);
      const bIndex = ageOrder.indexOf(b);
      return sortedDirection === 'asc' ? aIndex - bIndex : bIndex - aIndex;
    }

    // Handle weight ranges with logical order
    if (sortedBy === 'weight') {
      const weightOrder = [
        'Small (≤ 10 lbs)',
        'Medium (11-25 lbs)',
        'Large (26-60 lbs)',
        'Extra Large (61+ lbs)',
        'Unknown Weight',
      ];
      const aIndex = weightOrder.indexOf(a);
      const bIndex = weightOrder.indexOf(b);
      return sortedDirection === 'asc' ? aIndex - bIndex : bIndex - aIndex;
    }

    // Handle other categories (breed, coat_type, hair_length, size_tier)
    const unknownValues = [
      'Unknown Breed',
      'Unknown Coat Type',
      'Unknown Hair Length',
      'Unknown Size Tier',
    ];

    const aIsUnknown = unknownValues.includes(a);
    const bIsUnknown = unknownValues.includes(b);

    if (aIsUnknown && bIsUnknown) return 0;
    if (aIsUnknown) return sortedDirection === 'asc' ? 1 : -1;
    if (bIsUnknown) return sortedDirection === 'asc' ? -1 : 1;

    return sortedDirection === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  });

  // Build the final result with sections and pets
  for (let i = 0; i < sortedSections.length; i++) {
    const section = sortedSections[i];
    result.push({
      id: `section-${section}`,
      type: 'section-header',
      title: section,
    });
    result.push(...sectionMap.get(section));
  }

  // Cache the result
  lastPets = pets;
  lastSortedBy = sortedBy;
  lastSortedDirection = sortedDirection;
  cachedResult = result;

  return result;
};
