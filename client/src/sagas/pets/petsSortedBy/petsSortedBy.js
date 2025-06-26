import { call, put, select } from 'redux-saga/effects';
import { setItem } from '../../../services/storage';
import { selectPets, setSortedBy } from '../../../state/pets/petsSlice';
import processPetResultSet from '../processPetResultSet/processPetResultSet';
import processPetSearchResultSet from '../processPetSearchResultSet/processPetSearchResultSet';

export default function* petsSortedBy({ payload: sortBy }) {
  // will eventually use user id here
  setItem('sorted-by', sortBy);

  yield put(setSortedBy(sortBy));

  const pets = yield select(selectPets);
  if (pets) {
    yield call(processPetResultSet);
    yield call(processPetSearchResultSet);
  }
}
