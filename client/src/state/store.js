import { configureStore } from '@reduxjs/toolkit';
import clientDetailsReducer from './clientDetails/clientDetailsSlice';
import clientsReducer from './clients/clientsSlice';
import listReducer from './list/listSlice';
import petDetailsReducer from './petDetails/petDetailsSlice';
import petsReducer from './pets/petsSlice';
const createSagaMiddleware = require('redux-saga').default;

export const sagaMiddleware = createSagaMiddleware();

const reducers = {
  clients: clientsReducer,
  clientDetails: clientDetailsReducer,
  list: listReducer,
  pets: petsReducer,
  petDetails: petDetailsReducer,
};

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).prepend(sagaMiddleware),
});

export default store;
