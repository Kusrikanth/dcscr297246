import { call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../types";
import { getData, deleteData, postData, putData } from "../../api/apiactions";
import {
    setCbseVerificationsAct,
    setAddCbseVerificationAct, setStudentSubjectsAct,
    setCbseVerificationErrorAct
} from "./cbseverificationslice";
import { CbseVerificationsConstants } from "./cbseverificationconstants";

function* getCbseVerificationsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseVerificationErrorAct(response.error));
    } else {
        yield put(setCbseVerificationsAct(response.data));
    }
}

function* addCbseVerificationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setCbseVerificationErrorAct(response.error));
    } else {
        yield put(setAddCbseVerificationAct({ cbseVerificationId: response.data }));
    }
}

function* getStudentSubjectsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setCbseVerificationErrorAct(response.error));
    } else {
        yield put(setStudentSubjectsAct(response.data));
    }
}

export default function* cbseVerificationSaga() {
    yield takeLatest(CbseVerificationsConstants.GET_CBSE_VERIFICATIONS_REQUEST, getCbseVerificationsGen);
    yield takeLatest(CbseVerificationsConstants.ADD_CBSE_VERIFICATIONS_REQUEST, addCbseVerificationGen);
    yield takeLatest(CbseVerificationsConstants.GET_STUDENT_SUBJECTS_REQUEST, getStudentSubjectsGen);
}
