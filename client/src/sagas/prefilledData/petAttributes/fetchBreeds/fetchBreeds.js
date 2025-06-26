import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { setBreeds } from '../../../../state/pets/petsSlice';

export default function* fetchBreeds() {
  try {
    const res = yield call(api, '/getBreeds', 'GET');
    const breeds = res.data;
    yield put(setBreeds(breeds));
  } catch (error) {
    console.error('Error fetching breeds:', error);
  }
}
