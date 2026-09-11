import {call,put,takeLatest} from "redux-saga/effects";
import { ICreatedActionType } from "../../types";

import { getData , postData , putData , deleteData } from "../../../api/apiactions";
import { setAddComplaintDeptAct, setComplaintDepartmentErrorAct, setComplaintDepartmentListAct, setDeleteComplaintDeptAct, setEditComplaintDeptAct, setMasterComplaintDeptListAct, setSaveMasterComplaintDeptAct } from "./complaintdepartmentslice";
import { ComplaintDepartmentConstants } from "./complaintdepartmentconstants";


function* getComplaintDepartmentListGen(action:ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setComplaintDepartmentErrorAct(response.error));
    } else {
        yield put(setComplaintDepartmentListAct(response.data));
    }
}

function* getMasterComplaintDeptListGen(action:ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setComplaintDepartmentErrorAct(response.error));
    } else {
        yield put(setMasterComplaintDeptListAct(response.data));
    }
}

function* editComplaintDeptGen(action:ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(putData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setComplaintDepartmentErrorAct(response.error));
    } else {
        yield put(setEditComplaintDeptAct({statusCode : response.status}));
    }
}

function* addComplaintDeptGen(action:ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setComplaintDepartmentErrorAct(response.error));
    } else {
        yield put(setAddComplaintDeptAct({statusCode : response.status}));
    }
}

function* deleteComplaintDeptGen(action:ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(deleteData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setComplaintDepartmentErrorAct(response.error));
    } else {
        yield put(setDeleteComplaintDeptAct({statusCode : response.status}));
    }
}

function* saveMasterComplaintDeptGen(action:ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setComplaintDepartmentErrorAct(response.error));
    } else {
        yield put(setSaveMasterComplaintDeptAct({statusCode : response.status}));
    }
}


export default function* complaintDepartmentSaga(){
    yield takeLatest(ComplaintDepartmentConstants.GET_COMPLAINT_DEPARTMENT_LIST ,getComplaintDepartmentListGen);
    yield takeLatest(ComplaintDepartmentConstants.GET_MASTER_DEPT_LIST ,getMasterComplaintDeptListGen);
    yield takeLatest(ComplaintDepartmentConstants.EDIT_COMPLAINT_DEPT_LIST ,editComplaintDeptGen);
    yield takeLatest(ComplaintDepartmentConstants.ADD_COMPLAINT_DEPT_LIST ,addComplaintDeptGen);
    yield takeLatest(ComplaintDepartmentConstants.DELETE_COMPLAINT_DEPT_LIST ,deleteComplaintDeptGen);
    yield takeLatest(ComplaintDepartmentConstants.SAVE_MASTER_DEPT_LIST ,saveMasterComplaintDeptGen);

}