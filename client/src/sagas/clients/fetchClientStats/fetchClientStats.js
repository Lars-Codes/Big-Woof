import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setClientStats,
  setLoading,
} from '../../../state/clientDetails/clientDetailsSlice';

export default function* fetchClientStats(action) {
  const clientId = action.payload;
  try {
    yield put(setLoading(true));
    const res = yield call(
      api,
      `/getCostAndTimeStatsMetadata?client_id=${clientId}`,
      'GET',
    );
    const clientStats = res.data;
    yield put(setClientStats(clientStats));
  } catch (error) {
    console.error('Error fetching client stats:', error);
  } finally {
    yield put(setLoading(false));
  }
}
