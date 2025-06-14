import { createAction } from '@reduxjs/toolkit';

export const PROCESSED_SEARCHED_RESULT_SET_ACTION_TYPE =
  'saga/processSearchedResultSet';
export const processSearchedResultSetAction = createAction(
  PROCESSED_SEARCHED_RESULT_SET_ACTION_TYPE,
);
