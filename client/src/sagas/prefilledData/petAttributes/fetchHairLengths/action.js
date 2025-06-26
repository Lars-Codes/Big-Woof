import { createAction } from '@reduxjs/toolkit';

export const FETCH_HAIR_LENGTHS_ACTION_TYPE = 'saga/fetchHairLengths';
export const fetchHairLengthsAction = createAction(
  FETCH_HAIR_LENGTHS_ACTION_TYPE,
);
