import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { setCoatTypes } from '../../../../state/pets/petsSlice';

export default function* fetchCoatTypes() {
  try {
    const res = yield call(api, '/getCoatTypes', 'GET');
    const coatTypes = res.data;
    yield put(setCoatTypes(coatTypes));
  } catch (error) {
    console.error('Error fetching coat types:', error);
  }
}
