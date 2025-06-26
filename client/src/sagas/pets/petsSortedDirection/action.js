import { createAction } from '@reduxjs/toolkit';

export const PETS_SORTED_DIRECTION_ACTION_TYPE = 'saga/petsSortedDirection';
export const petsSortedDirectionAction = createAction(
  PETS_SORTED_DIRECTION_ACTION_TYPE,
);
