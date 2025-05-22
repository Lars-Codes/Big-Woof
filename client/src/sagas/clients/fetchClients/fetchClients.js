import { call, put, fork, select } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setClients,
  setLoading,
  setPageSize,
  setCurrentPage,
  setTotalPages,
  selectPageSize,
  selectCurrentPage,
  selectSearchBy,
} from '../../../state/clients/clientsSlice';
import processResultSet from '../processResultSet/processResultSet';
import processSearchResultSet from '../processSearchResultSet/processSearchResultSet';

export default function* fetchClients(action) {
  try {
    yield put(setLoading(true));
    const effectivePage = action.page || (yield select(selectCurrentPage));
    const effectivePageSize = action.pageSize || (yield select(selectPageSize));
    const effectiveSearch = action.searchBy || (yield select(selectSearchBy));
    const res = yield call(
      api,
      `/getAllClients?page=${effectivePage}&page_size=${effectivePageSize}&searchbar_chars=${effectiveSearch}`,
      'GET',
    );
    const clients = res.data;
    const currentPage = res.current_page;
    const totalPages = res.total_pages;
    yield put(setClients(clients));
    yield put(setPageSize(effectivePageSize));
    yield put(setCurrentPage(currentPage));
    yield put(setTotalPages(totalPages));
    yield call(processResultSet);
    yield fork(processSearchResultSet);
  } catch (error) {
    console.error('Error fetching clients:', error);
  } finally {
    yield put(setLoading(false));
  }
}
