import { call, put, takeLatest } from "redux-saga/effects";
import { deleteData, getData, postData, putData } from "../../../../api/apiactions";
import { ICreatedActionType } from "../../../types";
import {
    setHostelStuLedgerListAct, setHostelStuLedgerErrAct, setHostelStuLedgerDetailsAct,
    setHostelChequeClearanceListAct, setDownloadHostelFeeReceiptAct, setExportHostelStuLedgerAct,
    setHostelPayfeeDetailsAct, setHostelStudentAvailabilityAct,
    setExportHostelConcessionAct, setDeleteHostelConcessionAct, setExportHostelFeeReceiptAct, setExportHostelChequeClearanceAct, setExportHostelFeeReversalAct, setExportHostelShortListAct, setHostelFeeRefundsListAct,
    setExportHostelFeeRefundsAct,
    setHostelFeeFinesListAct,
    setHostelFeeNamesAct,
    setAddHostelFeeFinesAct,
    setDeleteHostelFeeFinesAct,
    setUpdateHostelFeeFinesAct,
    setNotifyHostelDueFeePaymentAct,
    setExportHostelDueFeePaymentAct,
} from "./hostelstudentledgerslice";
import { HostelStudentLedgerConstants } from "./hostelstudentledgerconstants";


function* getHostelStuLedgerListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setHostelStuLedgerListAct(response.data));
    }
}

function* getHostelStuLedgerDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setHostelStuLedgerDetailsAct(response.data));
    }
}

function* getHostelChequeClearanceListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setHostelChequeClearanceListAct(response.data));
    }
}

function* downloadHostelFeeReceiptGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setDownloadHostelFeeReceiptAct(response.data));
    }
}
function* exportHostelStuLedgerGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setExportHostelStuLedgerAct(response.data));
    }
}

function* getHostelPayfeeDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setHostelPayfeeDetailsAct(response.data));
    }
}

function* getHostelStudentAvailabilityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setHostelStudentAvailabilityAct(response.data));
    }
}

function* notifyHostelDueFeePaymentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setNotifyHostelDueFeePaymentAct({ statusCode: response.status }));
    }
}

function* exportHostelDueFeePaymentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setExportHostelDueFeePaymentAct(response.data));
    }
}

function* exportHostelConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setExportHostelConcessionAct(response.data));
    }
}

function* deleteHostelConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setDeleteHostelConcessionAct({ statusCode: response.status }));
    }
}

function* exportHostelFeeReceiptGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setExportHostelFeeReceiptAct(response.data));
    }
}

function* exportHostelChequeClearanceGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setExportHostelChequeClearanceAct(response.data));
    }
}

function* exportHostelFeeReversalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setExportHostelFeeReversalAct(response.data));
    }
}

function* exportHostelShortListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setExportHostelShortListAct(response.data));
    }
}

function* getHostelFeeRefundsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setHostelFeeRefundsListAct(response.data));
    }
}

function* exportHostelFeeRefundsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setExportHostelFeeRefundsAct(response.data));
    }
}

function* exportHostelFeeFineListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setHostelFeeFinesListAct(response.data));
    }
}

function* getHostelFeeNamesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setHostelFeeNamesAct(response.data));
    }
}

function* addHostelFeeFineGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setAddHostelFeeFinesAct({ statusCode: response.status }));
    }
}

function* deleteHostelFeeFineGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setDeleteHostelFeeFinesAct({ statusCode: response.status }));
    }
}

function* updateHostelFeeFineGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setHostelStuLedgerErrAct(response.error));
    } else {
        yield put(setUpdateHostelFeeFinesAct({ statusCode: response.status }));
    }
}
export default function* holidayDetailRequestSaga() {
    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_STU_LEDGER_LIST, getHostelStuLedgerListGen);
    yield takeLatest(HostelStudentLedgerConstants.HOSTEL_STU_LEDGER_DETAILS, getHostelStuLedgerDetailsGen);
    yield takeLatest(HostelStudentLedgerConstants.HOSTEL_CHEQUE_CLEARANCE_LIST, getHostelChequeClearanceListGen);
    yield takeLatest(HostelStudentLedgerConstants.DOWNLOAD_HOSTEL_FEE_RECEIPT, downloadHostelFeeReceiptGen);
    yield takeLatest(HostelStudentLedgerConstants.EXPORT_HOSTEL_STU_LEDGER_LIST, exportHostelStuLedgerGen);
    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_PAY_FEE_DETAILS, getHostelPayfeeDetailsGen);
    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_STUDENT_AVAILABILITY, getHostelStudentAvailabilityGen);
    yield takeLatest(HostelStudentLedgerConstants.NOTIFY_HOSTEL_DUEFEE_PAYMENT_REQUEST, notifyHostelDueFeePaymentGen);
    yield takeLatest(HostelStudentLedgerConstants.EXPORT_HOSTEL_DUEFEE_PAYMENT_REQUEST, exportHostelDueFeePaymentGen);

    

    //Hostel Concession
    yield takeLatest(HostelStudentLedgerConstants.EXPORT_HOSTEL_CONCESSION, exportHostelConcessionGen);
    yield takeLatest(HostelStudentLedgerConstants.DELETE_HOSTEL_CONCESSION, deleteHostelConcessionGen);


    //Hostel Concession
    yield takeLatest(HostelStudentLedgerConstants.EXPORT_HOSTEL_FEE_RECEIPT, exportHostelFeeReceiptGen);

    //Hostel Cheque Clearance
    yield takeLatest(HostelStudentLedgerConstants.EXPORT_HOSTEL_CHEQUE_CLEARENCE, exportHostelChequeClearanceGen);


    //Hostel Cheque Clearance
    yield takeLatest(HostelStudentLedgerConstants.EXPORT_HOSTEL_FEE_REVERSAL, exportHostelFeeReversalGen);


    //Hostel Shortlist
    yield takeLatest(HostelStudentLedgerConstants.EXPORT_HOSTEL_SHORTLIST, exportHostelShortListGen);

    // Hostel Fee Refunds
    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_FEE_REFUNDS_LIST, getHostelFeeRefundsListGen);
    yield takeLatest(HostelStudentLedgerConstants.EXPORT_HOSTEL_FEE_REFUNDS, exportHostelFeeRefundsGen);

    // Hostel Fee Fines
    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_FEE_FINE_LIST, exportHostelFeeFineListGen);
    yield takeLatest(HostelStudentLedgerConstants.GET_HOSTEL_FEE_NAMES, getHostelFeeNamesGen);
    yield takeLatest(HostelStudentLedgerConstants.ADD_HOSTEL_FEE_FINE, addHostelFeeFineGen);
    yield takeLatest(HostelStudentLedgerConstants.DELETE_HOSTEL_FEE_FINE, deleteHostelFeeFineGen);
    yield takeLatest(HostelStudentLedgerConstants.UPDATE_HOSTEL_FEE_FINE, updateHostelFeeFineGen);

}