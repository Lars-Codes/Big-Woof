import { put, select } from 'redux-saga/effects';
import {
  selectPetsResultSet,
  setSearchedResultSet,
  selectSortedBy,
} from '../../../state/pets/petsSlice';
import searchPets from '../../../utils/pets/searchPets';

export default function* processPetSearchedResultSet({ payload: searchStr }) {
  const petsResultSet = yield select(selectPetsResultSet);
  const sortedBy = yield select(selectSortedBy);
  const searchResults = searchPets(searchStr, petsResultSet, sortedBy);

  yield put(setSearchedResultSet(searchResults));
}
