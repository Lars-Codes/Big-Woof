import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { removeBreed, setLoading } from '../../../../state/pets/petsSlice';

export default function* deleteBreed(action) {
  let breedId, onSuccess, onError;

  // Extract callbacks and breedId from payload
  if (action.payload.breed_id) {
    ({ breed_id: breedId, onSuccess, onError } = action.payload);
  } else {
    ({ breedId, onSuccess, onError } = action.payload);
  }

  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deleteBreed', 'DELETE', {
      breed_id: breedId,
    });

    if (res?.success) {
      yield put(removeBreed(breedId));

      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess, res);
      }
    } else {
      console.error('Failed to delete breed:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }
    return res;
  } catch (error) {
    console.error('Error deleting breed:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  } finally {
    yield put(setLoading(false));
  }
}
