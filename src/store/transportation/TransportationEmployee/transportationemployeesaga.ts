import { call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { getData, deleteData, postData, putData } from "../../../api/apiactions";
import {
    setTransportEmployeesAct,
    setAddTransportEmployeeAct, setTransportEmployeeByidAct, setUpdateTransportEmployeeAct,
    setUpdateTransempActinactAct, setDeleteTransportEmployeeAct,
    setTransportEmployeeErrorAct,
    setEmployeeTypeListAct,
    setAadharValidationAct,
    setExportTransportEmployeeAct
} from "./transportationemployeeslice";
import { TransportEmployeeConstants } from "./transportationemployeeconstants";

function* getTransportEmployeesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportEmployeeErrorAct(response.error));
    } else {
        yield put(setTransportEmployeesAct(response.data));
    }
}

function* addTransportEmployeeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportEmployeeErrorAct(response.error));
    } else {
        yield put(setAddTransportEmployeeAct(response.data));
    }
}

function* transportEmployeeByidGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportEmployeeErrorAct(response.error));
    } else {
        yield put(setTransportEmployeeByidAct(response.data));
    }
}

function* updateTransportEmployeeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportEmployeeErrorAct(response.error));
    } else {
        yield put(setUpdateTransportEmployeeAct(response.data));
    }
}

function* updateTransempActinactGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportEmployeeErrorAct(response.error));
    } else {
        yield put(setUpdateTransempActinactAct({statusCode : response.status}));
    }
}

function* deleteTransportEmployeeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportEmployeeErrorAct(response.error));
    } else {
        yield put(setDeleteTransportEmployeeAct({statusCode : response.status}));
    }
}

function* getEmployeeTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportEmployeeErrorAct(response.error));
    } else {
        yield put(setEmployeeTypeListAct(response.data));
    }
}
function* getAadharValidationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportEmployeeErrorAct(response.error));
    } else {
        yield put(setAadharValidationAct(response.data));
    }
}
function* exportTransportEmployeeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setTransportEmployeeErrorAct(response.error));
    } else {
        yield put(setExportTransportEmployeeAct(response.data));
    }
}

export default function* transportEmployeeSaga() {
    yield takeLatest(TransportEmployeeConstants.GET_TRANSPORT_EMPLOYEE_REQUEST, getTransportEmployeesGen);
    yield takeLatest(TransportEmployeeConstants.ADD_TRANSPORT_EMPLOYEE_REQUEST, addTransportEmployeeGen);
    yield takeLatest(TransportEmployeeConstants.TRANSPORT_EMPLOYEE_BYID_REQUEST, transportEmployeeByidGen);
    yield takeLatest(TransportEmployeeConstants.UPDATE_TRANSPORT_EMPLOYEE_REQUEST, updateTransportEmployeeGen);
    yield takeLatest(TransportEmployeeConstants.UPDATE_TRANSEMP_ACTINACT_REQUEST, updateTransempActinactGen);
    yield takeLatest(TransportEmployeeConstants.DELETE_TRANSPORT_EMPLOYEE_REQUEST, deleteTransportEmployeeGen);
    yield takeLatest(TransportEmployeeConstants.GET_EMPLOYEE_TYPE_LIST, getEmployeeTypeListGen);
    yield takeLatest(TransportEmployeeConstants.GET_AADHAR_VALIDATION, getAadharValidationGen);
    yield takeLatest(TransportEmployeeConstants.EXPORT_TRANSPORT_EMPLOYEE, exportTransportEmployeeGen);
}
