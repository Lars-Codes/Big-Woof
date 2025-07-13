import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { removeHairLength, setLoading } from '../../../../state/pets/petsSlice';

export default function* deleteHairLength(action) {
  let hairLengthId, onSuccess, onError;

  // Extract callbacks and hairLengthId from payload
  if (action.payload.hair_length_id) {
    ({ hair_length_id: hairLengthId, onSuccess, onError } = action.payload);
  } else {
    ({ hairLengthId, onSuccess, onError } = action.payload);
  }

  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deleteHairLength', 'DELETE', {
      hair_length_id: hairLengthId,
    });

    if (res?.success) {
      yield put(removeHairLength(hairLengthId));

      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess, res);
      }
    } else {
      console.error('Failed to delete hair length:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }
    return res;
  } catch (error) {
    console.error('Error deleting hair length:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  } finally {
    yield put(setLoading(false));
  }
}
