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
    if (sortedBy === 'name') {
      // Group by first letter of name
      const name = pet.name || '';
      const firstLetter = name.charAt(0).toUpperCase();
      sectionKey = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
    } else if (sortedBy === 'client_fname') {
      // Group by client first name
      sectionKey = pet.client_fname ? pet.client_fname[0].toUpperCase() : '#';
    } else if (sortedBy === 'client_lname') {
      // Group by client last name
      sectionKey = pet.client_lname ? pet.client_lname[0].toUpperCase() : '#';
    } else {
      // Group by breed (default behavior)
      sectionKey = pet.breed || 'Unknown Breed';
    }

    if (!sectionMap.has(sectionKey)) {
      sectionMap.set(sectionKey, []);
    }
    sectionMap.get(sectionKey).push({ ...pet, type: 'pet' });
  }

  // Sort sections
  const sortedSections = Array.from(sectionMap.keys()).sort((a, b) => {
    if (sortedBy === 'name') {
      // Handle alphabetical sorting with # at end
      if (a === '#' && b === '#') return 0;
      if (a === '#') return sortedDirection === 'asc' ? 1 : -1;
      if (b === '#') return sortedDirection === 'asc' ? -1 : 1;
      return sortedDirection === 'asc'
        ? a.localeCompare(b)
        : b.localeCompare(a);
    } else {
      // Handle breed sorting with "Unknown Breed" at end
      if (a === 'Unknown Breed' && b === 'Unknown Breed') return 0;
      if (a === 'Unknown Breed') return sortedDirection === 'asc' ? 1 : -1;
      if (b === 'Unknown Breed') return sortedDirection === 'asc' ? -1 : 1;
      return sortedDirection === 'asc'
        ? a.localeCompare(b)
        : b.localeCompare(a);
    }
  });

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
