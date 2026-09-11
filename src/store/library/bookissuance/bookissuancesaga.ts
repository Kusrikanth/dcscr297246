
import {  call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { getData, putData , postData , deleteData } from "../../../api/apiactions";
import { LibraryBookIssuanceConstants } from "./bookissuanceconstants";
import { setBookDetailByAccessionNoAct, setBookIssuanceUserTypeListAct, setDeleteLibraryBookIssuanceAct, setExportBookIssuanceAct, setExportBookOverDueAct, setExportLibraryBorrowedBooksAct, setLibraryBorrowedBooksListAct, setLibraryBookIssuanceErrorAct, setLibraryBookIssuanceListAct, setLibraryIssuanceStatsListAct, setSaveLibraryBookIssuanceAct, setSaveLibraryBookRenewalAct } from "./bookissuanceslice";

//libraryBookIssuance

function* getLibraryBookIssuanceListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookIssuanceErrorAct(response.error));
    } else {
        yield put(setLibraryBookIssuanceListAct(response.data));
    }
}

function* getBookDetailByAccessionNoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookIssuanceErrorAct(response.error));
    } else {
        yield put(setBookDetailByAccessionNoAct(response.data));
    }
}

function* saveLibraryBookIssuanceGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookIssuanceErrorAct(response.error));
    } else {
        yield put(setSaveLibraryBookIssuanceAct({statusCode : response.status}));
    }
}

function* deleteLibraryBookIssuanceGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookIssuanceErrorAct(response.error));
    } else {
        yield put(setDeleteLibraryBookIssuanceAct({statusCode : response.status}));
    }
}

function* getBookIssuanceUserTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookIssuanceErrorAct(response.error));
    } else {
        yield put(setBookIssuanceUserTypeListAct(response.data));
    }
}

function* exportBookIssuanceGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookIssuanceErrorAct(response.error));
    } else {
        yield put(setExportBookIssuanceAct(response.data));
    }
}

function* exportBookOverDueGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookIssuanceErrorAct(response.error));
    } else {
        yield put(setExportBookOverDueAct(response.data));
    }
}

//Borrowed Books
function* getLibraryBorrowedBooksListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookIssuanceErrorAct(response.error));
    } else {
        yield put(setLibraryBorrowedBooksListAct(response.data));
    }
}

function* exportLibraryBorrowedBooksGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookIssuanceErrorAct(response.error));
    } else {
        yield put(setExportLibraryBorrowedBooksAct(response.data));
    }
}

function* saveLibraryBookRenewalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookIssuanceErrorAct(response.error));
    } else {
        yield put(setSaveLibraryBookRenewalAct({statusCode : response.status}));
    }
}

//Stats
function* getLibraryIssuanceStatsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryBookIssuanceErrorAct(response.error));
    } else {
        yield put(setLibraryIssuanceStatsListAct(response.data));
    }
}

export default function* bookissuancesaga() {
    //LibraryBookIssuance

    yield takeLatest(LibraryBookIssuanceConstants.GET_LIBRARY_BOOK_ISSUANCE, getLibraryBookIssuanceListGen);
    yield takeLatest(LibraryBookIssuanceConstants.GET_BOOK_DETAIL_BY_ACCESSION_NUMBER, getBookDetailByAccessionNoGen);
    yield takeLatest(LibraryBookIssuanceConstants.SAVE_LIBRARY_BOOK_ISSUANCE, saveLibraryBookIssuanceGen);
    yield takeLatest(LibraryBookIssuanceConstants.DELETE_LIBRARY_BOOK_ISSUANCE, deleteLibraryBookIssuanceGen);
    yield takeLatest(LibraryBookIssuanceConstants.GET_USER_TYPE_LIST, getBookIssuanceUserTypeListGen);
    yield takeLatest(LibraryBookIssuanceConstants.EXPORT_BOOK_ISSUANCE, exportBookIssuanceGen);
    yield takeLatest(LibraryBookIssuanceConstants.EXPORT_BOOKS_OVERDUE, exportBookOverDueGen);

    //Borrowed Books
    yield takeLatest(LibraryBookIssuanceConstants.GET_LIBRARY_BORROWED_BOOKS_LIST, getLibraryBorrowedBooksListGen);
    yield takeLatest(LibraryBookIssuanceConstants.EXPORT_LIBRARY_BORROWED_BOOKS, exportLibraryBorrowedBooksGen);
    // library book renewal

    yield takeLatest(LibraryBookIssuanceConstants.SAVE_LIBRARY_BOOK_RENEWAL, saveLibraryBookRenewalGen);

    //BookStats

    
    yield takeLatest(LibraryBookIssuanceConstants.GET_LIBRARY_ISSUANCE_STATS, getLibraryIssuanceStatsListGen);
   
}