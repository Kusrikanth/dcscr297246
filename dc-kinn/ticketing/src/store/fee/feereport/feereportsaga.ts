import { call, put, takeLatest } from "redux-saga/effects";
import { getData, postData, putData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { FeeReportConstants } from "./feereportconstants";
import {
    setFeeNameByTypeAct, setfeeTermByTypeAct, setFeeNameForFilterAct,
    setFeeCollectionReportAct,
    setExportFeeCollectionAct,
    setFeeReportErrorAct,
    setUnpaidListAct,
    setUnpaidFeedbackListAct,
    setSendEmailSmsUnpaidListAct,
    setFeedbackByIdAct,
    setFillFeedbackFormAct,
    setExportUnpaidListAct,
    setFullEmployeeConcessionAct,
    setCbseVerifyReportAct,
    setDownloadCbseVerifyListAct,
    setExportCbseVerificationAct,
    setFeeDashboardStatsAct,
    setFeeDashboardTransactionSummaryAct,
    setFeeCollectionDashboardAct,
    setFeeDashboardCollectionStatsAct,
    setFeeRevenueDashboardAct,
    setFeeDashboardConcessionAct,
    setccAvenueOrderStatsAct,
    setFeeDashboardPaymentModeAct,
    setNetPaidFeeByBranchAct,
    setBranchWiseDueSummaryAct,
    setUnpaidStudentCountAct,
    setBranchWiseNetPaidByDateAct,
    setBranchWiseNetAmountAct,
    setVehicleTypeListDashboardAct,
    setTransportFeeTermWiseAct,
    setActiveVehiclesListAct,
    setStuAvailingListAct,
    setTransportOptedListAct,
    setPendingReqListAct,
    setBranchWiseDueSummaryExportAct,
    setExportBranchWiseNetPaidByDateAct,
    setExportBranchWiseNetAmountAct,
    setExportTransportFeeTermWiseAct,
    setExportVehicleTypeListDashboardAct,
    setClassSectionWiseNetAmountAct,
    setExportClassSectionWiseNetAmountAct,
    setFeeDashboardJodoPaymentModeStatusStatsAct
} from "./feereportslice";

function* getFeeNameByTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFeeNameByTypeAct(response.data));
    }
}

function* getFeeTermByTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setfeeTermByTypeAct(response.data));
    }
}

function* getFeeNameForFilterGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFeeNameForFilterAct(response.data));
    }
}

function* getFeeCollectionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFeeCollectionReportAct(response.data));
    }
}

function* exportFeeCollectionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setExportFeeCollectionAct(response.data));
    }
}

function* getUnpaidListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setUnpaidListAct(response.data));
    }
}
function* getUnpaidFeedbackListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setUnpaidFeedbackListAct(response.data));
    }
}
function* sendEmailSmsUnpaidListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setSendEmailSmsUnpaidListAct(response));
    }
}
function* getFeedbackByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFeedbackByIdAct(response.data));
    }
}
function* exportUnpaidListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setExportUnpaidListAct(response.data));
    }
}
function* fillFeedbackFormGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFillFeedbackFormAct(response));
    }
}
function* fullEmployeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFullEmployeeConcessionAct({ statusCode: response.status }));
    }
}

function* getCbseVerifyReportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setCbseVerifyReportAct(response.data));
    }
}

function* downloadCbseVerifyListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setDownloadCbseVerifyListAct(response.data));
    }
}


function* exportCbseVerificationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setExportCbseVerificationAct(response.data));
    }
}

// Fee Dashboard

function* getFeeDashboardStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFeeDashboardStatsAct(response.data));
    }
}

function* getFeeDashboardJodoPaymentModeStatusStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFeeDashboardJodoPaymentModeStatusStatsAct(response.data));
    }
}
function* getFeeDashboardTransactionSummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFeeDashboardTransactionSummaryAct(response.data));
    }
}

function* getFeeCollectionDashboardGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFeeCollectionDashboardAct(response.data));
    }
}

function* getFeeDashboardCollectionStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFeeDashboardCollectionStatsAct(response.data));
    }
}

function* getFeeRevenueDashboardGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFeeRevenueDashboardAct(response.data));
    }
}

function* getFeeDashboardConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFeeDashboardConcessionAct(response.data));
    }
}

function* getFeeDashboardPaymentModeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setFeeDashboardPaymentModeAct(response.data));
    }
}

function* getNetPaidFeeByBranchGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setNetPaidFeeByBranchAct(response.data));
    }
}

function* getBranchWiseDueSummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setBranchWiseDueSummaryAct(response.data));
    }
}

function* getUnpaidStudentCountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setUnpaidStudentCountAct(response.data));
    }
}

function* getBranchWiseNetPaidByDateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setBranchWiseNetPaidByDateAct(response.data));
    }
}

function* getBranchWiseNetAmountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setBranchWiseNetAmountAct(response.data));
    }
}

function* getClassSectionWiseNetAmountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setClassSectionWiseNetAmountAct(response.data));
    }
}

function* exportClassSectionWiseNetAmountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setExportClassSectionWiseNetAmountAct(response.data));
    }
}

function* ccAvenueOrderStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setccAvenueOrderStatsAct(response.data));
    }
}

// Super Admin Transport Dashboard

function* getVehicleTypeListDashboardGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setVehicleTypeListDashboardAct(response.data));
    }
}

function* getTransportFeeTermWiseGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setTransportFeeTermWiseAct(response.data));
    }
}

function* getActiveVehiclesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setActiveVehiclesListAct(response.data));
    }
}

function* getStuAvailingListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setStuAvailingListAct(response.data));
    }
}

function* getTransportOptedListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setTransportOptedListAct(response.data));
    }
}

function* getPendingReqListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setPendingReqListAct(response.data));
    }
}

function* getBranchWiseDueSummaryExportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setBranchWiseDueSummaryExportAct(response.data));
    }
}

function* exportBranchWiseNetPaidByDateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setExportBranchWiseNetPaidByDateAct(response.data));
    }
}

function* exportBranchWiseNetAmountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setExportBranchWiseNetAmountAct(response.data));
    }
}

function* exportTransportFeeTermWiseGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setExportTransportFeeTermWiseAct(response.data));
    }
}

function* exportVehicleTypeListDashboardGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setFeeReportErrorAct(response.error));
    } else {
        yield put(setExportVehicleTypeListDashboardAct(response.data));
    }
}

