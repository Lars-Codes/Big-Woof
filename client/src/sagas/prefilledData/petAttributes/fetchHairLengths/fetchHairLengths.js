import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { setHairLengths } from '../../../../state/pets/petsSlice';

export default function* fetchHairLengths() {
  try {
    const res = yield call(api, '/getHairLengths', 'GET');
    const hairLengths = res.data;
    yield put(setHairLengths(hairLengths));
  } catch (error) {
    console.error('Error fetching hair lengths:', error);
  }
}
