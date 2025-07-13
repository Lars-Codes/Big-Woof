import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { removeCoatType, setLoading } from '../../../../state/pets/petsSlice';

export default function* deleteCoatType(action) {
  let coatTypeId, onSuccess, onError;

  // Extract callbacks and coatTypeId from payload
  if (action.payload.coat_type_id) {
    ({ coat_type_id: coatTypeId, onSuccess, onError } = action.payload);
  } else {
    ({ coatTypeId, onSuccess, onError } = action.payload);
  }

  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deleteCoatType', 'DELETE', {
      coat_type_id: coatTypeId,
    });

    if (res?.success) {
      yield put(removeCoatType(coatTypeId));

      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess, res);
      }
    } else {
      console.error('Failed to delete coat type:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }
    return res;
  } catch (error) {
    console.error('Error deleting coat type:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  } finally {
    yield put(setLoading(false));
  }
}
