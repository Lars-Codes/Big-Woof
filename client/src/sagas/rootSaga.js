import { all, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';

import { sagaMiddleware } from '../state/store';

import { CLIENTS_FILTERED_BY_ACTION_TYPE } from './clients/clientsFilteredBy/action';
import clientsFilteredBySaga from './clients/clientsFilteredBy/clientsFilteredBy';
import { CLIENTS_SEARCH_BY_ACTION_TYPE } from './clients/clientsSearchBy/action';
import clientsSearchBySaga from './clients/clientsSearchBy/clientsSearchBy';
import { CLIENTS_SORTED_BY_ACTION_TYPE } from './clients/clientsSortedBy/action';
import clientsSortedBySaga from './clients/clientsSortedBy/clientsSortedBy';
import { CLIENTS_SORTED_DIRECTION_ACTION_TYPE } from './clients/clientsSortedDirection/action';
import clientsSortedDirectionSaga from './clients/clientsSortedDirection/clientsSortedDirection';
import { CREATE_CLIENT_ACTION_TYPE } from './clients/createClient/action';
import createClientSaga from './clients/createClient/createClient';
import { DELETE_CLIENT_ACTION_TYPE } from './clients/deleteClient/action';
import deleteClientSaga from './clients/deleteClient/deleteClient';
import { FETCH_CLIENT_APPOINTMENTS_ACTION_TYPE } from './clients/fetchClientAppointments/action';
import fetchClientAppointmentsSaga from './clients/fetchClientAppointments/fetchClientAppointments';
import { FETCH_CLIENT_DETAILS_ACTION_TYPE } from './clients/fetchClientDetails/action';
import fetchClientDetailsSaga from './clients/fetchClientDetails/fetchClientDetails';
import { FETCH_CLIENT_DOCUMENTS_ACTION_TYPE } from './clients/fetchClientDocuments/action';
import fetchClientDocumentsSaga from './clients/fetchClientDocuments/fetchClientDocuments';
import { FETCH_CLIENT_PROFILE_PICTURE_ACTION_TYPE } from './clients/fetchClientProfilePicture/action';
import fetchClientProfilePictureSaga from './clients/fetchClientProfilePicture/fetchClientProfilePicture';
import { FETCH_CLIENTS_ACTION_TYPE } from './clients/fetchClients/action';
import fetchClientsSaga from './clients/fetchClients/fetchClients';
import { FETCH_CLIENT_STATS_ACTION_TYPE } from './clients/fetchClientStats/action';
import fetchClientStatsSaga from './clients/fetchClientStats/fetchClientStats';
import { PROCESSED_SEARCHED_RESULT_SET_ACTION_TYPE } from './clients/processSearchedResultSet/action';
import processSearchedResultSetSaga from './clients/processSearchedResultSet/processSearchedResultSet';
import { UPDATE_CLIENT_ACTION_TYPE } from './clients/updateClient/action';
import updateClientSaga from './clients/updateClient/updateClient';
import { INIT_ACTION_TYPE } from './init/action';
import initSaga from './init/init';
import { LOGGED_IN_ACTION_TYPE } from './loggedIn/action';
import loggedInSaga from './loggedIn/loggedIn';

export default function* rootSaga() {
  yield all([
    takeEvery(CLIENTS_SEARCH_BY_ACTION_TYPE, clientsSearchBySaga),
    takeEvery(CLIENTS_FILTERED_BY_ACTION_TYPE, clientsFilteredBySaga),
    takeEvery(CLIENTS_SORTED_BY_ACTION_TYPE, clientsSortedBySaga),
    takeEvery(CLIENTS_SORTED_DIRECTION_ACTION_TYPE, clientsSortedDirectionSaga),
    takeLeading(CREATE_CLIENT_ACTION_TYPE, createClientSaga),
    takeEvery(
      PROCESSED_SEARCHED_RESULT_SET_ACTION_TYPE,
      processSearchedResultSetSaga,
    ),
    takeLeading(UPDATE_CLIENT_ACTION_TYPE, updateClientSaga),
    takeLatest(FETCH_CLIENTS_ACTION_TYPE, fetchClientsSaga),
    takeLatest(FETCH_CLIENT_DETAILS_ACTION_TYPE, fetchClientDetailsSaga),
    takeLatest(
      FETCH_CLIENT_PROFILE_PICTURE_ACTION_TYPE,
      fetchClientProfilePictureSaga,
    ),
    takeLatest(FETCH_CLIENT_STATS_ACTION_TYPE, fetchClientStatsSaga),
    takeLatest(
      FETCH_CLIENT_APPOINTMENTS_ACTION_TYPE,
      fetchClientAppointmentsSaga,
    ),
    takeLatest(FETCH_CLIENT_DOCUMENTS_ACTION_TYPE, fetchClientDocumentsSaga),
    takeLeading(DELETE_CLIENT_ACTION_TYPE, deleteClientSaga),
    takeLeading(INIT_ACTION_TYPE, initSaga),
    takeLatest(LOGGED_IN_ACTION_TYPE, loggedInSaga),
  ]);
}

sagaMiddleware.run(rootSaga);
