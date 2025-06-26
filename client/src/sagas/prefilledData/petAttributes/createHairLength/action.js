import { createAction } from '@reduxjs/toolkit';

export const CREATE_HAIR_LENGTH_ACTION_TYPE = 'saga/createHairLength';
export const createHairLengthAction = createAction(
  CREATE_HAIR_LENGTH_ACTION_TYPE,
);
