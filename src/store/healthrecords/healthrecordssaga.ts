import { call, put, takeLatest } from "redux-saga/effects";
import { deleteData, getData, postData, putData } from "../../api/apiactions";
import { ICreatedActionType } from "../types";
import { setDeleteMedicenListAct, setDeleteMiRoomListAct, setDeleteSubAlingmentsListAct, setEditHealthRecordsListAct, setEditMedicenListAct, setEditMiRoomListAct, setEditSubAlingmentsListAct, setEmpHealthDetailsAct, setExportEmpHealthRecordsAct, setExportHealthRecordsAct, setExportStudentHealthIssuesAct, setHealthRecordsErrResp, setHealthRecordsListAct, setHealthRecordsListByIdAct, setMedicenListAct, setMedicenListByIdAct, setMiRoomListAct, setMiRoomListByIdAct, setRegistrationHealthIssueListAct, setSaveHealthRecordsListAct, setSaveMedicenListAct, setSaveMiRoomListAct, setSaveSubAlingmentsListAct, setStuAlimentListAct, setStuHealthDetailsAct, setStuHealthIssueListAct, setSubAlingmentsListAct, } from "./healthrecordsslice";
import { HealthRecordsConstants } from "./healthrecordsconstants";

function* getHealthRecordsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setHealthRecordsListAct(response.data));
    }
}

function* getStuHealthDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setStuHealthDetailsAct(response.data));
    }
}
function* getEmpHealthDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setEmpHealthDetailsAct(response.data));
    }
}

function* getStuAlimentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setStuAlimentListAct(response.data));
    }
}

function* saveHealthRecordsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setSaveHealthRecordsListAct({statusCode : response.status}));
    }
}

function* getHealthRecordsListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setHealthRecordsListByIdAct(response.data));
    }
}

function* editHealthRecordsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setEditHealthRecordsListAct({statusCode : response.status}));
    }
}

function* exportHealthRecordGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setExportHealthRecordsAct(response.data));
    }
}

function* exportEmpHealthRecordGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setExportEmpHealthRecordsAct(response.data));
    }
}
// MI Rooms

function* getMiRoomListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setMiRoomListAct(response.data));
    }
}

function* getMiRoomListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setMiRoomListByIdAct(response.data));
    }
}

function* editMiRoomListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setEditMiRoomListAct({status : response.statusCode}));
    }
}

function* saveMiRoomListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setSaveMiRoomListAct({status : response.statusCode}));
    }
}

function* deleteMiRoomListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setDeleteMiRoomListAct({status : response.statusCode}));
    }
}


function* getStuHealthIssueListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setStuHealthIssueListAct(response.data));
    }
}

function* exportStudentHealthIssuesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setExportStudentHealthIssuesAct(response.data));
    }
}

function* getRegistrationHealthIssueListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setRegistrationHealthIssueListAct(response.data));
    }
}

//settings
//Sub Alingments
function* getSubAlingmentsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setSubAlingmentsListAct(response.data));
    }
}

function* saveSubAlingmentsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setSaveSubAlingmentsListAct({status : response.statusCode}));
    }
}


function* editSubAlingmentsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setEditSubAlingmentsListAct({status : response.statusCode}));
    }
}
function* deleteSubAlingmentsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setDeleteSubAlingmentsListAct({status : response.statusCode}));
    }
}

// Medicen

function* getMedicenListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setMedicenListAct(response.data));
    }
}

function* getMedicenListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setMedicenListByIdAct(response.data));
    }
}

function* editMedicenListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setEditMedicenListAct({status : response.statusCode}));
    }
}

function* saveMedicenListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setSaveMedicenListAct({status : response.statusCode}));
    }
}

function* deleteMedicenListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHealthRecordsErrResp(response.error));
    } else {
        yield put(setDeleteMedicenListAct({status : response.statusCode}));
    }
}
export default function* healthRecordsRequestSaga() {

    // health records

    yield takeLatest(HealthRecordsConstants.GET_HEALTH_RECORDS_LIST, getHealthRecordsListGen);
    yield takeLatest(HealthRecordsConstants.GET_STU_HEALTH_DETAILS, getStuHealthDetailsGen);
    yield takeLatest(HealthRecordsConstants.GET_EMP_HEALTH_DETAILS, getEmpHealthDetailsGen);
    yield takeLatest(HealthRecordsConstants.GET_STU_ALIMENT_LIST, getStuAlimentListGen);
    yield takeLatest(HealthRecordsConstants.SAVE_HEALTH_RECORD_LIST, saveHealthRecordsListGen);
    yield takeLatest(HealthRecordsConstants.GET_HEALTH_RECORDS_LIST_BY_ID, getHealthRecordsListByIdGen);
    yield takeLatest(HealthRecordsConstants.EDIT_HEALTH_RECORD_LIST, editHealthRecordsListGen);
    yield takeLatest(HealthRecordsConstants.EXPORT_HEALTH_RECORDS, exportHealthRecordGen);
    yield takeLatest(HealthRecordsConstants.EXPORT_EMP_HEALTH_RECORDS, exportEmpHealthRecordGen);
    
    // mi rooms

    yield takeLatest(HealthRecordsConstants.GET_MI_ROOM_LIST, getMiRoomListGen);
    yield takeLatest(HealthRecordsConstants.GET_MI_ROOM_LIST_BY_ID, getMiRoomListByIdGen);
    yield takeLatest(HealthRecordsConstants.EDIT_MI_ROOM_LIST, editMiRoomListGen);
    yield takeLatest(HealthRecordsConstants.SAVE_MI_ROOM_LIST, saveMiRoomListGen);
    yield takeLatest(HealthRecordsConstants.DELETE_MI_ROOM_LIST, deleteMiRoomListGen);

    yield takeLatest(HealthRecordsConstants.GET_STU_HEALTH_ISSUE_LIST, getStuHealthIssueListGen);
    yield takeLatest(HealthRecordsConstants.EXPORT_STUDENTS_HEALTH_ISSUES, exportStudentHealthIssuesGen);
    yield takeLatest(HealthRecordsConstants.GET_REGISTRATION_HEALTH_ISSUE_LIST, getRegistrationHealthIssueListGen);
    //settings
    //alinments
    yield takeLatest(HealthRecordsConstants.GET_SUB_ALINGMENTS_LIST, getSubAlingmentsListGen);
    yield takeLatest(HealthRecordsConstants.SAVE_SUB_ALINGMENTS_LIST, saveSubAlingmentsListGen);
    yield takeLatest(HealthRecordsConstants.EDIT_SUB_ALINGMENTS_LIST, editSubAlingmentsListGen);
    yield takeLatest(HealthRecordsConstants.DELETE_SUB_ALINGMENTS_LIST, deleteSubAlingmentsListGen);

    // mi rooms

    yield takeLatest(HealthRecordsConstants.GET_Medicen_LIST, getMedicenListGen);
    yield takeLatest(HealthRecordsConstants.GET_Medicen_LIST_BY_ID, getMedicenListByIdGen);
    yield takeLatest(HealthRecordsConstants.EDIT_Medicen_LIST, editMedicenListGen);
    yield takeLatest(HealthRecordsConstants.SAVE_Medicen_LIST, saveMedicenListGen);
    yield takeLatest(HealthRecordsConstants.DELETE_Medicen_LIST, deleteMedicenListGen);

}