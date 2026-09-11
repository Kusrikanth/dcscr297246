import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setBranchBankDetailsAct, setAddBranchBankDetailAct,
    setUpdateBranchBankDetailAct, setDeleteBranchBankDetailAct,
    setBranchBankAreasAct, setAddBranchArealAct, setUpdateBranchAreaAct,
    setDeleteBranchAreaAct,
    setContactPersonsAct, setAddContactPersonAct, setUpdateContactPersonAct, setDeleteContactPersonAct,
    setBrchDepartmentsAct, setAddBrchDepartmentAct, setUpdateBrchDepartmentAct, setDeleteBrchDepartmentAct,

    setBranchInfoErrorAct,
    setBrchLogosAct,
    setAddBrchLogosAct,
    setDeleteBrchLogosAct
} from "./branchinfoslice";
import { BranchInfoConstants } from "./branchinfoconstants";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";


function* getBranchBankDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setBranchBankDetailsAct(response.data));
    }
}
function* addBranchBankDetailGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setAddBranchBankDetailAct({ statusCode: response.status }));
    }
}
function* updateBranchBankDetailGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setUpdateBranchBankDetailAct(response.data));
    }
}
function* deleteBranchBankDetailGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setDeleteBranchBankDetailAct({ statusCode: response.status }));
    }
}


function* getBranchAreasGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setBranchBankAreasAct(response.data));
    }
}
function* addBranchAreaGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setAddBranchArealAct({ statusCode: response.status }));
    }
}
function* updateBranchAreaGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setUpdateBranchAreaAct(response.data));
    }
}
function* deleteBranchAreaGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setDeleteBranchAreaAct({ statusCode: response.status }));
    }
}


function* getContactPersonsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setContactPersonsAct(response.data));
    }
}
function* addContactPersonGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setAddContactPersonAct({ statusCode: response.status }));
    }
}
function* updateContactPersonGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setUpdateContactPersonAct({ statusCode: response.status }));
    }
}
function* deleteContactPersonGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setDeleteContactPersonAct({ statusCode: response.status }));
    }
}



function* getBrchDepartmentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setBrchDepartmentsAct(response.data));
    }
}
function* addBrchDepartmentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setAddBrchDepartmentAct({ statusCode: response.status }));
    }
}
function* updateBrchDepartmentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setUpdateBrchDepartmentAct(response.data));
    }
}
function* deleteBrchDepartmentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setDeleteBrchDepartmentAct({ statusCode: response.status }));
    }
}

// Logo's
function* getBrchLogosGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setBrchLogosAct(response.data));
    }
}
function* addBrchLogoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setAddBrchLogosAct({ statusCode: response.status }));
    }
}
function* deleteBrchLogoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchInfoErrorAct(response.error));
    } else {
        yield put(setDeleteBrchLogosAct({ statusCode: response.status }));
    }
}

export default function* branchInfoSaga() {
    yield takeLatest(BranchInfoConstants.GET_BRANCH_BANK_DETAILS_REQUEST, getBranchBankDetailsGen);
    yield takeLatest(BranchInfoConstants.ADD_BRANCH_BANK_DETAIL_REQUEST, addBranchBankDetailGen);
    yield takeLatest(BranchInfoConstants.UPDATE_BRANCH_BANK_DETAIL_REQUEST, updateBranchBankDetailGen);
    yield takeLatest(BranchInfoConstants.DELETE_BRANCH_BANK_DETAIL_REQUEST, deleteBranchBankDetailGen);

    yield takeLatest(BranchInfoConstants.GET_BRANCH_AREAS_REQUEST, getBranchAreasGen);
    yield takeLatest(BranchInfoConstants.ADD_BRANCH_AREA_REQUEST, addBranchAreaGen);
    yield takeLatest(BranchInfoConstants.UPDATE_BRANCH_AREA_REQUEST, updateBranchAreaGen);
    yield takeLatest(BranchInfoConstants.DELETE_BRANCH_AREA_REQUEST, deleteBranchAreaGen);

    yield takeLatest(BranchInfoConstants.GET_BRANCH_CONTACT_PERSONS_REQUEST, getContactPersonsGen);
    yield takeLatest(BranchInfoConstants.ADD_BRANCH_CONTACT_PERSON_REQUEST, addContactPersonGen);
    yield takeLatest(BranchInfoConstants.UPDATE_BRANCH_CONTACT_PERSON_REQUEST, updateContactPersonGen);
    yield takeLatest(BranchInfoConstants.DELETE_BRANCH_CONTACT_PERSON_REQUEST, deleteContactPersonGen);

    yield takeLatest(BranchInfoConstants.GET_BRANCH_DEPARTMENTS_REQUEST, getBrchDepartmentsGen);
    yield takeLatest(BranchInfoConstants.ADD_BRANCH_DEPARTMENT_REQUEST, addBrchDepartmentGen);
    yield takeLatest(BranchInfoConstants.UPDATE_BRANCH_DEPARTMENT_REQUEST, updateBrchDepartmentGen);
    yield takeLatest(BranchInfoConstants.DELETE_BRANCH_DEPARTMENT_REQUEST, deleteBrchDepartmentGen);

    // Logo's
    yield takeLatest(BranchInfoConstants.GET_BRANCH_LOGOS_REQUEST, getBrchLogosGen);
    yield takeLatest(BranchInfoConstants.ADD_BRANCH_LOGO_REQUEST, addBrchLogoGen);
    yield takeLatest(BranchInfoConstants.DELETE_BRANCH_LOGO_REQUEST, deleteBrchLogoGen);
}