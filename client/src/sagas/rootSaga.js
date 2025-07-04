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
import { DELETE_CLIENT_PROFILE_PICTURE_ACTION_TYPE } from './clients/deleteClientProfilePicture/action';
import deleteClientProfilePictureSaga from './clients/deleteClientProfilePicture/deleteClientProfilePicture';
import { DELETE_CLIENTS_ACTION_TYPE } from './clients/deleteClients/action';
import deleteClientsSaga from './clients/deleteClients/deleteClients';
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
import { PROCESS_CLIENT_SEARCHED_RESULT_SET_ACTION_TYPE } from './clients/processClientSearchedResultSet/action';
import processClientSearchedResultSetSaga from './clients/processClientSearchedResultSet/processClientSearchedResultSet';
import { UPDATE_CLIENT_ACTION_TYPE } from './clients/updateClient/action';
import updateClientSaga from './clients/updateClient/updateClient';
import { UPDATE_CLIENT_IS_FAVORITE_ACTION_TYPE } from './clients/updateClientIsFavorite/action';
import updateClientIsFavoriteSaga from './clients/updateClientIsFavorite/updateClientIsFavorite';
import { UPLOAD_CLIENT_PROFILE_PICTURE_ACTION_TYPE } from './clients/uploadClientProfilePicture/action';
import uploadClientProfilePictureSaga from './clients/uploadClientProfilePicture/uploadClientProfilePicture';
import { INIT_ACTION_TYPE } from './init/action';
import initSaga from './init/init';
import { LOGGED_IN_ACTION_TYPE } from './loggedIn/action';
import loggedInSaga from './loggedIn/loggedIn';
import { CREATE_PET_ACTION_TYPE } from './pets/createPet/action';
import createPetSaga from './pets/createPet/createPet';
import { DELETE_PET_PROFILE_PICTURE_ACTION_TYPE } from './pets/deletePetProfilePicture/action';
import deletePetProfilePictureSaga from './pets/deletePetProfilePicture/deletePetProfilePicture';
import { DELETE_PETS_ACTION_TYPE } from './pets/deletePets/action';
import deletePetsSaga from './pets/deletePets/deletePets';
import { FETCH_PET_DETAILS_ACTION_TYPE } from './pets/fetchPetDetails/action';
import fetchPetDetailsAction from './pets/fetchPetDetails/fetchPetDetails';
import { FETCH_PET_PROFILE_PICTURE_ACTION_TYPE } from './pets/fetchPetProfilePicture/action';
import fetchPetProfilePictureSaga from './pets/fetchPetProfilePicture/fetchPetProfilePicture';
import { FETCH_PETS_ACTION_TYPE } from './pets/fetchPets/action';
import fetchPetsSaga from './pets/fetchPets/fetchPets';
import { PETS_SEARCH_BY_ACTION_TYPE } from './pets/petsSearchBy/action';
import petsSearchBy from './pets/petsSearchBy/petsSearchBy';
import { PETS_SORTED_BY_ACTION_TYPE } from './pets/petsSortedBy/action';
import petsSortedBySaga from './pets/petsSortedBy/petsSortedBy';
import { PETS_SORTED_DIRECTION_ACTION_TYPE } from './pets/petsSortedDirection/action';
import petsSortedDirectionSaga from './pets/petsSortedDirection/petsSortedDirection';
import { PROCESS_PET_SEARCHED_RESULT_SET_ACTION_TYPE } from './pets/processPetSearchedResultSet/action';
import processPetSearchedResultSetSaga from './pets/processPetSearchedResultSet/processPetSearchedResultSet';
import { UPDATE_PET_ACTION_TYPE } from './pets/updatePet/action';
import updatePetSaga from './pets/updatePet/updatePet';
import { UPDATE_PET_IS_DECEASED_ACTION_TYPE } from './pets/updatePetIsDeceased/action';
import updatePetIsDeceasedSaga from './pets/updatePetIsDeceased/updatePetIsDeceased';
import { UPLOAD_PET_PROFILE_PICTURE_ACTION_TYPE } from './pets/uploadPetProfilePicture/action';
import uploadPetProfilePictureSaga from './pets/uploadPetProfilePicture/uploadPetProfilePicture';
import { CREATE_BREED_ACTION_TYPE } from './prefilledData/petAttributes/createBreed/action';
import createBreedSaga from './prefilledData/petAttributes/createBreed/createBreed';
import { CREATE_COAT_TYPE_ACTION_TYPE } from './prefilledData/petAttributes/createCoatType/action';
import createCoatTypeSaga from './prefilledData/petAttributes/createCoatType/createCoatType';
import { CREATE_HAIR_LENGTH_ACTION_TYPE } from './prefilledData/petAttributes/createHairLength/action';
import createHairLengthSaga from './prefilledData/petAttributes/createHairLength/createHairLength';
import { CREATE_SIZE_TIER_ACTION_TYPE } from './prefilledData/petAttributes/createSizeTier/action';
import createSizeTierSaga from './prefilledData/petAttributes/createSizeTier/createSizeTier';
import { DELETE_BREED_ACTION_TYPE } from './prefilledData/petAttributes/deleteBreed/action';
import deleteBreedSaga from './prefilledData/petAttributes/deleteBreed/deleteBreed';
import { DELETE_COAT_TYPE_ACTION_TYPE } from './prefilledData/petAttributes/deleteCoatType/action';
import deleteCoatTypeSaga from './prefilledData/petAttributes/deleteCoatType/deleteCoatType';
import { DELETE_HAIR_LENGTH_ACTION_TYPE } from './prefilledData/petAttributes/deleteHairLength/action';
import deleteHairLengthSaga from './prefilledData/petAttributes/deleteHairLength/deleteHairLength';
import { DELETE_SIZE_TIER_ACTION_TYPE } from './prefilledData/petAttributes/deleteSizeTier/action';
import deleteSizeTierSaga from './prefilledData/petAttributes/deleteSizeTier/deleteSizeTier';
import { FETCH_BREEDS_ACTION_TYPE } from './prefilledData/petAttributes/fetchBreeds/action';
import fetchBreedsSaga from './prefilledData/petAttributes/fetchBreeds/fetchBreeds';
import { FETCH_COAT_TYPES_ACTION_TYPE } from './prefilledData/petAttributes/fetchCoatTypes/action';
import fetchCoatTypesSaga from './prefilledData/petAttributes/fetchCoatTypes/fetchCoatTypes';
import { FETCH_HAIR_LENGTHS_ACTION_TYPE } from './prefilledData/petAttributes/fetchHairLengths/action';
import fetchHairLengthsSaga from './prefilledData/petAttributes/fetchHairLengths/fetchHairLengths';
import { FETCH_SIZE_TIERS_ACTION_TYPE } from './prefilledData/petAttributes/fetchSizeTiers/action';
import fetchSizeTiersSaga from './prefilledData/petAttributes/fetchSizeTiers/fetchSizeTiers';
import { CREATE_VET_ACTION_TYPE } from './vets/createVet/action';
import createVetSaga from './vets/createVet/createVet';
import { DELETE_VET_ACTION_TYPE } from './vets/deleteVet/action';
import deleteVetSaga from './vets/deleteVet/deleteVet';
import { UPDATE_VET_ACTION_TYPE } from './vets/updateVet/action';
import updateVetSaga from './vets/updateVet/updateVet';

