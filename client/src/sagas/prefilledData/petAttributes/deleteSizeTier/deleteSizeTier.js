import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { removeSizeTier, setLoading } from '../../../../state/pets/petsSlice';

export default function* deleteSizeTier(action) {
  const sizeTierId = action.payload;
  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deleteSizeTier', 'DELETE', {
      size_tier_id: sizeTierId,
    });
    if (res?.success) {
      yield put(removeSizeTier(sizeTierId));
    } else {
      console.error('Failed to delete size tier:', res);
    }
    return res;
  } catch (error) {
    console.error('Error deleting size tier:', error);
  } finally {
    yield put(setLoading(false));
  }
}
