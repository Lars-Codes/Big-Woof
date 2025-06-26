import { createAction } from '@reduxjs/toolkit';

export const PROCESS_PET_SEARCHED_RESULT_SET_ACTION_TYPE =
  'saga/processPetSearchedResultSetAction';
export const processPetSearchedResultSetAction = createAction(
  PROCESS_PET_SEARCHED_RESULT_SET_ACTION_TYPE,
);
