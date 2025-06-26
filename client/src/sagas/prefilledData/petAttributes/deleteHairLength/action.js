import { createAction } from '@reduxjs/toolkit';

export const DELETE_HAIR_LENGTH_ACTION_TYPE = 'saga/deleteHairLength';
export const deleteHairLengthAction = createAction(
  DELETE_HAIR_LENGTH_ACTION_TYPE,
);
