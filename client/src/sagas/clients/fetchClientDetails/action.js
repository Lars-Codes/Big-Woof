import { createAction } from '@reduxjs/toolkit';

export const FETCH_CLIENT_DETAILS_ACTION_TYPE = 'saga/fetchClientDetails';
export const fetchClientDetailsAction = createAction(
  FETCH_CLIENT_DETAILS_ACTION_TYPE,
);
