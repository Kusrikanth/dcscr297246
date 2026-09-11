import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setInterviewSchedulesListAct,
    setStudentsForInterviewScheduleAct,
    setScheduleInterviewAct, setInterviewDetailsAct, setUpdateInterviewDetailsAct,
    setDelInterviewAct, setInterviewErrorAct, setObservationAndInterviewReportAct,
    setEvaluationClassList, setObservationAndInterviewReportByIdAct,
    setPanelInterviewResultListAct, setObservationAndInterviewerReportListWhileSavingAct,
    setSaveObservationReportAct, setPanelInterviewResultListWhileSavingAct,
    setObservationInterviewSubjectsAct, setPanIntResCancelAdmissionAct,
    setEditObsAndIntReportAct, setSavePanelIntResultAct, setPanIntResByIdAct,
    setEditPanIntResAct, setSendNotifiPanIntResAct, setExportPanIntListAct,
    setExportObsIntListAct, setExportPanIntResListAct, setRegistrationPaymentDetailsAct
} from "./interviewslice";
import { InterviewConstants } from "./interviewconstants";
import {
    deleteData,
    getData,
    postData,
    putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getInterviewSchedulesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setInterviewSchedulesListAct(response.data));
    }
}
function* getStudentsForInterviewScheduleGen(action: ICreatedActionType): any {
    const { payload } = action;
    let response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setInterviewErrorAct(response.data));
    } else {
        yield put(setStudentsForInterviewScheduleAct(response.data));
    }
}
function* scheduleInterviewGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setScheduleInterviewAct(response.data));
    }
}
function* getEvaluationClassList(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setEvaluationClassList(response.data));
    }
}
function* getInterviewDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setInterviewDetailsAct(response.data));
    }
}
function* updateInterviewScheduleGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setUpdateInterviewDetailsAct({ statusCode: response.status }));
    }
}

function* delInterviewGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setDelInterviewAct({ statusCode: response.status }));
    }
}
function* getObservationAndInterviewerReportListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setObservationAndInterviewReportAct(response.data));
    }
}
function* getObservationAndInterviewerReportListWhileSavingGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setObservationAndInterviewerReportListWhileSavingAct(response.data));
    }
}
function* saveObservationReportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setSaveObservationReportAct(response.data));
    }
}
function* getObservationInterviewSubjectsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setObservationInterviewSubjectsAct(response.data));
    }
}
function* getPanelInterviewResultListWhileSavingGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setPanelInterviewResultListWhileSavingAct(response.data));
    }
}
function* panIntResCancelAdmissionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setPanIntResCancelAdmissionAct(response));
    }
}
function* getPanelInterviewResultListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setPanelInterviewResultListAct(response.data));
    }
}
function* getObservationAndInterviewReportByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setObservationAndInterviewReportByIdAct(response.data));
    }
}
function* savePanelIntResultGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setSavePanelIntResultAct(response.data));
    }
}
function* getPanIntResByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setPanIntResByIdAct(response.data));
    }
}
function* editPanIntResGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setEditPanIntResAct(response));
    }
}
function* editObsAndIntReportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setEditObsAndIntReportAct(response.data));
    }
}
function* exportPanIntListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setExportPanIntListAct(response.data));
    }
}
function* exportObsIntListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setExportObsIntListAct(response.data));
    }
}
function* exportPanIntResListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setExportPanIntResListAct(response.data));
    }
}
function* sendNotifiPanIntResGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setSendNotifiPanIntResAct(response));
    }
}

function* registrationPaymentDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setInterviewErrorAct(response.error));
    } else {
        yield put(setRegistrationPaymentDetailsAct(response?.data));
    }
}

export default function* interviewSaga() {
    yield takeLatest(InterviewConstants.GET_INTERVIEW_SCHEDULES_LIST_REQUEST, getInterviewSchedulesListGen);
    yield takeLatest(InterviewConstants.STUDENTS_FOR_INTERVIEW_SCHEDULE_REQUEST, getStudentsForInterviewScheduleGen);
    yield takeLatest(InterviewConstants.SCHEDULE_INTERVIEW_REQUEST, scheduleInterviewGen);
    yield takeLatest(InterviewConstants.EVALUATION_CLASS_LIST, getEvaluationClassList);
    yield takeLatest(InterviewConstants.GET_INTERVIEW_DETAILS_REQUEST, getInterviewDetailsGen);
    yield takeLatest(InterviewConstants.UPDATE_INTERVIEW_SCHEDULE_REQUEST, updateInterviewScheduleGen);
    yield takeLatest(InterviewConstants.DELETE_INTERVIEW_REQUEST, delInterviewGen);
    yield takeLatest(InterviewConstants.OBSERVATION_AND_INTERVIEWER_REPORT, getObservationAndInterviewerReportListGen);
    yield takeLatest(InterviewConstants.OBSERVATION_AND_INTERVIEWER_REPORT_WHILE_SAVING, getObservationAndInterviewerReportListWhileSavingGen);
    yield takeLatest(InterviewConstants.OBSERVATION_AND_INTERVIEWER_REPORT_BY_ID, getObservationAndInterviewReportByIdGen);
    yield takeLatest(InterviewConstants.GET_PANEL_INTERVIEW_RESULT_LIST, getPanelInterviewResultListGen);
    yield takeLatest(InterviewConstants.SAVE_OBSERVATION_REPORT, saveObservationReportGen);
    yield takeLatest(InterviewConstants.PANEL_INTERVIEW_RESULT_LIST_WHILE_SAVING, getPanelInterviewResultListWhileSavingGen);
    yield takeLatest(InterviewConstants.GET_OBSERVATION_INTERVIEW_SUBJECTS, getObservationInterviewSubjectsGen);
    yield takeLatest(InterviewConstants.PAN_INT_RES_CANCEL_ADMISSION, panIntResCancelAdmissionGen);
    yield takeLatest(InterviewConstants.EDIT_OBS_AND_INT_REPORT, editObsAndIntReportGen);
    yield takeLatest(InterviewConstants.SAVE_PANEL_INTERVIEW_RESULT, savePanelIntResultGen);
    yield takeLatest(InterviewConstants.GET_PAN_INT_RES_BY_ID, getPanIntResByIdGen);
    yield takeLatest(InterviewConstants.EDIT_PAN_INT_RES, editPanIntResGen);
    yield takeLatest(InterviewConstants.SEND_NOTIFI_PAN_INT_RES, sendNotifiPanIntResGen);
    yield takeLatest(InterviewConstants.EXPORT_PAN_INT_LIST, exportPanIntListGen);
    yield takeLatest(InterviewConstants.EXPORT_OBS_INT_LIST, exportObsIntListGen);
    yield takeLatest(InterviewConstants.EXPORT_PAN_INT_RES_LIST, exportPanIntResListGen);
    yield takeLatest(InterviewConstants.REGISTRATION_PAYMENT_DETAILS, registrationPaymentDetailsGen);
}