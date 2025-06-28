import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { removePets, setLoading } from '../../../state/pets/petsSlice';
import processPetResultSet from '../processPetResultSet/processPetResultSet';
import processPetSearchResultSet from '../processPetSearchResultSet/processPetSearchResultSet';

export default function* deletePets(action) {
  let petIds, onSuccess, onError;

  if (Array.isArray(action.payload)) {
    petIds = action.payload;
    onSuccess = null;
    onError = null;
  } else {
    ({ petIds, onSuccess, onError } = action.payload);
  }

  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deletePet', 'DELETE', {
      petid_arr: petIds,
    });
    if (res?.success) {
      yield put(removePets(petIds));
      yield call(processPetResultSet);
      yield call(processPetSearchResultSet);
      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess);
      }
    } else {
      console.error('Failed to delete pet:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }
    return res;
  } catch (error) {
    console.error('Error deleting pet:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  } finally {
    yield put(setLoading(false));
  }
}
