
import {  call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { getData, putData , postData , deleteData } from "../../../api/apiactions";

import { LibraryBookReturnConstants } from "./bookreturnconstants";
import { setBookListReturnForEmployeeAct, setBookListReturnForRecommendAct, setBookListReturnForStudentAct, setBookReturnEmployeeListAct, setBookReturnErrorAct, setBookReturnListAct, setBookReturnListByAccessionNoAct, setBookReturnRecommendListAct, setBookReturnSaveListAct, setBookReturnStuListAct, setExportBookReturnAct, setLibraryTcDetailsListAct, setSaveLibraryBookReturnAct } from "./bookreturnslice";

//libraryBookIssuance

function* getLibraryBookReturnListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setBookReturnErrorAct(response.error));
    } else {
        yield put(setBookReturnListAct(response.data));
    }
}

function* getBookReturnStuListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setBookReturnErrorAct(response.error));
    } else {
        yield put(setBookReturnStuListAct(response.data));
    }
}

function* getBookReturnEmployeeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setBookReturnErrorAct(response.error));
    } else {
        yield put(setBookReturnEmployeeListAct(response.data));
    }
}

function* getBookReturnRecommendListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setBookReturnErrorAct(response.error));
    } else {
        yield put(setBookReturnRecommendListAct(response.data));
    }
}

function* getBookListReturnForStudentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setBookReturnErrorAct(response.error));
    } else {
        yield put(setBookListReturnForStudentAct(response.data));
    }

}
function* getBookListReturnForEmployeeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setBookReturnErrorAct(response.error));
    } else {
        yield put(setBookListReturnForEmployeeAct(response.data));
    }
}

function* getBookListReturnForRecommendGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setBookReturnErrorAct(response.error));
    } else {
        yield put(setBookListReturnForRecommendAct(response.data));
    }
}

function* saveLibraryBookReturnGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setBookReturnErrorAct(response.error));
    } else {
        yield put(setSaveLibraryBookReturnAct({statusCode : response.status}));
    }
}

function* exportBookReturnGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setBookReturnErrorAct(response.error));
    } else {
        yield put(setExportBookReturnAct(response.data));
    }
}

function* getBookReturnListByAccessionNoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setBookReturnErrorAct(response.error));
    } else {
        yield put(setBookReturnListByAccessionNoAct(response.data));
    }
}

function* getLibraryBookReturnSaveListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setBookReturnErrorAct(response.error));
    } else {
        yield put(setBookReturnSaveListAct(response.data));
    }
}

//library tc
function* getLibraryTcDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setBookReturnErrorAct(response.error));
    } else {
        yield put(setLibraryTcDetailsListAct(response.data));
    }
}

export default function* bookreturnsaga() {
    //LibraryBookIssuance

    yield takeLatest(LibraryBookReturnConstants.GET_LIBRARY_BOOK_RETURN, getLibraryBookReturnListGen);
    yield takeLatest(LibraryBookReturnConstants.GET_BOOK_RETURN_STU_LIST, getBookReturnStuListGen);
    yield takeLatest(LibraryBookReturnConstants.SAVE_LIBRARY_BOOK_RETURN, saveLibraryBookReturnGen);
    yield takeLatest(LibraryBookReturnConstants.GET_BOOK_RETURN_EMPLOYEE_LIST, getBookReturnEmployeeListGen);
    yield takeLatest(LibraryBookReturnConstants.GET_BOOK_RETURN_RECOMMEND_LIST, getBookReturnRecommendListGen);
    yield takeLatest(LibraryBookReturnConstants.GET_BOOK_LIST_RETURN_FOR_STUDENT, getBookListReturnForStudentGen);
    yield takeLatest(LibraryBookReturnConstants.GET_BOOK_LIST_RETURN_FOR_EMPLOYEE, getBookListReturnForEmployeeGen);
    yield takeLatest(LibraryBookReturnConstants.GET_BOOK_LIST_RETURN_FOR_RECOMMEND, getBookListReturnForRecommendGen);
    yield takeLatest(LibraryBookReturnConstants.EXPORT_BOOK_RETURN, exportBookReturnGen);
    yield takeLatest(LibraryBookReturnConstants.GET_BOOK_LIST_BY_ACCESSION_NO, getBookReturnListByAccessionNoGen);
    yield takeLatest(LibraryBookReturnConstants.GET_LIBRARY_BOOK_RETURN_SAVE_LIST, getLibraryBookReturnSaveListGen);
   //library tc
   yield takeLatest(LibraryBookReturnConstants.GET_LIBRARY_TC_DETAILS, getLibraryTcDetailsListGen);

}