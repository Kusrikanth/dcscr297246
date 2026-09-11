import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setDeleteRegistrationInstructionAct,
    setGetRegistrationInstructionHtmlByIdAct,
    setRegistrationInstructionAct,
    setRegistrationInstructionErrorAct,
    setSaveRegistrationInstructionAct,
    setUpdateRegistrationInstructionAct,
} from "./registrationinstructionslice";
import { RegistrationInstructionConstants } from "./registrationinstructionconstants";
import {
    deleteData,
    getData,
    postData,
    putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getRegistrationInstructionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setRegistrationInstructionErrorAct(response.error));
    } else {
        yield put(setRegistrationInstructionAct(response.data));
    }
}

function* updateRegistrationInstructionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setRegistrationInstructionErrorAct(response.error));
    } else {
        yield put(setUpdateRegistrationInstructionAct({ statusCode: response.status }));
    }
}

function* saveRegistrationInstructionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setRegistrationInstructionErrorAct(response.error));
    } else {
        yield put(setSaveRegistrationInstructionAct(response.data));
    }
}

function* getRegistrationInstructionHtmlByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setRegistrationInstructionErrorAct(response.error));
    } else {
        yield put(setGetRegistrationInstructionHtmlByIdAct(response.data));
    }
}

function* deleteRegistrationInstructionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setRegistrationInstructionErrorAct(response.error));
    } else {
        yield put(setDeleteRegistrationInstructionAct({ statusCode: response.status }));
    }
}

export default function* registrationInstructionSaga() {
    yield takeLatest(RegistrationInstructionConstants.GET_REGISTRATION_INSTRUCTION, getRegistrationInstructionGen);
    yield takeLatest(RegistrationInstructionConstants.UPDATE_REGISTRATION_INSTRUCTION, updateRegistrationInstructionGen);
    yield takeLatest(RegistrationInstructionConstants.SAVE_REGISTRATION_INSTRUCTION, saveRegistrationInstructionGen);
    yield takeLatest(RegistrationInstructionConstants.GET_REGISTRATION_INSTRUCTION_HTML_BY_ID, getRegistrationInstructionHtmlByIdGen);
    yield takeLatest(RegistrationInstructionConstants.DELETE_REGISTRATION_INSTRUCTION, deleteRegistrationInstructionGen);
}