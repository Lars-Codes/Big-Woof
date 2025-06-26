import { createAction } from '@reduxjs/toolkit';

export const PROCESS_CLIENT_SEARCHED_RESULT_SET_ACTION_TYPE =
  'saga/processClientSearchedResultSetAction';
export const processClientSearchedResultSetAction = createAction(
  PROCESS_CLIENT_SEARCHED_RESULT_SET_ACTION_TYPE,
);
