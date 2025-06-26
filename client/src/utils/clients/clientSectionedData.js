import { Pin } from 'lucide-react-native';
import React from 'react';

// Use a more efficient memoization approach
let lastClients = null;
let lastSortedBy = null;
let lastSortedDirection = null;
let cachedResult = null;

export const clientSectionedData = (clients, sortedBy, sortedDirection) => {
  // Quick cache check
  if (
    clients === lastClients &&
    sortedBy === lastSortedBy &&
    sortedDirection === lastSortedDirection &&
    cachedResult
  ) {
    return cachedResult;
  }

  if (!clients || clients.length === 0) {
    cachedResult = [];
    return cachedResult;
  }

  // Use Map for better performance than object
  const sectionMap = new Map();
  const favorites = [];
  const result = [];

  // Single pass through clients to separate favorites and group by letter
  for (let i = 0; i < clients.length; i++) {
    const client = clients[i];

    if (client.favorite) {
      favorites.push({ ...client, type: 'client' });
      continue;
    }

    const name = sortedBy === 'fname' ? client.fname : client.lname;
    const firstLetter = (name || '').charAt(0).toUpperCase();
    const letter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';

    if (!sectionMap.has(letter)) {
      sectionMap.set(letter, []);
    }
    sectionMap.get(letter).push({ ...client, type: 'client' });
  }

  // Add favorites section if there are any
  if (favorites.length > 0) {
    result.push({
      id: 'favorites-header',
      type: 'section-header',
      title: 'Pinned',
      icon: <Pin size={16} color="#000" fill="#999" />,
    });
    result.push(...favorites);
  }

  // Sort letters and add sections
  const sortedLetters = Array.from(sectionMap.keys()).sort((a, b) => {
    if (a === '#' && b === '#') return 0;
    if (a === '#') return sortedDirection === 'asc' ? 1 : -1;
    if (b === '#') return sortedDirection === 'asc' ? -1 : 1;

    return sortedDirection === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  });

  for (let i = 0; i < sortedLetters.length; i++) {
    const letter = sortedLetters[i];
    result.push({
      id: `section-${letter}`,
      type: 'section-header',
      title: letter,
    });
    result.push(...sectionMap.get(letter));
  }

  // Cache the result
  lastClients = clients;
  lastSortedBy = sortedBy;
  lastSortedDirection = sortedDirection;
  cachedResult = result;

  return result;
};
