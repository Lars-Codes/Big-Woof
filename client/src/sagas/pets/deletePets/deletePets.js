import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { removePets, setLoading } from '../../../state/pets/petsSlice';
import processPetResultSet from '../processPetResultSet/processPetResultSet';
import processPetSearchResultSet from '../processPetSearchResultSet/processPetSearchResultSet';

export default function* deletePets(action) {
  const petIds = action.payload;
  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deletePet', 'DELETE', {
      petid_arr: petIds,
    });
    if (res?.success) {
      yield put(removePets(petIds));
      yield call(processPetResultSet);
      yield call(processPetSearchResultSet);
    } else {
      console.error('Failed to delete pet:', res);
    }
    return res;
  } catch (error) {
    console.error('Error deleting pet:', error);
  } finally {
    yield put(setLoading(false));
  }
}
