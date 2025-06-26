import { put, select } from 'redux-saga/effects';
import {
  selectPetsResultSet,
  setSearchedResultSet,
} from '../../../state/pets/petsSlice';
import searchPets from '../../../utils/pets/searchPets';

export default function* processPetSearchedResultSet({ payload: searchStr }) {
  const petsResultSet = yield select(selectPetsResultSet);
  const searchResults = searchPets(searchStr, petsResultSet);

  yield put(setSearchedResultSet(searchResults));
}
