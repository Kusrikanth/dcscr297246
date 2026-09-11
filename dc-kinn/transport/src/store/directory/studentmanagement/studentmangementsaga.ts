import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setStudentsStatsAct, setStudentsListAct, setAddStudentAct, setUpdateStudentAct,
    setGetStudentByIdAct, setDeleteStudentAct, setUploadStudentDocumentAct,
    setStudentMngmntErrorAct, setDownDocumentByIdAct, setStudentsByFilterAct,
    setPastEductionClassAct,
    setPermanentAddressStateResp, setPermanentAddressCityResp,
    setExportStudentDataAct,
    setStudentFatherEmployeeDetailsAct, setStudentMotherEmployeeDetailsAct,
    setGetSiblingDetailsAct, setParentChildrensAct, setAllParentsListAct,
    setParentDetailsByIdResp,
    setParentsStatsAct, setUpdatePrimaryContactAct,
    setStudentListByRegNoAct, setStudentDetailsByRegNoAct,
    setStudentsIdsListAct,
    setExportParentListAct,
    setSendCredentialsParentAct,
    setUpdateStudentDetailsAct,
    setUpdateWhatsappnoAct,
    setStudentAttendanceAct,
    setDeleteDocByIdAct,
    setExportStudentRegistrationDataAct,
    setClassWiseDocumentListAct
} from "./studentmanagementslice";
import { StudentManagementConstants } from "./studentmanagementconstants";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getStudentAttandanceGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setStudentAttendanceAct(response.data));
    }
}

function* getStudentsStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setStudentsStatsAct(response.data));
    }
}

function* getStudentsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setStudentsListAct(response.data));
    }
}


function* getStudentsIDsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setStudentsIdsListAct(response.data));
    }
}

function* addStudentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setAddStudentAct(response.data));
    }
}

function* updateStudentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setUpdateStudentAct({ data: response.data, affectedSection: payload.optionalConfig.affectedSection }));
    }
}

function* getStudentByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setGetStudentByIdAct(response.data));
    }
}

function* getSiblingDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setGetSiblingDetailsAct(response.data));
    }
}

function* downloadDocumentByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setDownDocumentByIdAct(response.data));
    }
}

function* deleteStudentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setDeleteStudentAct({ statusCode: response.status }));
    }
}

function* uploadStudentDocumentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setUploadStudentDocumentAct(response.data));
    }
}

function* classWiseDocumentListGen(action: ICreatedActionType): any {
  const { payload } = action;

  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setStudentMngmntErrorAct(response.error));
  } else {
    yield put(setClassWiseDocumentListAct(response.data));
  }
}

function* getStudentsByFilterGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setStudentsByFilterAct(response.data));
    }
}

function* exportStudentDataGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setExportStudentDataAct(response.data));
    }
}

function* exportStudentRegistrationDataGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setExportStudentRegistrationDataAct(response.data));
    }
}

function* pastEducationClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setPastEductionClassAct(response.data));
    }
}

function* permanentAddressStateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setPermanentAddressStateResp(response.data));
    }
}
function* permanentAddressCityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setPermanentAddressCityResp(response.data));
    }
}

function* getStudentFatherEmployeeDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setStudentFatherEmployeeDetailsAct(response.data));
    }
}

function* getStudentMotherEmployeeDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setStudentMotherEmployeeDetailsAct(response.data));
    }
}

function* getParentDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setParentDetailsByIdResp(response.data));
    }
}

function* getAllParentsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setAllParentsListAct(response.data));
    }
}

function* getParentChildrensGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setParentChildrensAct(response.data));
    }
}

function* getParentsStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setParentsStatsAct(response.data));
    }
}

function* updatePrimaryContactGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setUpdatePrimaryContactAct({ statusCode: response.status }));
    }
}



function* getStudentListByRegNoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setStudentListByRegNoAct(response.data));
    }
}


function* getStudentDetailByRegNoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setStudentDetailsByRegNoAct(response.data));
    }
}
function* exportParentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setExportParentListAct(response.data));
    }
}
function* sendCredentialsParentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setSendCredentialsParentAct({ statusCode: response.status }));
    }
}
function* updateStudentDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setUpdateStudentDetailsAct({ data: response.data, affectedSection: payload.optionalConfig.affectedSection }));
    }
}

function* updateWhatsappnoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setUpdateWhatsappnoAct(response.data));
    }
}

function* deleteDocByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setStudentMngmntErrorAct(response.error));
    } else {
        yield put(setDeleteDocByIdAct({statusCode : response.status}));
    }
}