export default function* rootSaga() {
  yield all([
    takeLeading(INIT_ACTION_TYPE, initSaga),
    takeLatest(LOGGED_IN_ACTION_TYPE, loggedInSaga),

    takeLatest(FETCH_BREEDS_ACTION_TYPE, fetchBreedsSaga),
    takeLeading(CREATE_BREED_ACTION_TYPE, createBreedSaga),
    takeLeading(DELETE_BREED_ACTION_TYPE, deleteBreedSaga),
    takeLatest(FETCH_COAT_TYPES_ACTION_TYPE, fetchCoatTypesSaga),
    takeLeading(CREATE_COAT_TYPE_ACTION_TYPE, createCoatTypeSaga),
    takeLeading(DELETE_COAT_TYPE_ACTION_TYPE, deleteCoatTypeSaga),
    takeLatest(FETCH_HAIR_LENGTHS_ACTION_TYPE, fetchHairLengthsSaga),
    takeLeading(CREATE_HAIR_LENGTH_ACTION_TYPE, createHairLengthSaga),
    takeLeading(DELETE_HAIR_LENGTH_ACTION_TYPE, deleteHairLengthSaga),
    takeLatest(FETCH_SIZE_TIERS_ACTION_TYPE, fetchSizeTiersSaga),
    takeLeading(CREATE_SIZE_TIER_ACTION_TYPE, createSizeTierSaga),
    takeLeading(DELETE_SIZE_TIER_ACTION_TYPE, deleteSizeTierSaga),

    takeLeading(DELETE_VET_ACTION_TYPE, deleteVetSaga),
    takeLeading(CREATE_VET_ACTION_TYPE, createVetSaga),
    takeLeading(UPDATE_VET_ACTION_TYPE, updateVetSaga),

    takeEvery(CLIENTS_SEARCH_BY_ACTION_TYPE, clientsSearchBySaga),
    takeEvery(CLIENTS_FILTERED_BY_ACTION_TYPE, clientsFilteredBySaga),
    takeEvery(CLIENTS_SORTED_BY_ACTION_TYPE, clientsSortedBySaga),
    takeEvery(CLIENTS_SORTED_DIRECTION_ACTION_TYPE, clientsSortedDirectionSaga),
    takeLeading(CREATE_CLIENT_ACTION_TYPE, createClientSaga),
    takeEvery(
      PROCESS_CLIENT_SEARCHED_RESULT_SET_ACTION_TYPE,
      processClientSearchedResultSetSaga,
    ),
    takeLeading(UPDATE_CLIENT_ACTION_TYPE, updateClientSaga),
    takeLeading(
      UPDATE_CLIENT_IS_FAVORITE_ACTION_TYPE,
      updateClientIsFavoriteSaga,
    ),
    takeLatest(FETCH_CLIENTS_ACTION_TYPE, fetchClientsSaga),
    takeLatest(FETCH_CLIENT_DETAILS_ACTION_TYPE, fetchClientDetailsSaga),
    takeLatest(
      FETCH_CLIENT_PROFILE_PICTURE_ACTION_TYPE,
      fetchClientProfilePictureSaga,
    ),
    takeLeading(
      UPLOAD_CLIENT_PROFILE_PICTURE_ACTION_TYPE,
      uploadClientProfilePictureSaga,
    ),
    takeLeading(
      DELETE_CLIENT_PROFILE_PICTURE_ACTION_TYPE,
      deleteClientProfilePictureSaga,
    ),
    takeLatest(FETCH_CLIENT_STATS_ACTION_TYPE, fetchClientStatsSaga),
    takeLatest(
      FETCH_CLIENT_APPOINTMENTS_ACTION_TYPE,
      fetchClientAppointmentsSaga,
    ),
    takeLatest(FETCH_CLIENT_DOCUMENTS_ACTION_TYPE, fetchClientDocumentsSaga),
    takeLeading(DELETE_CLIENTS_ACTION_TYPE, deleteClientsSaga),

    takeLeading(PETS_SEARCH_BY_ACTION_TYPE, petsSearchBy),
    takeEvery(PETS_SORTED_BY_ACTION_TYPE, petsSortedBySaga),
    takeEvery(PETS_SORTED_DIRECTION_ACTION_TYPE, petsSortedDirectionSaga),
    takeLeading(
      PROCESS_PET_SEARCHED_RESULT_SET_ACTION_TYPE,
      processPetSearchedResultSetSaga,
    ),
    takeLatest(
      FETCH_PET_PROFILE_PICTURE_ACTION_TYPE,
      fetchPetProfilePictureSaga,
    ),
    takeLeading(
      UPLOAD_PET_PROFILE_PICTURE_ACTION_TYPE,
      uploadPetProfilePictureSaga,
    ),
    takeLeading(
      DELETE_PET_PROFILE_PICTURE_ACTION_TYPE,
      deletePetProfilePictureSaga,
    ),
    takeLeading(UPDATE_PET_ACTION_TYPE, updatePetSaga),
    takeLeading(UPDATE_PET_IS_DECEASED_ACTION_TYPE, updatePetIsDeceasedSaga),
    takeLatest(FETCH_PETS_ACTION_TYPE, fetchPetsSaga),
    takeLeading(CREATE_PET_ACTION_TYPE, createPetSaga),
    takeLeading(DELETE_PETS_ACTION_TYPE, deletePetsSaga),
    takeLatest(FETCH_PET_DETAILS_ACTION_TYPE, fetchPetDetailsAction),
  ]);
}

sagaMiddleware.run(rootSaga);
