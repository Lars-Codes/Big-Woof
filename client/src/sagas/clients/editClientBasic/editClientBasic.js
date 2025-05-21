import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setLoading,
  setUpdateClientResult,
  updateClient,
} from '../../../state/clients/clientsSlice';

export default function* editClientBasic(action) {
  const { clientData } = action.payload;
  try {
    yield put(setLoading(true));
    const formData = new FormData();
    Object.entries(clientData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const res = yield call(api, '/editClientBasicData', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });
    if (res?.success) {
      yield put(updateClient(res.client));
    }
    yield put(setUpdateClientResult(res));
  } catch (error) {
    console.error('Error editing client basic data:', error);
    yield put(
      setUpdateClientResult({
        success: 0,
        message: 'Error editing client basic data',
      }),
    );
  } finally {
    yield put(setLoading(false));
  }
}
