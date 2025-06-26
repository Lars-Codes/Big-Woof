import { createAction } from '@reduxjs/toolkit';

export const FETCH_SIZE_TIERS_ACTION_TYPE = 'saga/fetchSizeTiers';
export const fetchSizeTiersAction = createAction(FETCH_SIZE_TIERS_ACTION_TYPE);
