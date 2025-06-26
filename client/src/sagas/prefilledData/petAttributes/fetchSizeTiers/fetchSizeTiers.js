import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { setSizeTiers } from '../../../../state/pets/petsSlice';

export default function* fetchSizeTiers() {
  try {
    const res = yield call(api, '/getSizeTiers', 'GET');
    const sizeTiers = res.data;
    yield put(setSizeTiers(sizeTiers));
  } catch (error) {
    console.error('Error fetching coat types:', error);
  }
}
