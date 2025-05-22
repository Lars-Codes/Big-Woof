import { createAction } from '@reduxjs/toolkit';

export const CLIENTS_SORTED_DIRECTION_ACTION_TYPE =
  'saga/clientsSortedDirection';
export const clientsSortedDirectionAction = createAction(
  CLIENTS_SORTED_DIRECTION_ACTION_TYPE,
);
