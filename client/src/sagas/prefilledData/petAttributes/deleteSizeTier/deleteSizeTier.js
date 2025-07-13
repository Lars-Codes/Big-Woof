import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { removeSizeTier, setLoading } from '../../../../state/pets/petsSlice';

export default function* deleteSizeTier(action) {
  let sizeTierId, onSuccess, onError;

  // Extract callbacks and sizeTierId from payload
  if (action.payload.size_tier_id) {
    ({ size_tier_id: sizeTierId, onSuccess, onError } = action.payload);
  } else {
    ({ sizeTierId, onSuccess, onError } = action.payload);
  }

  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deleteSizeTier', 'DELETE', {
      size_tier_id: sizeTierId,
    });

    if (res?.success) {
      yield put(removeSizeTier(sizeTierId));

      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess, res);
      }
    } else {
      console.error('Failed to delete size tier:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }
    return res;
  } catch (error) {
    console.error('Error deleting size tier:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  } finally {
    yield put(setLoading(false));
  }
}
