import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { removeCoatType, setLoading } from '../../../../state/pets/petsSlice';

export default function* deleteCoatType(action) {
  const coatTypeId = action.payload;
  try {
    yield put(setLoading(true));
    const res = yield call(api, '/deleteCoatType', 'DELETE', {
      coat_type_id: coatTypeId,
    });
    if (res?.success) {
      yield put(removeCoatType(coatTypeId));
    } else {
      console.error('Failed to delete coat type:', res);
    }
    return res;
  } catch (error) {
    console.error('Error deleting coat type:', error);
  } finally {
    yield put(setLoading(false));
  }
}
