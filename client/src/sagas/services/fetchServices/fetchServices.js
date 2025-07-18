import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setServices,
  setLoading,
  setAppointmentFees,
  setStandaloneAdditions,
} from '../../../state/services/servicesSlice';

export default function* fetchServices() {
  try {
    yield put(setLoading(true));
    const res = yield call(api, '/getAllServices', 'GET');
    const services = res.data?.services || [];
    const appointmentFees = res.data?.appointment_fees || [];
    const standaloneAdditions = res.data?.standalone_additions || [];
    yield put(setServices(services));
    yield put(setAppointmentFees(appointmentFees));
    yield put(setStandaloneAdditions(standaloneAdditions));
  } catch (error) {
    console.error('Error fetching services:', error);
  } finally {
    yield put(setLoading(false));
  }
}
