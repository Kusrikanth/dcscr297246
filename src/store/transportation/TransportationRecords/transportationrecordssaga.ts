import { call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { getData, deleteData, postData, putData } from "../../../api/apiactions";
import {
    setAllStudentsTransRecListAct, setNewRequestListAct,
    setApproveTransportAct, setRequestNoForTransportAct,
    setTransportationRecordsErrorAct,
    setTermsTransportBySlabIdAct,
    setApproveSubmittedTransportAct,
    setTransportRequestByIdAct,
    setDeleteTransportReqAct,
    setExportTransportNewReqAct,
    setChangeRequestListAct,
    setTerminationListAct,
    setExportAllNewRequestAct,
    setAllocationDetailsAct,
    setAddTerminationReqAct,
    setTermsForTerminationReqAct,
    setRejectTerminationReqResp,
    setStuTransportationRecordsAct,
    setExportStuTransportationRecordsAct,
    setEmpTransportationRecordsAct,
    setExportEmpTransportationRecordsAct
} from "./transportationrecordsslice";
import { TransportRecordsConstants } from "./transportationrecordsconstants";

//All Students 

function* getRouteRequestListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setAllStudentsTransRecListAct(response.data));
    }
}

function* exportAllNewRequestGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setExportAllNewRequestAct(response.data));
    }
}

// New Requests

function* getNewRequestListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setNewRequestListAct(response.data));
    }
}


function* approveTransportRequestGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setApproveTransportAct({statusCode : response.status}));
    }
}

function* requestNoTransportRequestGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setRequestNoForTransportAct({ requestNo: response.data }));
    }
}

function* getTermsTransportBySlabIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setTermsTransportBySlabIdAct(response.data));
    }
}

function* getTransportRequestByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setTransportRequestByIdAct(response.data));
    }
}


function* approveSubmittedTransportReqGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setApproveSubmittedTransportAct({ statusCode: response.status }));
    }
}

function* deleteTransportReqGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setDeleteTransportReqAct({ statusCode: response.status }));
    }
}

function* exportTransportNewReqGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setExportTransportNewReqAct(response.data));
    }
}

// change request

function* getChangeRequestListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setChangeRequestListAct(response.data));
    }
}

function* getAllocationDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setAllocationDetailsAct(response.data));
    }
}

// termination

function* getTerminationListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setTerminationListAct(response.data));
    }
}
function* addTerminationReqGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setAddTerminationReqAct({ statusCode: response.status }));
    }
}
function* getTermsForTerminationReqGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setTermsForTerminationReqAct(response.data));
    }
}
function* rejectTerminationReqGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setRejectTerminationReqResp({ statusCode: response.status }));
    }
}

function* getStuTransportationRecordsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setStuTransportationRecordsAct(response.data));
    }
}

function* exportStuTransportationRecordsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setExportStuTransportationRecordsAct(response.data));
    }
}

function* getEmpTransportationRecordsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setEmpTransportationRecordsAct(response.data));
    }
}

function* exportEmpTransportationRecordsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setTransportationRecordsErrorAct(response.error));
    } else {
        yield put(setExportEmpTransportationRecordsAct(response.data));
    }
}



export default function* transportRecordsSaga() {

    //All Students

    yield takeLatest(TransportRecordsConstants.GET_ALL_STUDENTS_LIST, getRouteRequestListGen);
    yield takeLatest(TransportRecordsConstants.EXPORT_ALL_NEW_REQUEST, exportAllNewRequestGen);

    // New Requests
    yield takeLatest(TransportRecordsConstants.APPROVE_TRANSPORT_REQUEST, approveTransportRequestGen);
    yield takeLatest(TransportRecordsConstants.GET_NEW_REQUEST_LIST, getNewRequestListGen);
    yield takeLatest(TransportRecordsConstants.GET_REQUESTNO_TRANSPORT_REQUEST, requestNoTransportRequestGen);
    yield takeLatest(TransportRecordsConstants.GET_TERMS_FORTRANSPORT_BYSLABID_REQUEST, getTermsTransportBySlabIdGen);

    yield takeLatest(TransportRecordsConstants.GET_TRANSPORTINFO_BYID_REQUEST, getTransportRequestByIdGen);
    yield takeLatest(TransportRecordsConstants.APPROVE_SUBMITTED_TRANSPORT_REQUEST, approveSubmittedTransportReqGen);
    yield takeLatest(TransportRecordsConstants.DELETE_TRANSPORT_NEW_REQUEST, deleteTransportReqGen);
    yield takeLatest(TransportRecordsConstants.EXPORT_TRANSPORT_NEW_REQUEST, exportTransportNewReqGen);

    // change request
    yield takeLatest(TransportRecordsConstants.GET_CHANGE_REQUEST_LIST, getChangeRequestListGen);
    yield takeLatest(TransportRecordsConstants.GET_ALLOCATION_DETAILS, getAllocationDetailsGen);

    // termination
    yield takeLatest(TransportRecordsConstants.GET_TERMINATION_LIST, getTerminationListGen);
    yield takeLatest(TransportRecordsConstants.ADD_TERMINATION_REQUEST, addTerminationReqGen);
    yield takeLatest(TransportRecordsConstants.GET_TERMS_FOR_TERMINATION_REQUEST, getTermsForTerminationReqGen);
    yield takeLatest(TransportRecordsConstants.REJECT_TERMINATION_REQUEST, rejectTerminationReqGen);

    // student records
    yield takeLatest(TransportRecordsConstants.GET_STU_TRANSPORTAION_RECORDS, getStuTransportationRecordsGen);
    yield takeLatest(TransportRecordsConstants.EXPORT_STU_TRANSPORTAION_RECORDS, exportStuTransportationRecordsGen);

    // employee records
    yield takeLatest(TransportRecordsConstants.GET_EMP_TRANSPORTAION_RECORDS, getEmpTransportationRecordsGen);
    yield takeLatest(TransportRecordsConstants.EXPORT_EMP_TRANSPORTAION_RECORDS, exportEmpTransportationRecordsGen);

}