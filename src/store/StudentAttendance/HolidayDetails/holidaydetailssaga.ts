import { call, put, takeLatest } from "redux-saga/effects";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import {
    setHolidayDetailsErrAct,

    setHolidayClassesAct, setAddHolidayAct, setHolidayByIdAct, setUpdateHolidayAct, setDeleteHolidayAct,
    setHolidayDetailsListAct, setExportHolidayAct,
    setAttendanceHolidayDetailsListAct,setBrchClassHolidaysAct
} from "./holidaydetailsslice";
import { HolidayDetailsConstants } from "./holidaydetailsconstants";

function* getHolidayDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHolidayDetailsErrAct(response.error));
    } else {
        yield put(setHolidayDetailsListAct(response.data));
    }
}

function* getHolidayClassesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHolidayDetailsErrAct(response.error));
    } else {
        yield put(setHolidayClassesAct(response.data));
    }
}

function* getHolidayByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHolidayDetailsErrAct(response.error));
    } else {
        yield put(setHolidayByIdAct(response.data));
    }
}

function* addHolidayGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHolidayDetailsErrAct(response.error));
    } else {
        yield put(setAddHolidayAct(response.data));
    }
}

function* updateHolidayGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHolidayDetailsErrAct(response.error));
    } else {
        yield put(setUpdateHolidayAct(response.data));
    }
}

function* deleteHolidayGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHolidayDetailsErrAct(response.error));
    } else {
        yield put(setDeleteHolidayAct({ statusCode: response.status }));
    }
}

function* exportHolidayGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHolidayDetailsErrAct(response.error));
    } else {
        yield put(setExportHolidayAct(response.data));
    }
}
function* getBrchClassHolidaysGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHolidayDetailsErrAct(response.error));
    } else {
        yield put(setBrchClassHolidaysAct(response.data));
    }
}

// attendence holiday details

function* getAttendanceHolidayDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHolidayDetailsErrAct(response.error));
    } else {
        yield put(setAttendanceHolidayDetailsListAct(response.data));
    }
}



export default function* holidayDetailRequestSaga() {
    yield takeLatest(HolidayDetailsConstants.GET_HOLIDAY_DETAILES_LIST, getHolidayDetailsListGen);
    yield takeLatest(HolidayDetailsConstants.HOLIDAY_DETAILS_CLASSES_REQUEST, getHolidayClassesGen);
    yield takeLatest(HolidayDetailsConstants.HOLIDAY_DETAILS_BYID_LIST, getHolidayByIdGen);
    yield takeLatest(HolidayDetailsConstants.ADD_HOLIDAY_DETAILS_REQUEST, addHolidayGen);
    yield takeLatest(HolidayDetailsConstants.UPDATE_HOLIDAY_DETAILS_REQUEST, updateHolidayGen);
    yield takeLatest(HolidayDetailsConstants.DELETE_HOLIDAY_DETAILS_REQUEST, deleteHolidayGen);
    yield takeLatest(HolidayDetailsConstants.EXPORT_HOLIDAY_DETAILS_REQUEST, exportHolidayGen);
    yield takeLatest(HolidayDetailsConstants.GET_ATTENDANCE_HOLIDAY_DETAILES_LIST, getAttendanceHolidayDetailsListGen);
    yield takeLatest(HolidayDetailsConstants.GET_BRCH_CLASS_HOLIDAYS, getBrchClassHolidaysGen);

}