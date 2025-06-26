import { put, call, select } from 'redux-saga/effects';
import * as petState from '../../../state/pets/petsSlice';
import getPetResultSet from '../../../utils/pets/getPetResultSet';

export default function* processPetResultSet(updateLoading = false) {
  const petsArr = yield select(petState.selectPets);
  const filteredBy = yield select(petState.selectFilteredBy);
  const sortedBy = yield select(petState.selectSortedBy);
  const sortedDirection = yield select(petState.selectSortedDirection);

  const petsList = yield call(
    getPetResultSet,
    petsArr,
    filteredBy,
    sortedBy,
    sortedDirection,
  );

  // dispatch result set
  yield put(petState.setPetsResultSet(petsList));

  if (updateLoading) {
    yield put(petState.setLoading(false));
  }
}
