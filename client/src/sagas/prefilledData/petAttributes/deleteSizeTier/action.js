import { createAction } from '@reduxjs/toolkit';

export const DELETE_SIZE_TIER_ACTION_TYPE = 'saga/deleteSizeTier';
export const deleteSizeTierAction = createAction(DELETE_SIZE_TIER_ACTION_TYPE);
