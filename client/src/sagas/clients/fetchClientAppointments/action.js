import { createAction } from '@reduxjs/toolkit';

export const FETCH_CLIENT_APPOINTMENTS_ACTION_TYPE =
  'saga/fetchClientAppointments';
export const fetchClientAppointmentsAction = createAction(
  FETCH_CLIENT_APPOINTMENTS_ACTION_TYPE,
);
