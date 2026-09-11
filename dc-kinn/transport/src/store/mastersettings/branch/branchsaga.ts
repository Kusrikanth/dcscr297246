import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setInstBranchesAct, setInstBranchesWithAdminAct, setBranchErrorAct, setAddBranchAct, setUpdateBranchAct,
    setApproveBranchAct,
    setBranchByIdAct, setMainBranchAct, setGetBranchModulesAct, setUpdateBranchModuleAct,
    setAddBranchAdminAct, setUpdateBranchAdminAct,
    setDeleteBranchAct,
    setInstHeaderBranchesAct
} from "./branchslice";
import { BranchConstants } from "./branchconstants";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getInstBranchesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setInstBranchesAct(response.data));
    }
}

function* getInstHeaderBranchesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setInstHeaderBranchesAct(response.data));
    }
}


function* getInstBranchesWithAdminGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setInstBranchesWithAdminAct(response.data));
    }
}


function* addInstBranchGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setAddBranchAct(response.data));
    }
}


function* getBranchByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setBranchByIdAct(response.data));
    }
}
function* updateBranchGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setUpdateBranchAct(response.data));
    }
}
function* approveBranchGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setApproveBranchAct(response.data));
    }
}
function* deleteBranchGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setDeleteBranchAct({ statusCode: response.status }));
    }
}

function* updateMainBranchGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setMainBranchAct({ statusCode: response.status }));
    }
}

function* getBranchModuleGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setGetBranchModulesAct(response.data));
    }
}

function* updateBranchModuleGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setUpdateBranchModuleAct(response.data));
    }
}


function* addBranchAdminGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setAddBranchAdminAct({ statusCode: response.status }));
    }
}


function* updateBranchAdminGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBranchErrorAct(response.error));
    } else {
        yield put(setUpdateBranchAdminAct(response.data));
    }
}


export default function* branchSaga() {
    yield takeLatest(BranchConstants.GET_INSTITUTE_BRANCHES_REQUEST, getInstBranchesGen);
    yield takeLatest(BranchConstants.GET_INSTITUTE_HEADER_BRANCHES_REQUEST, getInstHeaderBranchesGen);
    
    yield takeLatest(BranchConstants.GET_INST_BRANCHES_WITH_ADMIN_REQUEST, getInstBranchesWithAdminGen);
    yield takeLatest(BranchConstants.ADD_INSTITUTE_BRANCH_REQUEST, addInstBranchGen);
    yield takeLatest(BranchConstants.GET_BRANCH_BYID_REQUEST, getBranchByIdGen);
    yield takeLatest(BranchConstants.UPDATE_BRANCH_REQUEST, updateBranchGen);
    yield takeLatest(BranchConstants.APPROVE_BRANCH_REQUEST, approveBranchGen);
    yield takeLatest(BranchConstants.DELETE_BRANCH_REQUEST, deleteBranchGen);
    yield takeLatest(BranchConstants.UPDATE_MAIN_BRANCH_REQUEST, updateMainBranchGen);

    yield takeLatest(BranchConstants.GET_BRANCH_MODULE_REQUEST, getBranchModuleGen);
    yield takeLatest(BranchConstants.UPDATE_BRANCH_MODULE_REQUEST, updateBranchModuleGen);

    yield takeLatest(BranchConstants.ADD_BRANCH_ADMIN_REQUEST, addBranchAdminGen);
    yield takeLatest(BranchConstants.UPDATE_BRANCH_ADMIN_REQUEST, updateBranchAdminGen);
}