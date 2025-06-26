import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { removeHairLength, setLoading } from '../../../../state/pets/petsSlice';

export default function* deleteHairLength(action) {
  const hairLengthId = action.payload;
  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deleteHairLength', 'DELETE', {
      hair_length_id: hairLengthId,
    });
    if (res?.success) {
      yield put(removeHairLength(hairLengthId));
    } else {
      console.error('Failed to delete hair length:', res);
    }
    return res;
  } catch (error) {
    console.error('Error deleting hair length:', error);
  } finally {
    yield put(setLoading(false));
  }
}
