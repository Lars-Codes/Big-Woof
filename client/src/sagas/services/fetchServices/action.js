import { createAction } from '@reduxjs/toolkit';

export const FETCH_SERVICES_ACTION_TYPE = 'saga/fetchServices';
export const fetchServicesAction = createAction(FETCH_SERVICES_ACTION_TYPE);
