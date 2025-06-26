import { put, select } from 'redux-saga/effects';
import * as petsSlice from '../../../state/pets/petsSlice';

export default function* processPetSearchResultSet() {
  const petsArr = yield select(petsSlice.selectPets);

  if (petsArr?.length) {
    const petsSearchArr = [];
    for (let i = 0; i < petsArr.length; i++) {
      if (petsArr[i].name) {
        petsSearchArr.push({
          pet: petsArr[i],
          searchStr: `${petsArr[i].name}`,
        });
      }
      if (petsArr[i].client_fname) {
        petsSearchArr.push({
          pet: petsArr[i],
          searchStr: `${petsArr[i].client_fname}`,
        });
      }
      if (petsArr[i].client_lname) {
        petsSearchArr.push({
          pet: petsArr[i],
          searchStr: `${petsArr[i].client_lname}`,
        });
      }
    }

    yield put(petsSlice.setSearchResultSet(petsSearchArr));
  }
}
