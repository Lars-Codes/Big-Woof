import { call, put, select } from 'redux-saga/effects';
import { setItem } from '../../../services/storage';
import { selectPets, setSortedDirection } from '../../../state/pets/petsSlice';
import processPetResultSet from '../processPetResultSet/processPetResultSet';
import processPetSearchResultSet from '../processPetSearchResultSet/processPetSearchResultSet';

export default function* petsSortedDirection({ payload: direction }) {
  // will eventually use user id here
  setItem('sorted-direction', direction);

  yield put(setSortedDirection(direction));

  const pets = yield select(selectPets);
  if (pets) {
    yield call(processPetResultSet);
    yield call(processPetSearchResultSet);
  }
}