export default function* feeReportSaga(){

    yield takeLatest(FeeReportConstants.GET_FEENAME_BYTYPE_REQUEST, getFeeNameByTypeGen);
    yield takeLatest(FeeReportConstants.GET_FEETERM_BYTYPE_REQUEST, getFeeTermByTypeGen);
    yield takeLatest(FeeReportConstants.GET_FEENAME_FORFILTER_REQUEST, getFeeNameForFilterGen);
    yield takeLatest(FeeReportConstants.GET_FEECOLLECTION_REQUEST, getFeeCollectionGen);
    yield takeLatest(FeeReportConstants.EXPORT_FEECOLLECTION_REQUEST, exportFeeCollectionGen);
    yield takeLatest(FeeReportConstants.GET_UNPAID_REPORT_REQUEST, getUnpaidListGen);
    yield takeLatest(FeeReportConstants.GET_UNPAID_FEEDBACK_LIST, getUnpaidFeedbackListGen);
    yield takeLatest(FeeReportConstants.SEND_EMAIL_SMS_UNPAID_LIST, sendEmailSmsUnpaidListGen);
    yield takeLatest(FeeReportConstants.GET_FEEDBACK_BY_REGID, getFeedbackByIdGen);
    yield takeLatest(FeeReportConstants.FILL_FEEDBACK_FORM, fillFeedbackFormGen);
    yield takeLatest(FeeReportConstants.EXPORT_UNPAID_LIST, exportUnpaidListGen);
    yield takeLatest(FeeReportConstants.FULL_EMPLOYEE_CONCESSION, fullEmployeeConcessionGen);
    yield takeLatest(FeeReportConstants.GET_CBSE_VERIFY_REPORT_REQUEST, getCbseVerifyReportGen);
    yield takeLatest(FeeReportConstants.DOWNLOAD_CBSE_VERIFY_REPORT, downloadCbseVerifyListGen);
    yield takeLatest(FeeReportConstants.EXPORT_CBSE_VERIFICATION_REQUEST, exportCbseVerificationGen);
    yield takeLatest(FeeReportConstants.CC_AVENUE_ORDER_STATS, ccAvenueOrderStatsGen);

    // Fee Dashboard

    yield takeLatest(FeeReportConstants.FEE_DASHBOARD_STATS, getFeeDashboardStatsGen);
    yield takeLatest(FeeReportConstants.FEE_DASHBOARD_JODO_PAYMENT_MODE_STATUS_STATS, getFeeDashboardJodoPaymentModeStatusStatsGen);
    yield takeLatest(FeeReportConstants.FEE_DASHBOARD_TRANSACTION_SUMMARY, getFeeDashboardTransactionSummaryGen);
    yield takeLatest(FeeReportConstants.FEE_COLLECTION_DASHBOARD, getFeeCollectionDashboardGen);
    yield takeLatest(FeeReportConstants.FEE_DASHBOARD_COLLECTION_STATS, getFeeDashboardCollectionStatsGen);
    yield takeLatest(FeeReportConstants.FEE_REVENUE_DASHBOARD, getFeeRevenueDashboardGen);
    yield takeLatest(FeeReportConstants.FEE_DASHBOARD_CONCESSION_TYPE, getFeeDashboardConcessionGen);
    yield takeLatest(FeeReportConstants.FEE_DASHBOARD_PAYMENT_MODE, getFeeDashboardPaymentModeGen);
    
    // Super Admin Fee Dashboard

    yield takeLatest(FeeReportConstants.NET_PAID_FEE_BY_BRANCH, getNetPaidFeeByBranchGen);
    yield takeLatest(FeeReportConstants.BRANCH_WISE_DUE_SUMMARY, getBranchWiseDueSummaryGen);
    yield takeLatest(FeeReportConstants.BRANCH_WISE_DUE_SUMMARY_EXPORT, getBranchWiseDueSummaryExportGen);
    yield takeLatest(FeeReportConstants.GET_UNPAID_STUDENT_COUNT, getUnpaidStudentCountGen);
    yield takeLatest(FeeReportConstants.BRANCH_WISE_NET_PAID_BY_DATE, getBranchWiseNetPaidByDateGen);
    yield takeLatest(FeeReportConstants.EXPORT_BRANCH_WISE_NET_PAID_BY_DATE, exportBranchWiseNetPaidByDateGen);
    yield takeLatest(FeeReportConstants.BRANCH_WISE_NET_AMOUNT, getBranchWiseNetAmountGen);
    yield takeLatest(FeeReportConstants.CLASS_SECTION_WISE_NET_AMOUNT, getClassSectionWiseNetAmountGen);
    yield takeLatest(FeeReportConstants.EXPORT_CLASS_SECTION_WISE_NET_AMOUNT, exportClassSectionWiseNetAmountGen);
    yield takeLatest(FeeReportConstants.EXPORT_BRANCH_WISE_NET_AMOUNT, exportBranchWiseNetAmountGen);

    // Super Admin Transport Dashboard

    yield takeLatest(FeeReportConstants.GET_VEHICLE_TYPE_LIST_DASHBOARD, getVehicleTypeListDashboardGen);
    yield takeLatest(FeeReportConstants.EXPORT_VEHICLE_TYPE_LIST_DASHBOARD, exportVehicleTypeListDashboardGen);
    yield takeLatest(FeeReportConstants.GET_TRANSPORT_FEE_TERM_WISE, getTransportFeeTermWiseGen);
    yield takeLatest(FeeReportConstants.EXPORT_TRANSPORT_FEE_TERM_WISE, exportTransportFeeTermWiseGen);
    yield takeLatest(FeeReportConstants.ACTIVE_VEHICLES_LIST, getActiveVehiclesListGen);
    yield takeLatest(FeeReportConstants.STU_AVAILING_LIST, getStuAvailingListGen);
    yield takeLatest(FeeReportConstants.GET_TRANSPORT_OPTED_LIST, getTransportOptedListGen);
    yield takeLatest(FeeReportConstants.GET_PENDING_REQ_LIST, getPendingReqListGen);

}