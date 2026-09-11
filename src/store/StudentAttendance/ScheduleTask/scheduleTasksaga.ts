import {call,put,takeLatest} from "redux-saga/effects";
import { getData, postData , putData , deleteData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { ScheduleTaskConstants } from "./scheduleTaskconstants";
import { setAddScheduleTaskAct, setDeleteScheduleTaskAct, setEditScheduleTaskAct, setScheduleListAct, setScheduleTaskErrAct, setUpdateStatusScheduleTaskAct, } from "./scheduleTaskslice";


function* scheduleListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setScheduleTaskErrAct(response.error));
    } else {
        yield put(setScheduleListAct(response.data));
    }
}
function* addScheduleTaskGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setScheduleTaskErrAct(response.error));
    } else {
        yield put(setAddScheduleTaskAct({statusCode : response.status}));
    }
}
function* deleteScheduleTaskGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(deleteData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setScheduleTaskErrAct(response.error));
    } else {
        yield put(setDeleteScheduleTaskAct({statusCode : response.status}));
    }
}
function* editScheduleTaskGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(putData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setScheduleTaskErrAct(response.error));
    } else {
        yield put(setEditScheduleTaskAct({statusCode : response.status}));
    }
}

function* updateSatusScheduleTaskGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(putData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setScheduleTaskErrAct(response.error));
    } else {
        yield put(setUpdateStatusScheduleTaskAct({statusCode : response.status}));
    }
}

export default function* scheduleTaskSaga(){
    yield takeLatest(ScheduleTaskConstants.GET_SCHEDULE_LIST ,scheduleListGen);
    yield takeLatest(ScheduleTaskConstants.ADD_SCHEDULE_TASK ,addScheduleTaskGen);
    yield takeLatest(ScheduleTaskConstants.DELETE_SCHEDULE_TASK ,deleteScheduleTaskGen);
    yield takeLatest(ScheduleTaskConstants.EDIT_SCHEDULE_TASK ,editScheduleTaskGen);
    yield takeLatest(ScheduleTaskConstants.UPDATE_STATUS_SCHEDULE_TASK ,updateSatusScheduleTaskGen);
  

}