import { createAction } from '@reduxjs/toolkit';

export const PETS_SEARCH_BY_ACTION_TYPE = 'saga/petsSearchBy';
export const petsSearchByAction = createAction(PETS_SEARCH_BY_ACTION_TYPE);
