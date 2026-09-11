import axios, { AxiosError, AxiosResponse } from "axios";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { setBookCirculationAnalysisAct, setBulkUploadLibraryBookCollectionAct, setDeleteLibraryBookCollectionAct, setDownloadStaticLibraryBookCollectionAct, setEditLibraryBookCollectionListAct, setExportLibraryBookCollectionAct, setLibraryBookCollectionErrorAct, setLibraryBookCollectionListAct, setLibraryBookCollectionListByIdAct, setLibraryCollectionStatsListAct, setLibraryDashboardDataAct, setLibrarySummaryAct, setSaveLibraryBookCollectionListAct, setStockVerificationAct } from "./bookcollectionslice";
import { LibraryBookCollectionConstants } from "./bookcollectionconstants";

//libraryBookCollection

function* getLibraryBookCollectionListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
        yield put(setLibraryBookCollectionListAct(response.data));
    }
}
function* exportLibraryBookCollectionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
        yield put(setExportLibraryBookCollectionAct(response.data));
    }
}

function* deleteLibraryBookCollectionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
        yield put(setDeleteLibraryBookCollectionAct({statusCode : response.status}));
    }
}
function* getLibraryBookCollectionListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
        yield put(setLibraryBookCollectionListByIdAct(response.data));
    }
}
function* saveLibraryBookCollectionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
        yield put(setSaveLibraryBookCollectionListAct(response.data));
    }
}
function* editLibraryBookCollectionListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
        yield put(setEditLibraryBookCollectionListAct({statusCode : response.status}));
    }
}
function* bulkUploadLibraryBookCollectionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
        yield put(setBulkUploadLibraryBookCollectionAct({statusCode : response.status}));
    }
}
function* downloadStaticLibraryBookCollectionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig );
    if (response && response.error) {
      yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
      yield put(setDownloadStaticLibraryBookCollectionAct(response.data));
    }
  }

  //Stats
function* getLibraryCollectionStatsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
        yield put(setLibraryCollectionStatsListAct(response.data));
    }
}

//Dashboard

function* getLibraryDashboardDataGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
        yield put(setLibraryDashboardDataAct(response.data));
    }
}
function* getStockVerificationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
        yield put(setStockVerificationAct(response.data));
    }
}
function* getBookCirculationAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
        yield put(setBookCirculationAnalysisAct(response.data));
    }
}
function* getLibrarySummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookCollectionErrorAct(response.error));
    } else {
        yield put(setLibrarySummaryAct(response.data));
    }
}

export default function* bookcollectionsaga() {
    //LibraryBookCollection

    yield takeLatest(LibraryBookCollectionConstants.GET_LIBRARY_BOOK_COLLECTION, getLibraryBookCollectionListGen);
    yield takeLatest(LibraryBookCollectionConstants.GET_LIBRARY_BOOK_COLLECTION_BY_ID, getLibraryBookCollectionListByIdGen);
    yield takeLatest(LibraryBookCollectionConstants.SAVE_LIBRARY_BOOK_COLLECTION, saveLibraryBookCollectionGen);
    yield takeLatest(LibraryBookCollectionConstants.EDIT_LIBRARY_BOOK_COLLECTION, editLibraryBookCollectionListGen);
    yield takeLatest(LibraryBookCollectionConstants.DELETE_LIBRARY_BOOK_COLLECTION, deleteLibraryBookCollectionGen);
    yield takeLatest(LibraryBookCollectionConstants.EXPORT_LIBRARY_BOOK_COLLECTION, exportLibraryBookCollectionGen);
    yield takeLatest(LibraryBookCollectionConstants.BULK_UPLOAD_LIBRARY_BOOK_COLLECTION, bulkUploadLibraryBookCollectionGen);
    yield takeLatest(LibraryBookCollectionConstants.DOWNLOAD_LIBRARY_BOOK_COLLECTION_FORM,downloadStaticLibraryBookCollectionGen);

    //BookStats
    yield takeLatest(LibraryBookCollectionConstants.GET_LIBRARY_COLLECTION_STATS, getLibraryCollectionStatsListGen);

    //Dashboard
    yield takeLatest(LibraryBookCollectionConstants.GET_LIBRARY_DASHBOARD_DATA, getLibraryDashboardDataGen);
    yield takeLatest(LibraryBookCollectionConstants.GET_STOCK_VERIFICATION, getStockVerificationGen);
    yield takeLatest(LibraryBookCollectionConstants.GET_BOOK_CIRCULATION, getBookCirculationAnalysisGen);
    yield takeLatest(LibraryBookCollectionConstants.GET_LIBRARY_SUMMARY, getLibrarySummaryGen);
}