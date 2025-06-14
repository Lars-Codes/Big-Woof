import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setClientAppointments,
  setLoading,
} from '../../../state/clientDetails/clientDetailsSlice';

export default function* fetchClientAppointments(action) {
  const clientId = action.payload;
  try {
    yield put(setLoading(true));
    const res = yield call(
      api,
      `/getAppointmentMetadata?client_id=${clientId}`,
      'GET',
    );
    const clientAppointments = res.data;
    yield put(setClientAppointments(clientAppointments));
  } catch (error) {
    console.error('Error fetching client appointments:', error);
  } finally {
    yield put(setLoading(false));
  }
}
