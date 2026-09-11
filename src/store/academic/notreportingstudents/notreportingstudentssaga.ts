import {call,put,takeLatest} from "redux-saga/effects";
import { getData , postData , putData , deleteData } from "../../../api/apiactions";
import { NotReportingStudentsConstants } from "./notreportingstudentsconstants";
import { ICreatedActionType } from "../../types";
import { setAddNotReportingStuAct, setApproveStuIdCardAct, setByIdNotReportingStuAct, setDeleteNotReportingStuAct, setDownloadStudentIdCardZipAct, setEditNotReportingStuAct, setExportNotReportingListAct, setExportStudentIdCardListAct, setIdCardAmountAct, setIdCardCollectedByParentAct, setIdCardListAct, setIdCardLogsAct, setNotReportingStuErrAct, setNotReportingStuListAct, setPayStuIdCardAct, setPreviewIssuedIdcardAct, setRequestReuploadIdCardAct, setSaveVlidateStudentStatusAct, setSendIdCardNotifcationAct, setStuDetailsAct } from "./notreportingstudentsslice";

function* notReportingStuListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setNotReportingStuListAct(response.data));
    }
}

function* addNotReportingStuGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setAddNotReportingStuAct({statusCode : response.status}));
    }
}

function* editNotReportingStuGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(putData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setEditNotReportingStuAct({statusCode : response.status}));
    }
}

function* deleteNotReportingStuGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(deleteData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setDeleteNotReportingStuAct({statusCode : response.status}));
    }
}

function* getByIdNotReportingStuGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setByIdNotReportingStuAct(response.data));
    }
}

//Id-Card
function* idCardListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setIdCardListAct(response.data));
    }
}

function* approveStuIdCardGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setApproveStuIdCardAct({statusCode : response.status}));
    }
}

function* payStuIdCardGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setPayStuIdCardAct({statusCode : response.status}));
    }
}

function* idCardAmountGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setIdCardAmountAct(response.data));
    }
}

function* getIdCardLogsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) { 
    yield put(setNotReportingStuErrAct(response.error));
  } else {
    yield put(setIdCardLogsAct(response.data));
  }
}

function* sendIdCardNotifcationGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setSendIdCardNotifcationAct({statusCode : response.status}));
    }
}

function* idCardCollectedByParentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else if (response.status !== 200) {
        // Only dispatch the action if status is not already 200
        yield put(setIdCardCollectedByParentAct({ statusCode: response.status }));
    }
}


function* previewIssuedIdCardGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setNotReportingStuErrAct(response.error));
  } else {
    yield put(setPreviewIssuedIdcardAct(response?.data));
  }
}
function* getStuDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setStuDetailsAct(response.data));
    }
}
function* exportStudentIdCardListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setExportStudentIdCardListAct(response.data));
    }
}
function* downloadStudentIdCardZipGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setNotReportingStuErrAct(response.error));
        } else {
            yield put(setDownloadStudentIdCardZipAct(response.data));
        }
    }
function* exportNotReportingListgen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setExportNotReportingListAct(response.data));
    }
}

function* requestReuploadIdCardGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setRequestReuploadIdCardAct({statusCode : response.status}));
    }
}
function* saveVlidateStudentStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setNotReportingStuErrAct(response.error));
    } else {
        yield put(setSaveVlidateStudentStatusAct(response.status));
    }
}
export default function* notReportingStuSaga(){
    yield takeLatest(NotReportingStudentsConstants.GET_NOT_REPORTING_STU_LIST ,notReportingStuListGen);
    yield takeLatest(NotReportingStudentsConstants.ADD_NOT_REPORTING_STU ,addNotReportingStuGen);
    yield takeLatest(NotReportingStudentsConstants.EDIT_NOT_REPORTING_STU ,editNotReportingStuGen);
    yield takeLatest(NotReportingStudentsConstants.DELETE_NOT_REPORTING_STU ,deleteNotReportingStuGen);
    yield takeLatest(NotReportingStudentsConstants.GET_BY_ID_NOT_REPORTING_STU ,getByIdNotReportingStuGen);
    yield takeLatest(NotReportingStudentsConstants.EXPORT_NOT_REPORTING_STU ,exportNotReportingListgen);

    //Id-Card
    yield takeLatest(NotReportingStudentsConstants.GET_ID_CARD_LIST ,idCardListGen);
    yield takeLatest(NotReportingStudentsConstants.APPROVE_STU_ID_CARD ,approveStuIdCardGen);
    yield takeLatest(NotReportingStudentsConstants.PAY_STU_ID_CARD ,payStuIdCardGen);
    yield takeLatest(NotReportingStudentsConstants.ID_CARD_AMOUNT ,idCardAmountGen);
    yield takeLatest(NotReportingStudentsConstants.GET_ID_CARD_LOGS,getIdCardLogsGen);
    yield takeLatest(NotReportingStudentsConstants.SEND_ID_CARD_NOTIFCATION ,sendIdCardNotifcationGen);
    yield takeLatest(NotReportingStudentsConstants.ID_CARD_COLLECTED_BY_PARENT ,idCardCollectedByParentGen);  
    yield takeLatest(NotReportingStudentsConstants.PREVIEW_ISSUED_ID_CARD, previewIssuedIdCardGen);
    yield takeLatest(NotReportingStudentsConstants.GET_STU_DETAILS, getStuDetailsGen);
    yield takeLatest(NotReportingStudentsConstants.EXPORT_STUDENT_ID_CARD_LIST, exportStudentIdCardListGen);
    yield takeLatest(NotReportingStudentsConstants.DOWNLOAD_STUDENT_ID_CARD_ZIP, downloadStudentIdCardZipGen);
    yield takeLatest(NotReportingStudentsConstants.REQUEST_REUPLOAD_ID_CARD , requestReuploadIdCardGen);
    yield takeLatest(NotReportingStudentsConstants.SAVE_VALIDATE_STUDENT_STATUS, saveVlidateStudentStatusGen);
        

}