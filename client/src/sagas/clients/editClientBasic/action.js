import { createAction } from '@reduxjs/toolkit';

export const EDIT_CLIENT_BASIC_ACTION_TYPE = 'saga/editClientBasic';
export const editClientBasicAction = createAction(
  EDIT_CLIENT_BASIC_ACTION_TYPE,
);
