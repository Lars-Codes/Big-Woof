import { put, select } from 'redux-saga/effects';
import * as clientState from '../../../state/clients/clientsSlice';

export default function* processClientSearchResultSet() {
  const clientsArr = yield select(clientState.selectClients);

  if (clientsArr?.length) {
    const clientsSearchArr = [];
    for (let i = 0; i < clientsArr.length; i++) {
      if (clientsArr[i].fname) {
        clientsSearchArr.push({
          client: clientsArr[i],
          searchStr: `${clientsArr[i].fname}`,
        });
      }
      if (clientsArr[i].lname) {
        clientsSearchArr.push({
          client: clientsArr[i],
          searchStr: `${clientsArr[i].lname}`,
        });
      }
      if (clientsArr[i].phone_number) {
        clientsSearchArr.push({
          client: clientsArr[i],
          searchStr: `${clientsArr[i].phone_number}`,
        });
      }
    }

    yield put(clientState.setSearchResultSet(clientsSearchArr));
  }
}
