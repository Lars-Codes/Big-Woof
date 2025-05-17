import { createAction } from '@reduxjs/toolkit';

export const CLIENTS_SORTED_DIRECTION_ACTION_TYPE =
  'saga/clientsSortedDirection';
export const clientsSortedDirection = createAction(
  CLIENTS_SORTED_DIRECTION_ACTION_TYPE,
);
