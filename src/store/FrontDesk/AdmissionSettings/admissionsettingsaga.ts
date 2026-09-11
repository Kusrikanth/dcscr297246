import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { AdmissionSettingConstants } from "./admissionsettingconstant";
import {
    deleteData,
    getData,
    postData,
    putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import {
    setAdmissionAvailablityListAct, setAdmissionSettingErrorAct,
    setEditProposedAdmissionAct, setProposedAdmissionListAct,
    setGetAdmissionWithdrawalAct, setAdmissionWithdrawaByidAct,
    setCreateAdmissionWithdrawalAct,
    setSearchStudentAdmissionWithdrawalAct,
    setUpdateAdmissionWithdrawalAct,
    setCreateFeeAdmissionWithdrawalAct,
    setGetAdmissionWithdrawalApprovedAct,
    setDeleteAdmissionWithdrawalAct,
    setBranchClassLanguageAct,
    setSaveBranchClassLanguageAct,
    setUpdateBranchClassLanguageAct,
    setDeleteBranchClassLanguageAct
} from "./admissionsettingslice";

function* getAdmissionAvailabilityListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setAdmissionAvailablityListAct(response.data));
    }
}

function* getProposedAdmissionListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setProposedAdmissionListAct(response.data));
    }
}
function* editProposedAdmissionActGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setEditProposedAdmissionAct(response));
    }
}

function* addProposedAdmissionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        // yield put(setAddAdmissionWithdrawalAct(response.data));
    }
}

function* getAdmissionWithdrawalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setGetAdmissionWithdrawalAct(response.data));
    }
}

function* getAdmissionWithdrawalByidGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setAdmissionWithdrawaByidAct(response.data));
    }
}

function* createAdmissionWithdrawalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setCreateAdmissionWithdrawalAct(response.data));
    }
}

function* searchStudentAdmissionWithdrawalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setSearchStudentAdmissionWithdrawalAct(response.data));
    }
}

function* updateAdmissionWithdrawalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setUpdateAdmissionWithdrawalAct({ status: response.status }));
    }
}

function* deleteAdmissionWithdrawalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setDeleteAdmissionWithdrawalAct({ status: response.status }));
    }
}


function* createFeeAdmissionWithdrawalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setCreateFeeAdmissionWithdrawalAct(response.data));
    }
}


function* getAdmissionWithdrawalApprovedGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setGetAdmissionWithdrawalApprovedAct(response.data));
    }
}
function* getBranchClassLanguageGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setBranchClassLanguageAct(response.data));
    }
}
function* saveBranchClassLanguageGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setSaveBranchClassLanguageAct({ status: response.status }));
    }
}
function* updateBranchClassLanguageGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setUpdateBranchClassLanguageAct({ status: response.status }));
    }
}
function* deleteBranchClassLanguageGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionSettingErrorAct(response.error));
    } else {
        yield put(setDeleteBranchClassLanguageAct({ status: response.status }));
    }
}

export default function* AdmissionRequestSaga() {
    yield takeLatest(AdmissionSettingConstants.ADMISSION_AVAILABILITY_LIST_REQUEST, getAdmissionAvailabilityListGen);
    yield takeLatest(AdmissionSettingConstants.PROPOSED_ADMISSION_LIST_REQUEST, getProposedAdmissionListGen);
    yield takeLatest(AdmissionSettingConstants.ADD_PROPOSED_ADMISSION, addProposedAdmissionGen);
    yield takeLatest(AdmissionSettingConstants.EDIT_PROPOSED_ADMISSION, editProposedAdmissionActGen);

    yield takeLatest(AdmissionSettingConstants.GET_ADMISSION_WITHDRAWAL_REQUEST, getAdmissionWithdrawalGen);
    yield takeLatest(AdmissionSettingConstants.GET_ADMISSION_WITHDRAWAL_BYID_REQUEST, getAdmissionWithdrawalByidGen);
    yield takeLatest(AdmissionSettingConstants.CREATE_ADMISSION_WITHDRAWAL_REQUEST, createAdmissionWithdrawalGen);
    yield takeLatest(AdmissionSettingConstants.SEARCH_STUDENT_ADMISSION_WITHDRAWAL_REQUEST, searchStudentAdmissionWithdrawalGen);

    yield takeLatest(AdmissionSettingConstants.UPDATE_ADMISSION_WITHDRAWAL_REQUEST, updateAdmissionWithdrawalGen); 
    yield takeLatest(AdmissionSettingConstants.DELETE_ADMISSION_WITHDRAWAL_REQUEST, deleteAdmissionWithdrawalGen);

    yield takeLatest(AdmissionSettingConstants.CREATE_FEE_ADMISSION_WITHDRAWAL_REQUEST, createFeeAdmissionWithdrawalGen); 
    yield takeLatest(AdmissionSettingConstants.GET_ADMISSION_WITHDRAWAL_APPROVED_REQUEST, getAdmissionWithdrawalApprovedGen);
    yield takeLatest(AdmissionSettingConstants.GET_BRANCH_CLASS_LANGUAGE, getBranchClassLanguageGen);
    yield takeLatest(AdmissionSettingConstants.SAVE_BRANCH_CLASS_LANGUAGE, saveBranchClassLanguageGen);
    yield takeLatest(AdmissionSettingConstants.UPDATE_BRANCH_CLASS_LANGUAGE, updateBranchClassLanguageGen);
    yield takeLatest(AdmissionSettingConstants.DELETE_BRANCH_CLASS_LANGUAGE, deleteBranchClassLanguageGen);

}


