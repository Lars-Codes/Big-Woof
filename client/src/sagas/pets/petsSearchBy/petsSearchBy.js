import { call, put, select } from 'redux-saga/effects';
import { selectPets, setSearchBy } from '../../../state/pets/petsSlice';
import processPetResultSet from '../processPetResultSet/processPetResultSet';
import processPetSearchResultSet from '../processPetSearchResultSet/processPetSearchResultSet';

export default function* petsSearchBy({ payload: searchBy }) {
  yield put(setSearchBy(searchBy));

  const pets = yield select(selectPets);

  if (pets) {
    yield call(processPetResultSet);
    yield call(processPetSearchResultSet);
  }
}
