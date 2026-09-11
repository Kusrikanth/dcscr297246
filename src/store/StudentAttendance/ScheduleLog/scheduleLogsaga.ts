import {call,put,takeLatest} from "redux-saga/effects";
import { getData, postData , putData , deleteData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { setScheduleLogErrAct, setScheduleLogListAct } from "./scheduleLogslice";
import { ScheduleLogConstants } from "./scheduleLogconstants";



function* scheduleLogListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setScheduleLogErrAct(response.error));
    } else {
        yield put(setScheduleLogListAct(response.data));
    }
}



export default function* scheduleLogSaga(){
    yield takeLatest(ScheduleLogConstants.GET_SCHEDULE_LOG_LIST ,scheduleLogListGen);
   
}