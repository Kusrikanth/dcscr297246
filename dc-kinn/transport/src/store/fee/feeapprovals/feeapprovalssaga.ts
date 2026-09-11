import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setApproveRejectItFormAct,
    setStudentFeeItFormAct, setStudentLedgerItFormAct, setStudentsItFormAct,
    setFeeApprovalErrorAct,
    setItFormListByStudentIdAct,
    setRequestItFormListAct,
    setIssuedItFormListAct,
    setRejectItFormListAct,
    setAddNewRequestItFormAct,
    setAdmissionWithdrawalAct, setAddAdmissionWithdrawalAct,
    setChequeHistoryAct, setApproveRejectChequeAct,
    setChequeAdvanceFilterClassAct,
    setDownloadItFormAct,
    setPreviewItFormAct,
    setSentItFormAct,
    setRequestItFormCountAct,
    setFeeCashPaymentsAct,
    setFeeCashPaymentApproveAct,
    setExportFeeChequeListAct,
    setItFormErrorAct,
    setUpdateItFormAct
} from "./feeapprovalsslice";
import { FeeApprovalsConstants } from "./feeapprovalconstants";
import {
    deleteData,
    getData,
    postData,
    putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getRequestItFormListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setRequestItFormListAct(response.data));
    }
}

function* getRequestItFormCountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setRequestItFormCountAct(response.data));
    }
}
function* getIssuedItFormListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setIssuedItFormListAct(response.data));
    }
}
function* getRejectItFormListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setRejectItFormListAct(response.data));
    }
}
function* addNewRequestItFormGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setAddNewRequestItFormAct(response.data));
    }
}

function* approveRejectItFormGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setApproveRejectItFormAct({ statusCode: response.status, message: response.data }));
    }
}

function* itFormListByStudentIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setItFormListByStudentIdAct(response.data));
    }
}

function* downloadItFormGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setDownloadItFormAct(response.data));
    }
}
function* previewItFormGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setPreviewItFormAct(response.data));
    }
}
function* sentItFormGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setSentItFormAct(response.data));
    }
}
function* getStudentFeeItFormGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        
        if (response.error.code === 406) {
            yield put(setItFormErrorAct({ error: response.error, status: 406 }));
        } else {
            yield put(setFeeApprovalErrorAct(response.error));
        }
    } else {
        yield put(setStudentFeeItFormAct(response.data));
    }
}
function* getStudentLedgerItFormGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setStudentLedgerItFormAct(response.data));
    }
}
function* getStudentsItFromGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setStudentsItFormAct(response.data));
    }
}

// function* getAdmissionWithdrawalGen(action: ICreatedActionType): any {
//     const { payload } = action;
//     const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
//     if (response && response.error) {
//         yield put(setFeeApprovalErrorAct(response.error));
//     } else {
//         yield put(setAdmissionWithdrawalAct(response.data));
//     }
// }

// function* addAdmissionWithdrawalGen(action: ICreatedActionType): any {
//     const { payload } = action;
//     const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
//     if (response && response.error) {
//         yield put(setFeeApprovalErrorAct(response.error));
//     } else {
//         yield put(setAddAdmissionWithdrawalAct(response.data));
//     }
// }

function* getChequeHistoryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setChequeHistoryAct(response.data));
    }
}

function* approveRejectChequeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setApproveRejectChequeAct({ statusCode: response.status }));
    }
}

function* chequeAdvanceFilterClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setChequeAdvanceFilterClassAct(response.data));
    }
}

function* feeCashPaymentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setFeeCashPaymentsAct(response.data));
    }
}

function* feeCashPaymentApproveGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setFeeCashPaymentApproveAct(response));
    }
}
function* updateItFormGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setUpdateItFormAct({ statusCode: response.status }));
    }
}

function* exportFeeChequeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setFeeApprovalErrorAct(response.error));
    } else {
        yield put(setExportFeeChequeListAct(response.data));
    }
}

export default function* feeCollectionsSaga() {
    yield takeLatest(FeeApprovalsConstants.GET_REQUEST_ITFORM_REQUEST_LIST, getRequestItFormListGen);
    yield takeLatest(FeeApprovalsConstants.GET_REQUEST_ITFORM_COUNT, getRequestItFormCountGen);
    yield takeLatest(FeeApprovalsConstants.GET_ISSUED_ITFORM_REQUEST_LIST, getIssuedItFormListGen);
    yield takeLatest(FeeApprovalsConstants.GET_REJECTED_ITFORM_REQUEST_LIST, getRejectItFormListGen);
    yield takeLatest(FeeApprovalsConstants.ADD_NEW_REQUEST_ITFORM_REQUEST, addNewRequestItFormGen);
    yield takeLatest(FeeApprovalsConstants.APPROVE_REJECT_ITFORM_REQUEST, approveRejectItFormGen);
    yield takeLatest(FeeApprovalsConstants.ITFORM_BY_STUDENTID_REQUEST, itFormListByStudentIdGen);

    
    yield takeLatest(FeeApprovalsConstants.DOWNLOAD_ITFORM_REQUEST, downloadItFormGen);
    yield takeLatest(FeeApprovalsConstants.PREVIEW_IT_FORM, previewItFormGen);
    yield takeLatest(FeeApprovalsConstants.SENT_IT_FORM, sentItFormGen);
    yield takeLatest(FeeApprovalsConstants.GET_STUDENT_FEE_ITFORM_REQUEST, getStudentFeeItFormGen);
    yield takeLatest(FeeApprovalsConstants.GET_STUDENT_LEDGER_ITFORM_REQUEST, getStudentLedgerItFormGen);
    yield takeLatest(FeeApprovalsConstants.GET_STUDENTS_ITFORM_REQUEST, getStudentsItFromGen);

    // yield takeLatest(FeeApprovalsConstants.GET_ADMISSION_WITHDRAWAL_REQUEST, getAdmissionWithdrawalGen);
    // yield takeLatest(FeeApprovalsConstants.ADD_ADMISSION_WITHDRAWAL_REQUEST, addAdmissionWithdrawalGen);

    yield takeLatest(FeeApprovalsConstants.GET_CHEQUE_HISTORY_REQUEST, getChequeHistoryGen);
    yield takeLatest(FeeApprovalsConstants.APPROVE_REJECT_CHEQUE_REQUEST, approveRejectChequeGen);
    yield takeLatest(FeeApprovalsConstants.CHEQUE_ADVANCE_FILTER_CLASS_REQUEST, chequeAdvanceFilterClassGen);

    yield takeLatest(FeeApprovalsConstants.FEE_CASH_PAYMENTS, feeCashPaymentsGen);
    yield takeLatest(FeeApprovalsConstants.FEE_CASH_APPROVAL, feeCashPaymentApproveGen);
    yield takeLatest(FeeApprovalsConstants.EXPORT_FEE_CHEQUE_LIST, exportFeeChequeListGen);
    yield takeLatest(FeeApprovalsConstants.UPDATE_IT_FORM, updateItFormGen);

}