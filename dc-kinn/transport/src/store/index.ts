import { createStore, applyMiddleware, compose } from "redux";
import {
  configureStore,
} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,

} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}


const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['Profile', 'login', 'appData'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)



const sagaMiddleware = createSagaMiddleware();
// const middlewares = [sagaMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({
    thunk: false,
    serializableCheck: false
    // serializableCheck: {
    //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    // },
  }), sagaMiddleware]
});

// "UPDATE_INSTITUTE_BY_ID_REQUEST", 'UPDATE_BRANCH_REQUEST', 'ADD_INSTITUTE_BRANCH_REQUEST',
//         'ADD_STUDENT_REQUEST', "UPLOAD_STUDENT_DOCUMENT_REQUEST", "UPDATE_STUDENT_REQUEST",
//         "ADD_EMPLOYEE_REQUEST", "UPLOAD_EMPLOYEE_DOCUMENT_REQUEST",
//         "UPLOADED_ACTIVITY_CERTIFICATE_REQUEST",
//         "DOWNLOAD_FEE_RECEIPT_REQUEST", "feecollections/setDownloadFeeReceiptAct",

sagaMiddleware.run(rootSaga);

export default store;
export const persistor = persistStore(store);


// export function configureStore(initialState: RootState | {}) {
//   const store = createStore(
//     rootReducer,
//     initialState,
//     composeEnhancers(
//       applyMiddleware(...middlewares)
//     ),
//   );
//   sagaMiddleware.run(rootSaga);
//   return store;
// }

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;


