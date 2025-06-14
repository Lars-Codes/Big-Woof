import { createAction } from '@reduxjs/toolkit';

export const FETCH_CLIENT_STATS_ACTION_TYPE = 'saga/fetchClientStats';
export const fetchClientStatsAction = createAction(
  FETCH_CLIENT_STATS_ACTION_TYPE,
);
