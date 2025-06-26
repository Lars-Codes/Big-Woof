import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setPetDetails,
  setLoading,
} from '../../../state/petDetails/petDetailsSlice';

export default function* fetchPetDetails(action) {
  const petId = action.payload;
  try {
    yield put(setLoading(true));
    const res = yield call(api, `/getPetMetadata?pet_id=${petId}`, 'GET');
    const petDetails = res.data;
    yield put(setPetDetails(petDetails));
  } catch (error) {
    console.error('Error fetching pet metadata:', error);
  } finally {
    yield put(setLoading(false));
  }
}
