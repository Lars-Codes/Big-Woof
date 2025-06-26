import { createAction } from '@reduxjs/toolkit';

export const PETS_SORTED_BY_ACTION_TYPE = 'saga/petsSortedBy';
export const petsSortedByAction = createAction(PETS_SORTED_BY_ACTION_TYPE);
