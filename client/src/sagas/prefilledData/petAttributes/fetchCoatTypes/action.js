import { createAction } from '@reduxjs/toolkit';

export const FETCH_COAT_TYPES_ACTION_TYPE = 'saga/fetchCoatTypes';
export const fetchCoatTypesAction = createAction(FETCH_COAT_TYPES_ACTION_TYPE);
