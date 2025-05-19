import { call, put, fork, select } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setClients,
  setLoading,
  setPageSize,
  setCurrentPage,
  setTotalPages,
  selectPageSize,
} from '../../../state/clients/clientsSlice';
import processResultSet from '../processResultSet/processResultSet';
import processSearchResultSet from '../processSearchResultSet/processSearchResultSet';

export default function* fetchClients(page = 1, pageSize, search = '') {
  try {
    yield put(setLoading(true));
    const effectivePageSize = pageSize || (yield select(selectPageSize));
    const res = yield call(
      api,
      `/getAllClients?page=${page}&page_size=${effectivePageSize}&searchbar_chars=${search}`,
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
