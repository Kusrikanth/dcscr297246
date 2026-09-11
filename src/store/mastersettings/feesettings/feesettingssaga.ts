import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setInstFeeDepartmentsAct,
    setAddInstFeeDepartmentsAct, setUpdateInstFeeDepartmentAct, setDelInstFeeDepartmentAct,
    setInstFeeNamesAct,
    setAddInstFeeNamesAct, setUpdateInstFeeNameAct, setDeleteInstFeeNameAct,
    setInstFeeSettingsErrorAct,
    setInstEmployeeConcessionDepartmentAct,
    setInstEmployeeConcessionAct,
    setDeleteInstEmployeeConcessionAct,
    setInstConcessionDepartmentsAct,
    setInstFeeNamesByDeptAct,
    setAddIntEmployeeConcessionAct,
    setUpdateIntEmployeeConcessionAct,
    setPaymentGatewaysListAct,
    setPaymentGatewaysBranchListAct,
    setSavePaymentGatewaysBranchAct
} from "./feesettingsslice";
import { FeeSettingsConstants } from "./feesettingsconstants";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { deleteInstFeeNameAct } from "./feesettingsactions";

function* getInstFeeDepartmentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setInstFeeDepartmentsAct(response.data));
    }
}

function* addInstFeeDepartmentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddInstFeeDepartmentsAct(response.data));
    }
}

function* updateInstFeeDepartmentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateInstFeeDepartmentAct(response.data));
    }
}

function* deleteInstFeeDepartmentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDelInstFeeDepartmentAct({ statusCode: response.status }));
    }
}

function* getInstFeeNamesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setInstFeeNamesAct(response.data));
    }
}

function* addInstFeeNamesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddInstFeeNamesAct(response.data));
    }
}

function* updateInstFeeNameGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateInstFeeNameAct(response.data));
    }
}

function* deleteInstFeeNameGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteInstFeeNameAct({ statusCode: response.status }));
    }
}

function* getInstConcessionDepartmentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {        
        yield put(setInstConcessionDepartmentsAct(response));
    }
}
function* getInstFeeNamesByDeptGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {        
        yield put(setInstFeeNamesByDeptAct(response.data));
    }
}
function* addInstEmployeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {        
        yield put(setAddIntEmployeeConcessionAct(response.data));
    }
}
function* updateInstEmployeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {        
        yield put(setUpdateIntEmployeeConcessionAct(response));
    }
}
function* getInstEmployeeConcessionDepartmentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setInstEmployeeConcessionDepartmentAct(response.data));
    }
}
function* getInstEmployeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setInstEmployeeConcessionAct(response.data));
    }
}
function* deleteInstEmployeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteInstEmployeeConcessionAct({ statusCode: response.status }));
    }
}
function* getPaymentGatewaysListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setPaymentGatewaysListAct(response.data));
    }
}
function* getPaymentGatewaysBranchListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setPaymentGatewaysBranchListAct(response.data));
    }
}
function* savePaymentGatewaysBranchGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInstFeeSettingsErrorAct(response.error));
    } else {
        yield put(setSavePaymentGatewaysBranchAct({ statusCode: response.status }));
    }
}

export default function* instituteInfoSaga() {
    yield takeLatest(FeeSettingsConstants.GET_INST_FEE_DEPARTMENTS_REQUEST, getInstFeeDepartmentsGen);
    yield takeLatest(FeeSettingsConstants.ADD_INST_FEE_DEPARTMENTS_REQUEST, addInstFeeDepartmentsGen);
    yield takeLatest(FeeSettingsConstants.UPDATE_INST_FEE_DEPARTMENT_REQUEST, updateInstFeeDepartmentGen);
    yield takeLatest(FeeSettingsConstants.DELETE_INST_FEE_DEPARTMENT_REQUEST, deleteInstFeeDepartmentGen);
    
    yield takeLatest(FeeSettingsConstants.GET_INST_FEE_NAMES_REQUEST, getInstFeeNamesGen);
    yield takeLatest(FeeSettingsConstants.ADD_INST_FEE_NAME_REQUEST, addInstFeeNamesGen);
    yield takeLatest(FeeSettingsConstants.UPDATE_INST_FEE_NAME_REQUEST, updateInstFeeNameGen);
    yield takeLatest(FeeSettingsConstants.DELETE_INST_FEE_NAME_REQUEST, deleteInstFeeNameGen);
    
    yield takeLatest(FeeSettingsConstants.GET_INST_CONCESSION_DEPARTMENTS_REQUEST, getInstConcessionDepartmentsGen);
    yield takeLatest(FeeSettingsConstants.GET_INST_FEE_NAME_BY_DEPT_REQUEST, getInstFeeNamesByDeptGen);
    yield takeLatest(FeeSettingsConstants.ADD_INST_EMPLOYEE_CONCESSION_REQUEST, addInstEmployeeConcessionGen);
    yield takeLatest(FeeSettingsConstants.UPDATE_INST_EMPLOYEE_CONCESSION_REQUEST, updateInstEmployeeConcessionGen);
    yield takeLatest(FeeSettingsConstants.GET_INST_EMPLOYEE_CONSESSION_DEPATMENT_REQUEST, getInstEmployeeConcessionDepartmentGen);
    yield takeLatest(FeeSettingsConstants.GET_INST_EMPLOYEE_CONSESSION_REQUEST, getInstEmployeeConcessionGen);
    yield takeLatest(FeeSettingsConstants.DELETE_INST_EMPLOYEE_CONCESSION_REQUEST, deleteInstEmployeeConcessionGen);
    yield takeLatest(FeeSettingsConstants.GET_PAYMENT_GATEWAYS_LIST_RESP, getPaymentGatewaysListGen)
    yield takeLatest(FeeSettingsConstants.GET_PAYMENT_GATEWAYS_BRANCHLIST_RESP,
        getPaymentGatewaysBranchListGen
    )
    yield takeLatest(FeeSettingsConstants.SAVE_PAYMENT_GATEWAYS_BRANCH_ITEM,savePaymentGatewaysBranchGen)
}