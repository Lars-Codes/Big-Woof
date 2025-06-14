import { createAction } from '@reduxjs/toolkit';

export const UPDATE_CLIENT_IS_FAVORITE_ACTION_TYPE =
  'saga/updateClientIsFavorite';
export const updateClientIsFavoriteAction = createAction(
  UPDATE_CLIENT_IS_FAVORITE_ACTION_TYPE,
);
