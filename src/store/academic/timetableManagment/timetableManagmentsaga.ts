import {call,put,takeLatest} from "redux-saga/effects";
import { getData , postData , putData , deleteData } from "../../../api/apiactions";
import { timetableManagmentConstants } from "./timetableManagmentconstants";
import { ICreatedActionType } from "../../types";
import { setBreaksAct, setBreaksTypeAct, setDeleteBreaksAct, setDeleteBreaksTypeAct, setDeletePeriodCategoryAct, setPeriodCategoryAct, setSaveBreaksAct, setSaveBreaksTypeAct, setSavePeriodCategoryAct, setSaveTimetableAct, setSubjectsTeacherAct, setTimeTableAct, setTimeTableErrAct, setUpdateBreaksAct, setUpdateBreaksTypeAct, setUpdatePeriodCategoryAct, setViewParentTimeTableAct, setViewTeacherTimeTableAct, setViewTimeTableAct, setWeeksAct } from "./timetableManagmentslice";


//Period Category
function* getPeriodCategoryGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setPeriodCategoryAct(response.data));
    }
}
function* deletePeriodCategoryGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(deleteData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setDeletePeriodCategoryAct({statusCode: response.status}));
    }
}
function* savePeriodCategoryGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setSavePeriodCategoryAct({statusCode: response.status}));
    }
}
function* updatePeriodCategoryGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(putData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setUpdatePeriodCategoryAct({statusCode: response.status}));
    }
}

//break type

function* getBreaksTypeGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setBreaksTypeAct(response.data));
    }
}
function* saveBreaksTypeGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setSaveBreaksTypeAct({statusCode: response.status}));
    }
}
function* deleteBreaksTypeGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(deleteData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setDeleteBreaksTypeAct({statusCode: response.status}));
    }
}
function* updateBreaksTypeGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(putData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setUpdateBreaksTypeAct({statusCode: response.status}));
    }
}

//create timetable
function* getWeeksGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setWeeksAct(response.data));
    }
}
function* getSubjectsTeacherGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setSubjectsTeacherAct(response.data));
    }
}
function* saveTimetableGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setSaveTimetableAct({statusCode: response.status}));
    }
}
function* getTimeTableGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setTimeTableAct(response.data));
    }
}
function* viewTimeTableGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setViewTimeTableAct(response.data));
    }
}
function* viewParentTimeTableGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setViewParentTimeTableAct(response.data));
    }
}
function* viewTeacherTimeTableGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setViewTeacherTimeTableAct(response.data));
    }
}

//break
function* getBreaksGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setBreaksAct(response.data));
    }
}
function* saveBreaksGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setSaveBreaksAct({statusCode: response.status}));
    }
}
function* updateBreaksGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setUpdateBreaksAct({statusCode: response.status}));
    }
}
function* deleteBreaksGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(deleteData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setTimeTableErrAct(response.error));
    } else {
        yield put(setDeleteBreaksAct({statusCode: response.status}));
    }
}


export default function* timetableManagmentSaga(){
    //Period Category
    yield takeLatest(timetableManagmentConstants.GET_PERIOD_CATEGORY ,getPeriodCategoryGen);
    yield takeLatest(timetableManagmentConstants.DELETE_PERIOD_CATEGORY ,deletePeriodCategoryGen);
    yield takeLatest(timetableManagmentConstants.SAVE_PERIOD_CATEGORY ,savePeriodCategoryGen);
    yield takeLatest(timetableManagmentConstants.UPDATE_PERIOD_CATEGORY ,updatePeriodCategoryGen);

    //Breaks Type
    yield takeLatest(timetableManagmentConstants.GET_BREAKS_TYPE ,getBreaksTypeGen);
    yield takeLatest(timetableManagmentConstants.SAVE_BREAKS_TYPE ,saveBreaksTypeGen);
    yield takeLatest(timetableManagmentConstants.DELETE_BREAKS_TYPE ,deleteBreaksTypeGen);
    yield takeLatest(timetableManagmentConstants.UPDATE_BREAKS_TYPE ,updateBreaksTypeGen);

    //create timetable
    yield takeLatest(timetableManagmentConstants.GET_WEEKS ,getWeeksGen);
    yield takeLatest(timetableManagmentConstants.GET_SUBJECTS_TEACHER ,getSubjectsTeacherGen);
    yield takeLatest(timetableManagmentConstants.SAVE_TIMETABLE ,saveTimetableGen);
    yield takeLatest(timetableManagmentConstants.GET_TIMETABLE ,getTimeTableGen);
    yield takeLatest(timetableManagmentConstants.VIEW_TIMETABLE ,viewTimeTableGen);
    yield takeLatest(timetableManagmentConstants.VIEW_PARENT_TIMETABLE ,viewParentTimeTableGen);
    yield takeLatest(timetableManagmentConstants.VIEW_TEACHER_TIMETABLE ,viewTeacherTimeTableGen);
    
    //Breaks
    yield takeLatest(timetableManagmentConstants.GET_BREAKS ,getBreaksGen);
    yield takeLatest(timetableManagmentConstants.SAVE_BREAKS ,saveBreaksGen);
    yield takeLatest(timetableManagmentConstants.UPDATE_BREAKS ,updateBreaksGen);
    yield takeLatest(timetableManagmentConstants.DELETE_BREAKS ,deleteBreaksGen);

}