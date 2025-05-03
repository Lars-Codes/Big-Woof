import { configureStore } from "@reduxjs/toolkit";
const createSagaMiddleware = require("redux-saga").default;
import clientsReducer from "./clients/clientsSlice";

// Create saga middleware - fix the import issue
export const sagaMiddleware = createSagaMiddleware();

const reducers = {
  clients: clientsReducer,
  // Uncomment these as you implement them
  // appointments: appointmentsReducer,
  // services: servicesReducer,
  // groomer: groomerReducer,
};

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware), // Changed from prepend to concat for compatibility
});

// Export the sagaMiddleware after creating the store
// export { sagaMiddleware };
export default store;
