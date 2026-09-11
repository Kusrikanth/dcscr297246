import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setExaminationSchedulesListAct,
    setStudentsForExaminationScheduleAct,
    setScheduleExaminationAct, setExaminationDetailsAct, setUpdateExaminationDetailsAct,
    setDelExaminationAct, setExaminationErrorAct, setExportExaminationDataAct
} from "./examinationslice";
import { ExaminationConstants } from "./examinationconstants";
import {
    deleteData,
    getData,
    postData,
    putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getExaminationSchedulesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setExaminationErrorAct(response.error));
    } else {
        yield put(setExaminationSchedulesListAct(response.data));
    }
}
function* getStudentsForExaminationScheduleGen(action: ICreatedActionType): any {
    const { payload } = action;
    let response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setExaminationErrorAct(response.data));
    } else {
        yield put(setStudentsForExaminationScheduleAct(response.data));
    }
}
function* scheduleExaminationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setExaminationErrorAct(response.error));
    } else {
        yield put(setScheduleExaminationAct(response.data));
    }
}
function* getExaminationDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setExaminationErrorAct(response.error));
    } else {
        yield put(setExaminationDetailsAct(response.data));
    }
}
function* updateExaminationScheduleGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setExaminationErrorAct(response.error));
    } else {
        yield put(setUpdateExaminationDetailsAct(response.data));
    }
}
function* exportExaminationDataGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setExaminationErrorAct(response.error));
    } else {
        yield put(setExportExaminationDataAct(response.data));
    }
}

function* delExaminationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setExaminationErrorAct(response.error));
    } else {
        yield put(setDelExaminationAct({ statusCode: response.status }));
    }
}

export default function* interviewSaga() {
    yield takeLatest(ExaminationConstants.GET_EXAMINATION_SCHEDULES_LIST_REQUEST, getExaminationSchedulesListGen);
    yield takeLatest(ExaminationConstants.STUDENTS_FOR_EXAMINATION_SCHEDULE_REQUEST, getStudentsForExaminationScheduleGen);
    yield takeLatest(ExaminationConstants.SCHEDULE_EXAMINATION_REQUEST, scheduleExaminationGen);
    yield takeLatest(ExaminationConstants.GET_EXAMINATION_DETAILS_REQUEST, getExaminationDetailsGen);
    yield takeLatest(ExaminationConstants.UPDATE_EXAMINATION_SCHEDULE_REQUEST, updateExaminationScheduleGen);
    yield takeLatest(ExaminationConstants.DELETE_EXAMINATION_REQUEST, delExaminationGen);
    yield takeLatest(ExaminationConstants.EXPORT_EXAMINATION_DATA, exportExaminationDataGen);
}