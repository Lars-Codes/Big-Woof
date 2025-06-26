import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { removeBreed, setLoading } from '../../../../state/pets/petsSlice';

export default function* deleteBreed(action) {
  const breedId = action.payload;
  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deleteBreed', 'DELETE', {
      breed_id: breedId,
    });
    if (res?.success) {
      yield put(removeBreed(breedId));
    } else {
      console.error('Failed to delete breed:', res);
    }
    return res;
  } catch (error) {
    console.error('Error deleting breed:', error);
  } finally {
    yield put(setLoading(false));
  }
}
