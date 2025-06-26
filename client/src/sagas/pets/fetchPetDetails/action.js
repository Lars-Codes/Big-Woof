import { createAction } from '@reduxjs/toolkit';

export const FETCH_PET_DETAILS_ACTION_TYPE = 'saga/fetchPetDetails';
export const fetchPetDetailsAction = createAction(
  FETCH_PET_DETAILS_ACTION_TYPE,
);
