import { createAction } from '@reduxjs/toolkit';

export const FETCH_CLIENT_DOCUMENTS_ACTION_TYPE = 'saga/fetchClientDocuments';
export const fetchClientDocumentsAction = createAction(
  FETCH_CLIENT_DOCUMENTS_ACTION_TYPE,
);
