import {call,put,takeLatest} from "redux-saga/effects";
import { getData, postData , putData , deleteData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { StudentLongLeavesConstants } from "./studentlongleavesconstants";
import { setApproveStuLongLeavesAct, setDeleteStuLongLeavesAct, setEditStuLongLeavesAct, setSaveStuLongLeavesAct, setSearchStuLongLeavesAct, setStuLongLeavesByIdAct, setStuLongLeavesErrAct, setStuLongLeavesListAct } from "./studentlongleavesslice";


function* stuLongLeavesListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuLongLeavesErrAct(response.error));
    } else {
        yield put(setStuLongLeavesListAct(response.data));
    }
}

function* saveStuLongLeavesGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuLongLeavesErrAct(response.error));
    } else {
        yield put(setSaveStuLongLeavesAct({statusCode : response.status}));
    }
}

function* deleteStuLongLeavesGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(deleteData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuLongLeavesErrAct(response.error));
    } else {
        yield put(setDeleteStuLongLeavesAct({statusCode : response.status}));
    }
}

function* editStuLongLeavesGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(putData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuLongLeavesErrAct(response.error));
    } else {
        yield put(setEditStuLongLeavesAct({statusCode : response.status}));
    }
}

function* stuLongLeavesByIdGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuLongLeavesErrAct(response.error));
    } else {
        yield put(setStuLongLeavesByIdAct(response.data));
    }
}

function* searchStuLongLeavesGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuLongLeavesErrAct(response.error));
    } else {
        yield put(setSearchStuLongLeavesAct(response.data));
    }
}

function* approveStuLongLeavesGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(putData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setStuLongLeavesErrAct(response.error));
    } else {
        yield put(setApproveStuLongLeavesAct({statusCode : response.status}));
    }
}
export default function* studentLongLeavesRequestSaga(){
    yield takeLatest(StudentLongLeavesConstants.GET_STU_LONG_LEAVES_LIST ,stuLongLeavesListGen);
    yield takeLatest(StudentLongLeavesConstants.SAVE_STU_LONG_LEAVES ,saveStuLongLeavesGen);
    yield takeLatest(StudentLongLeavesConstants.DELETE_STU_LONG_LEAVES ,deleteStuLongLeavesGen);
    yield takeLatest(StudentLongLeavesConstants.EDIT_STU_LONG_LEAVES ,editStuLongLeavesGen);
    yield takeLatest(StudentLongLeavesConstants.GET_STU_LONG_LEAVES_BY_ID ,stuLongLeavesByIdGen);
    yield takeLatest(StudentLongLeavesConstants.SEARCH_STU_LONG_LEAVES ,searchStuLongLeavesGen);
    yield takeLatest(StudentLongLeavesConstants.APPROVE_STU_LONG_LEAVES ,approveStuLongLeavesGen);

}