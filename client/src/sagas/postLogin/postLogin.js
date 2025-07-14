import { fork } from 'redux-saga/effects';

import fetchClients from '../clients/fetchClients/fetchClients';
import fetchEmployees from '../employees/fetchEmployees/fetchEmployees';
import fetchPets from '../pets/fetchPets/fetchPets';
import fetchBreeds from '../prefilledData/petAttributes/fetchBreeds/fetchBreeds';
import fetchCoatTypes from '../prefilledData/petAttributes/fetchCoatTypes/fetchCoatTypes';
import fetchHairLengths from '../prefilledData/petAttributes/fetchHairLengths/fetchHairLengths';
import fetchSizeTiers from '../prefilledData/petAttributes/fetchSizeTiers/fetchSizeTiers';

export default function* postLogin() {
  try {
    yield fork(fetchClients);
    yield fork(fetchPets);
    yield fork(fetchBreeds);
    yield fork(fetchCoatTypes);
    yield fork(fetchHairLengths);
    yield fork(fetchSizeTiers);
    yield fork(fetchEmployees);
  } catch (error) {
    console.error('Failed to post login:', error);
  }
}
