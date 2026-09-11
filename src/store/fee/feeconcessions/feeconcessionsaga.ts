import { call, put, takeLatest } from "redux-saga/effects";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { FeeConcessionConstants } from "./feeconcessionconstants";
import { feeConcessionError, getConcessionLedgerDetailsAct,
    setPreviousStudentConcessionAct, getEmployeeConcessionAct, getStudentConcessionAct, getStudentConcessionByIdAct, getTutionFeeConcessionAct, getTutionFeeConcessionByIdAct, setEditStudentConcessionResp, setEditTutionFeeConcessionAct, setStudentConcessionAct, setTutionFeeConcessionAct, setDeleteFeeConcessionListAct, setDeleteStuConcessionListAct, 
    setBulkUploadConcessionAct,
    setExportStuConcessionAct,
    setExportTutionFeeConcessionAct,
    setStuConcessionListV2Act,
    setDeleteStuConcessionListV2Act,
    setSaveStuConcessionListV2Act,
    setStuConcessionV2ByIdAct,
    setEditStuConcessionListV2Act,
    setExportStuConcessionV2Act,
    setBulkUploadConcessionV2Act,
    setPrevStuConcessionListV2Act,
    blukUploadConcessionError} from "./feeconcessionslice";

function* getStudentConcessionListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(getStudentConcessionAct(response.data));
    }
}
function* getStudentConcessionByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(getStudentConcessionByIdAct(response.data));
    }
}
function* addStudentConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setStudentConcessionAct({ statusCode: response.status }));
    }
}

function* getPreviousStudentConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setPreviousStudentConcessionAct(response.data));
    }
}


function* editStudentConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setEditStudentConcessionResp({ statusCode: response.status }));
    }
}
function* getConcessionLedgerDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(getConcessionLedgerDetailsAct(response.data));
    }
}
function* getTutionFeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(getTutionFeeConcessionAct(response.data));
    }
}
function* getTutionFeeConcessionByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(getTutionFeeConcessionByIdAct(response.data));
    }
}
function* addTutionFeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setTutionFeeConcessionAct({ statusCode: response.status }));
    }
}
function* editTutionFeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setEditTutionFeeConcessionAct({ statusCode: response.status }));
    }
}
function* getEmployeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(getEmployeeConcessionAct(response.data));
    }
}
function* deleteFeeConcessionListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setDeleteFeeConcessionListAct(response));
    }
}
function* deleteStuConcessionListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setDeleteStuConcessionListAct(response));
    }
}
function* bulkUploadConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setBulkUploadConcessionAct({statusCode : response.status}));
    }
}

function* exportStuConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setExportStuConcessionAct(response.data));
    }
}

function* exportTutionFeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setExportTutionFeeConcessionAct(response.data));
    }
}

// Student Concession Updated

function* getStuConcessionListV2Gen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setStuConcessionListV2Act(response.data));
    }
}

function* deleteStuConcessionListV2Gen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setDeleteStuConcessionListV2Act({statusCode : response.status}));
    }
}

function* saveStuConcessionListV2Gen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setSaveStuConcessionListV2Act({statusCode : response.status}));
    }
}

function* editStuConcessionListV2Gen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setEditStuConcessionListV2Act({statusCode : response.status}));
    }
}

function* getStuConcessionV2ByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setStuConcessionV2ByIdAct(response.data));
    }
}

function* getExportStuConcessionV2Gen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setExportStuConcessionV2Act(response.data));
    }
}

function* bulkUploadConcessionV2Gen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(blukUploadConcessionError(response.error));
    } else {
        yield put(setBulkUploadConcessionV2Act({statusCode : response.status}));
    }
}

function* getPrevStuConcessionListV2Gen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(feeConcessionError(response.error));
    } else {
        yield put(setPrevStuConcessionListV2Act(response.data));
    }
}

export default function* feeConcessionSaga() {
    yield takeLatest(FeeConcessionConstants.STUDENT_CONCESSION_LIST, getStudentConcessionListGen);
    yield takeLatest(FeeConcessionConstants.STUDENT_CONCESSION_BY_ID, getStudentConcessionByIdGen);
    yield takeLatest(FeeConcessionConstants.ADD_STUDENT_CONCESSION, addStudentConcessionGen);
    yield takeLatest(FeeConcessionConstants.PREVIOUS_STUDENT_CONCESSION, getPreviousStudentConcessionGen);
    yield takeLatest(FeeConcessionConstants.EDIT_STUDENT_CONCESSION, editStudentConcessionGen);
    yield takeLatest(FeeConcessionConstants.CONCESSION_LEDGER_DETAILS, getConcessionLedgerDetailsGen);
    yield takeLatest(FeeConcessionConstants.TUTION_FEE_CONCESSION_LIST, getTutionFeeConcessionGen);
    yield takeLatest(FeeConcessionConstants.TUTION_FEE_CONCESSION_BY_ID, getTutionFeeConcessionByIdGen);
    yield takeLatest(FeeConcessionConstants.ADD_TUTION_FEE_CONCESSION, addTutionFeeConcessionGen);
    yield takeLatest(FeeConcessionConstants.EDIT_TUTION_FEE_CONCESSION, editTutionFeeConcessionGen);
    yield takeLatest(FeeConcessionConstants.EMPLOYEE_CONCESSION_LIST, getEmployeeConcessionGen);
    yield takeLatest(FeeConcessionConstants.DELETE_FEE_CONCESSION_LIST, deleteFeeConcessionListGen);
    yield takeLatest(FeeConcessionConstants.DELETE_STUDENT_CONCESSION_LIST, deleteStuConcessionListGen);
    yield takeLatest(FeeConcessionConstants.BULK_UPLOAD_CONCESSION, bulkUploadConcessionGen);
    yield takeLatest(FeeConcessionConstants.EXPORT_STU_CONCESSION, exportStuConcessionGen);
    yield takeLatest(FeeConcessionConstants.EXPORT_TUTION_FEE_CONCESSION, exportTutionFeeConcessionGen);

    // Student Concession Updated

    yield takeLatest(FeeConcessionConstants.GET_STU_CONCESSION_LIST_V2, getStuConcessionListV2Gen);
    yield takeLatest(FeeConcessionConstants.DELETE_STU_CONCESSION_LIST_V2, deleteStuConcessionListV2Gen);
    yield takeLatest(FeeConcessionConstants.SAVE_STU_CONCESSION_LIST_V2, saveStuConcessionListV2Gen);
    yield takeLatest(FeeConcessionConstants.EDIT_STU_CONCESSION_LIST_V2, editStuConcessionListV2Gen);
    yield takeLatest(FeeConcessionConstants.STU_CONCESSION_LIST_V2_BY_ID, getStuConcessionV2ByIdGen);
    yield takeLatest(FeeConcessionConstants.EXPORT_STU_CONCESSION_LIST_V2, getExportStuConcessionV2Gen);
    yield takeLatest(FeeConcessionConstants.BULK_UPLOAD_CONCESSION_V2, bulkUploadConcessionV2Gen);
    yield takeLatest(FeeConcessionConstants.PREV_STU_CONCESSION_LIST_V2, getPrevStuConcessionListV2Gen);
}