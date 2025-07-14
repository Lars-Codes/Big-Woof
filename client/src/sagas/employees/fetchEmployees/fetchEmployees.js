import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setLoading,
  setEmployees,
} from '../../../state/employees/employeesSlice';

export default function* fetchEmployees() {
  try {
    yield put(setLoading(true));
    const res = yield call(api, '/getAllEmployees', 'GET');
    if (res?.success === 1) {
      const employees = res.data;
      yield put(setEmployees(employees));
    } else {
      console.error('Failed to fetch employees:', res);
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
  } finally {
    yield put(setLoading(false));
  }
}
