import { call, put, fork } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setPets, setLoading } from '../../../state/pets/petsSlice';
import processPetResultSet from '../processPetResultSet/processPetResultSet';
import processPetSearchResultSet from '../processPetSearchResultSet/processPetSearchResultSet';

export default function* fetchPets() {
  try {
    yield put(setLoading(true));
    const res = yield call(api, '/getAllPets', 'GET');
    const pets = res.data;
    yield put(setPets(pets));
    yield call(processPetResultSet);
    yield fork(processPetSearchResultSet);
  } catch (error) {
    console.error('Error fetching pets:', error);
  } finally {
    yield put(setLoading(false));
  }
}
