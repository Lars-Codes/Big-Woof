import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setCreateClientResult,
  setLoading,
  addClient,
} from '../../../state/clients/clientsSlice';

export default function* createClient(action) {
  const { clientData } = action.payload;
  try {
    yield put(setLoading(true));
    const formData = new FormData();
    Object.entries(clientData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const res = yield call(api, '/createClient', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });
    if (res?.success) {
      yield put(addClient(res.client));
    }
    yield put(setCreateClientResult(res));
  } catch (error) {
    console.error('Error creating client:', error);
    yield put(
      setCreateClientResult({ success: 0, message: 'Error creating client' }),
    );
  } finally {
    yield put(setLoading(false));
  }
}