export default function* studentManagementSaga() {
    yield takeLatest(StudentManagementConstants.GET_STUDENT_ATTENDANCE, getStudentAttandanceGen);
    yield takeLatest(StudentManagementConstants.GET_STUDENTS_STATS_REQUEST, getStudentsStatsGen);
    yield takeLatest(StudentManagementConstants.GET_STUDENTS_LIST_REQUEST, getStudentsListGen);
    yield takeLatest(StudentManagementConstants.GET_STUDENTS_IDSLIST_REQUEST, getStudentsIDsListGen);
    yield takeLatest(StudentManagementConstants.ADD_STUDENT_REQUEST, addStudentGen);
    yield takeLatest(StudentManagementConstants.UPDATE_STUDENT_REQUEST, updateStudentGen);
    yield takeLatest(StudentManagementConstants.GET_STUDENT_BYID_REQUEST, getStudentByIdGen);
    yield takeLatest(StudentManagementConstants.GET_SIBLING_DETAILS_REQUEST, getSiblingDetailsGen);
    yield takeLatest(StudentManagementConstants.DOWNLOAD_DOCUMENT_BYID_REQUEST, downloadDocumentByIdGen);
    yield takeLatest(StudentManagementConstants.UPLOAD_STUDENT_DOCUMENT_REQUEST, uploadStudentDocumentGen);
    yield takeLatest(StudentManagementConstants.CLASS_WISE_DOCUMENT_LIST, classWiseDocumentListGen);
    yield takeLatest(StudentManagementConstants.DELETE_STUDENT_REQUEST, deleteStudentGen);
    yield takeLatest(StudentManagementConstants.GET_STUDENTS_BYFILTER_REQUEST, getStudentsByFilterGen);
    yield takeLatest(StudentManagementConstants.EXPORT_STUDENT_DATA_REQUEST, exportStudentDataGen);
    yield takeLatest(StudentManagementConstants.EXPORT_STUDENT_REGISTRATION_DATA_REQUEST, exportStudentRegistrationDataGen);
    yield takeLatest(StudentManagementConstants.PAST_EDUCATION_CLASS_REQUEST, pastEducationClassGen);
    yield takeLatest(StudentManagementConstants.PERMANENT_ADDRESS_STATE_REQUEST, permanentAddressStateGen);
    yield takeLatest(StudentManagementConstants.PERMANENT_ADDRESS_CITY_REQUEST, permanentAddressCityGen);

    yield takeLatest(StudentManagementConstants.STUDENT_FATHER_EMPLOYEE_DETAILS_REQUEST, getStudentFatherEmployeeDetailsGen);
    yield takeLatest(StudentManagementConstants.STUDENT_MOTHER_EMPLOYEE_DETAILS_REQUEST, getStudentMotherEmployeeDetailsGen);
    yield takeLatest(StudentManagementConstants.GET_ALL_PARENTS_LIST_REQUEST, getAllParentsListGen);
    yield takeLatest(StudentManagementConstants.GET_PARENT_DETAILS_BYID_REQUEST, getParentDetailsByIdGen);
    yield takeLatest(StudentManagementConstants.GET_PARENT_CHIDRENS_REQUEST, getParentChildrensGen);
    yield takeLatest(StudentManagementConstants.GET_PARENTS_STATS_REQUEST, getParentsStatsGen);
    yield takeLatest(StudentManagementConstants.UPDATE_PRIMARY_CONTACT_REQUEST, updatePrimaryContactGen);

    yield takeLatest(StudentManagementConstants.GET_STUDENTLIST_BYREGNO_REQUEST, getStudentListByRegNoGen);
    yield takeLatest(StudentManagementConstants.GET_STUDENT_DETAIL_BYREGNO_REQUEST, getStudentDetailByRegNoGen);
    yield takeLatest(StudentManagementConstants.EXPORT_PARENT_lIST, exportParentListGen);
    yield takeLatest(StudentManagementConstants.SEND_CREDENTIALS_PARENT, sendCredentialsParentGen);
    yield takeLatest(StudentManagementConstants.UPDATE_STUDENT_DETAILS, updateStudentDetailsGen);
    yield takeLatest(StudentManagementConstants.UPDATE_WHATSAPP_NUMBER_REQUEST, updateWhatsappnoGen);
    yield takeLatest(StudentManagementConstants.DELETE_DOC_BY_ID, deleteDocByIdGen);

}