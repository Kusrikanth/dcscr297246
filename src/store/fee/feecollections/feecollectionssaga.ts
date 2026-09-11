import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setMasterFeeSettingsErrorAct,
    setFeeReceiptsAct, setAddFeeReceiptAct, setFeeReceiptNoAct, setUpdateFeeReceiptAct,
    setPreviewFeeReceiptAct, setDownloadFeeReceiptAct,
    setDeleteFeeReceiptAct,
    setFeeRefundsAct, setAddFeeRefundAct, setUpdateFeeRefundAct, setDeleteFeeRefundAct, setStudentRefundLedgersAct,
    setStudentLedgersAct,
    setFeeSummaryListAct,
    setLedgerDetailsAct,
    setFeeDetailsAct,
    setScheduleDetailsAct,
    setFeeSummaryDetailsAct,
    setFeeRefundDetailsAct,
    setUpdateJodoToErpPaymentAct, setUpdateErpToJodoReceiptAct,
    setTutionFeeConcessionAct,
    setClassListForAdvanceFilterAct,
    setFeePaymentAct,
    setPaymentOrderStatusAct,
    setStudentConcessionForFeeAct,
    setExportFeeSummaryAct,
    setExportFeeReceiptAct,
    setCreateCredentialsAct, setNotifyDueFeePaymentAct, setExportNotifyDueFeePaymentAct,
    setPayFeeDetailsAct, setProcessCcavenueDummyPaymentAct, setSpecialFeePayDetailsAct,
    setSendEmailFeeReceiptAct,
    setStuForFeeAdjustAct,
    setCreateFeeReversalAct, setFeeReversalsAct,
    setLedgerForFeeAdjustAct, setPreviousYearBalanceLedgersAct,
    setExportFeeReversalAct,
    setDeleteLedgerDetailAct,
    setFeeLedgersConcessionAct,
    setExportFeeRefundListAct,
    setPaymentActiveDetailsAct,
    setPaymentActiveDetailsByIdAct,
    setExportActivePaymentDetailsAct,
    setWebhookLogsAct,
    setWebhookLogsCategoryDetailsAct,
    setUpdateStatusListAct,
    setSpecialFeeReceiptsAct,
    setPaymentReconciliationAct,
    setPaymentReconciliationDetailsByIdAct,
    setSpecialFeeLedgersAct,
    setCreateJodoIdAct,
    setJodoDiscountDetailsAct,
    setPrintStudentLedgerDetailsAct,
    setGetByIdFeeDueFollowUpRemarksAct,
    setSaveFeeDueFollowUpRemarksAct,
    setFeeReceiptsFeeNamesAct,
    setSplFeeReceiptsFeeNamesAct,
    setStudentLedgersForFeeAdjustExcessAmountAct,
    setCampusTransferStudentRefundAmountAct,
    setSaveProcessStudentRefundAmountAct,
    setDownloadDueAmountStudentListAct,
    setExporFeeFollowUpRemarksAct,
    // setBranchesAct,
    setChronicParentTypesListAct, setAddChronicParentTypesAct, setChronicParentTypeByIdAct,
    setUpdateChronicParentTypeAct, setDeleteChronicParentTypeAct,
} from "./feecollectionsslice";
import { FeeCollectionsConstants } from "./feecollectionsconstants";
import {
    deleteData,
    getData,
    postData,
    putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getFeeReceiptsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeReceiptsAct(response.data));
    }
}

function* addFeeReceiptGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    // const response = { error: null, status: 200 };
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddFeeReceiptAct(response.data));
    }
}

function* getFeeReceiptsFeeNamesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeReceiptsFeeNamesAct(response.data));
    }
}

function* getSplFeeReceiptsFeeNamesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setSplFeeReceiptsFeeNamesAct(response.data));
    }
}

function* getFeeReceiptNoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    // const response = { error: null, status: 200 };
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeReceiptNoAct({ receiptNo: response.data }));
    }
}

function* updateFeeReceiptGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateFeeReceiptAct({ statusCode: response.status }));
    }
}

function* previewFeeReceiptGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setPreviewFeeReceiptAct(response.data));
    }
}

function* downloadFeeReceiptGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDownloadFeeReceiptAct(response.data));
    }
}


function* deleteFeeReceiptGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteFeeReceiptAct({ statusCode: response.status }));
    }
}


function* getStudentLedgersGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setStudentLedgersAct(response.data));
    }
}

function* getFeeRefundGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeRefundsAct(response.data));
    }
}

function* addFeeRefundGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddFeeRefundAct({ statusCode: response.status }));
    }
}

function* updateFeeRefundGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateFeeRefundAct({ statusCode: response.status }));
    }
}

function* deleteFeeRefundGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteFeeRefundAct({ statusCode: response.status }));
    }
}

function* getStudentRefundLedgerGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setStudentRefundLedgersAct(response.data));
    }
}
function* exportFeeRefundListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setExportFeeRefundListAct(response.data));
    }
}
function* getFeeSummaryListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeSummaryListAct(response.data));
    }
}
function* getFeeSummaryDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeSummaryDetailsAct(response.data));
    }
}
function* getLedgerDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setLedgerDetailsAct(response.data));
    }
}
function* getFeeDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeDetailsAct(response.data));
    }
}
function* getScheduleDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setScheduleDetailsAct(response.data));
    }
}
function* getFeeRefundDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeRefundDetailsAct(response.data));
    }
}

function* updateJodoToErpPaymentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateJodoToErpPaymentAct({ statusCode: response.status }));
    }
}

function* updateJodoDiscountDetailsGen(action: ICreatedActionType): any {
   const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setJodoDiscountDetailsAct(response.data));
    }
}

function* createJodoIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setCreateJodoIdAct({ statusCode: response.status }));
    }
}

function* updateErpToJodoReceiptGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateErpToJodoReceiptAct({ statusCode: response.status }));
    }
}


function* getTutionFeeConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setTutionFeeConcessionAct(response.data));
    }
}

function* feePaymentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeePaymentAct(response.data));
    }
}

function* paymentOrderStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setPaymentOrderStatusAct(response.data));
    }
}

function* getClassListForAdvanceFilter(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setClassListForAdvanceFilterAct(response.data));
    }
}
function* StudentConcessionForFeeActGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setStudentConcessionForFeeAct(response.data));
    }
}
function* exportFeeSummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setExportFeeSummaryAct(response.data));
    }
}
function* downloadDueAmountStudentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDownloadDueAmountStudentListAct(response.data));
    }
}
function* exportFeeReceiptGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setExportFeeReceiptAct(response.data));
    }
}
function* sendEmailFeeReceiptGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setSendEmailFeeReceiptAct(response));
    }
}

function* createCredentialsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setCreateCredentialsAct({ statusCode: response.status }));
    }
}

function* notifyDueFeePaymentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setNotifyDueFeePaymentAct({ statusCode: response.status }));
    }
}


function* exportNotifyDueFeePaymentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setExportNotifyDueFeePaymentAct(response.data));
    }
}

function* exportFeeFollowUpRemarksGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setExporFeeFollowUpRemarksAct(response.data));
    }
}


function* getStuForFeeAdjustGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setStuForFeeAdjustAct(response.data));
    }
}
function* getLedgerForFeeAdjustGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setLedgerForFeeAdjustAct(response.data));
    }
}
function* getStudentLedgersForFeeAdjustExcessAmountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setStudentLedgersForFeeAdjustExcessAmountAct(response.data));
    }
}
function* getCampusTransferStudentRefundAmountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setCampusTransferStudentRefundAmountAct(response.data));
    }
}

function* saveProcessStudentRefundAmountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    // const response = { error: null, status: 200 };
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setSaveProcessStudentRefundAmountAct(response.data));
    }
}

function* getPrevYearBalanceLedgersGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setPreviousYearBalanceLedgersAct(response.data));
    }
}


function* printStudentLedgerDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setPrintStudentLedgerDetailsAct(response.data));
    }
}

function* getByIdFeeDueFollowUpRemarksGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setGetByIdFeeDueFollowUpRemarksAct(response.data));
    }
}

function* saveFeeDueFollowUpRemarksGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setSaveFeeDueFollowUpRemarksAct(response.data));
    }
}

function* getPayFeeDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setPayFeeDetailsAct(response.data));
    }
}

function* processCcavenueDummyPaymentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setProcessCcavenueDummyPaymentAct(response.data));
    }
}




function* getSpecialFeePayDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setSpecialFeePayDetailsAct(response.data));
    }
}

function* getSpecialFeeLedgersGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setSpecialFeeLedgersAct(response.data));
    }
}



function* createFeeReversalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setCreateFeeReversalAct({ statusCode: response.status }));
    }
}

function* getFeeReversalsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeReversalsAct(response.data));
    }
}
function* exportFeeReversalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setExportFeeReversalAct(response.data));
    }
}
function* deleteLedgerDetailGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteLedgerDetailAct({ statusCode: response.status }));
    }
}

function* feeLedgersConcessionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setFeeLedgersConcessionAct(response?.data));
    }
}
function* getPaymentActiveDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setPaymentActiveDetailsAct(response.data));
    }
}
function* getPaymentActiveDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setPaymentActiveDetailsByIdAct(response.data));
    }
}

function* exportActivePaymentDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)

    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error))
    }
    else {
        yield put(setExportActivePaymentDetailsAct(response.data))
    }
}

function* getWebhookLogsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error))
    } else {
        yield put(setWebhookLogsAct(response.data))
    }
}

function* getWebhookLogsCategoryDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error))
    }
    else {
        yield put(setWebhookLogsCategoryDetailsAct(response.data))
    }
}

function* getSpecialFeeReceiptsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error))
    }
    else {
        yield put(setSpecialFeeReceiptsAct(response.data))
    }
}

function* updateStatusListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateStatusListAct({ statusCode: response.status }));
    }
}

function* getPaymentReconciliationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setPaymentReconciliationAct(response.data));
    }
}
function* getPaymentReconciliationDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setPaymentReconciliationDetailsByIdAct(response.data));
    }
}

function* getChronicParentTypesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setChronicParentTypesListAct(response.data));
    }
}
function* addChronicParentTypesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setAddChronicParentTypesAct({ statusCode: response.status }));
    }
}
function* getChronicParentTypeByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setChronicParentTypeByIdAct(response.data));
    }
}
function* updateChronicParentTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateChronicParentTypeAct({ statusCode: response.status }));
    }
}
function* deleteChronicParentTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setMasterFeeSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteChronicParentTypeAct({ statusCode: response.status }));
    }
}

export default function* feeCollectionsSaga() {
    yield takeLatest(FeeCollectionsConstants.GET_FEE_RECEIPTS_REQUEST, getFeeReceiptsGen);
    yield takeLatest(FeeCollectionsConstants.ADD_FEE_RECEIPT_REQUEST, addFeeReceiptGen);
    yield takeLatest(FeeCollectionsConstants.GET_FEE_RECEIPT_FEE_NAMES_REQUEST, getFeeReceiptsFeeNamesGen);
    yield takeLatest(FeeCollectionsConstants.GET_SPL_FEE_RECEIPT_FEE_NAMES_REQUEST, getSplFeeReceiptsFeeNamesGen);
    yield takeLatest(FeeCollectionsConstants.GET_FEE_RECEIPT_NO_REQUEST, getFeeReceiptNoGen);
    yield takeLatest(FeeCollectionsConstants.UPDATE_FEE_RECEIPT_REQUEST, updateFeeReceiptGen);
    yield takeLatest(FeeCollectionsConstants.PREVIEW_FEE_RECEIPT_REQUEST, previewFeeReceiptGen);
    yield takeLatest(FeeCollectionsConstants.DOWNLOAD_FEE_RECEIPT_REQUEST, downloadFeeReceiptGen);
    yield takeLatest(FeeCollectionsConstants.DELETE_FEE_RECEIPT_REQUEST, deleteFeeReceiptGen);

    yield takeLatest(FeeCollectionsConstants.GET_STUDENT_LEDGERS_REQUEST, getStudentLedgersGen);

    yield takeLatest(FeeCollectionsConstants.GET_FEE_REFUNDS_REQUEST, getFeeRefundGen);
    yield takeLatest(FeeCollectionsConstants.ADD_FEE_REFUND_REQUEST, addFeeRefundGen);
    yield takeLatest(FeeCollectionsConstants.UPDATE_FEE_REFUND_REQUEST, updateFeeRefundGen);
    yield takeLatest(FeeCollectionsConstants.DELETE_FEE_REFUND_REQUEST, deleteFeeRefundGen);
    yield takeLatest(FeeCollectionsConstants.GET_STUDENT_REFUND_LEDGERS_REQUEST, getStudentRefundLedgerGen);
    yield takeLatest(FeeCollectionsConstants.EXPORT_FEE_REFUND_LIST, exportFeeRefundListGen);
    yield takeLatest(FeeCollectionsConstants.GET_FEE_SUMMARY_LIST, getFeeSummaryListGen);
    yield takeLatest(FeeCollectionsConstants.GET_FEE_SUMMARY_DETAILS, getFeeSummaryDetailsGen);
    yield takeLatest(FeeCollectionsConstants.GET_LEDGER_DETAILS, getLedgerDetailsGen);
    yield takeLatest(FeeCollectionsConstants.GET_FEE_DETAILS, getFeeDetailsGen);
    yield takeLatest(FeeCollectionsConstants.GET_SCHEDULE_DETAILS, getScheduleDetailsGen);
    yield takeLatest(FeeCollectionsConstants.GET_REFUND_DETAILS, getFeeRefundDetailsGen);
    yield takeLatest(FeeCollectionsConstants.UPDATE_JODOTOERP_PAYMENT_REQUEST, updateJodoToErpPaymentGen);
    yield takeLatest(FeeCollectionsConstants.UPDATE_JODO_DISCOUNT_REQUEST, updateJodoDiscountDetailsGen);
    yield takeLatest(FeeCollectionsConstants.CREATE_JODO_ID, createJodoIdGen);
    yield takeLatest(FeeCollectionsConstants.UPDATE_ERPTOJODO_RECEIPT_REQUEST, updateErpToJodoReceiptGen);


    yield takeLatest(FeeCollectionsConstants.GET_TUTUION_FEE_CONCESSION_LIST, getTutionFeeConcessionGen);
    yield takeLatest(FeeCollectionsConstants.FEE_PAYMENT_REQUEST, feePaymentGen);
    yield takeLatest(FeeCollectionsConstants.PAYMENT_ORDER_STATUS_REQUEST, paymentOrderStatusGen);

    yield takeLatest(FeeCollectionsConstants.GET_CLASS_LIST_ADVANCE_FILTER, getClassListForAdvanceFilter);
    yield takeLatest(FeeCollectionsConstants.GET_STUDENT_CONCESSION_FOR_FEE, StudentConcessionForFeeActGen);
    yield takeLatest(FeeCollectionsConstants.EXPORT_FEE_SUMMARY, exportFeeSummaryGen);
    yield takeLatest(FeeCollectionsConstants.DOWNLOAD_DUE_AMOUNT_STUDENT_LIST, downloadDueAmountStudentListGen);
    yield takeLatest(FeeCollectionsConstants.EXPORT_FEE_RECEIPT, exportFeeReceiptGen);
    yield takeLatest(FeeCollectionsConstants.SEND_EMAIL_FEE_RECEIPT, sendEmailFeeReceiptGen);
    yield takeLatest(FeeCollectionsConstants.CREATE_CREDENTIALS_REQUEST, createCredentialsGen);
    yield takeLatest(FeeCollectionsConstants.GET_PAY_FEE_DETAILS, getPayFeeDetailsGen);
    yield takeLatest(FeeCollectionsConstants.PROCESS_CCAVENUE_DUMMY_PAYMENT_REQUEST, processCcavenueDummyPaymentGen);


    yield takeLatest(FeeCollectionsConstants.GET_SPECIAL_PAYFEE_DETAILS_REQUEST, getSpecialFeePayDetailsGen);
    yield takeLatest(FeeCollectionsConstants.GET_SPECIAL_FEE_LEDGERS_REQUEST, getSpecialFeeLedgersGen);


    yield takeLatest(FeeCollectionsConstants.SPECIAL_FEE_RECEIPT_REQUEST, getSpecialFeeReceiptsGen);

    yield takeLatest(FeeCollectionsConstants.NOTIFY_DUEFEE_PAYMENT_REQUEST, notifyDueFeePaymentGen);
    yield takeLatest(FeeCollectionsConstants.EXPORT_NOTIFY_DUEFEE_PAYMENT_REQUEST, exportNotifyDueFeePaymentGen);
    yield takeLatest(FeeCollectionsConstants.EXPORT_FEE_FOLLOW_UP_REMARKS_REQUEST, exportFeeFollowUpRemarksGen);



    yield takeLatest(FeeCollectionsConstants.GET_STU_FOR_FEE_ADJUSTMENT, getStuForFeeAdjustGen);
    yield takeLatest(FeeCollectionsConstants.GET_LEDGER_FOR_FEE_ADJUSTMENT, getLedgerForFeeAdjustGen);
    yield takeLatest(FeeCollectionsConstants.GET_STUDENT_LEDGERS_FOR_FEE_ADJUST_EXCESS_AMOUNT, getStudentLedgersForFeeAdjustExcessAmountGen);
    yield takeLatest(FeeCollectionsConstants.GET_CAMPUS_TRANSFER_STUDENT_REFUND_AMOUNT, getCampusTransferStudentRefundAmountGen);
    yield takeLatest(FeeCollectionsConstants.SAVE_PROCESS_STUDENT_REFUND_AMOUNT, saveProcessStudentRefundAmountGen);
    yield takeLatest(FeeCollectionsConstants.GET_PREVIOUSYEAR_BALANCELEDGERS_REQUEST, getPrevYearBalanceLedgersGen);
    yield takeLatest(FeeCollectionsConstants.PRINT_STUDENT_LEDGER_DETAILS, printStudentLedgerDetailsGen);
    yield takeLatest(FeeCollectionsConstants.GET_BYID_FEE_DUE_FOLLOW_UP_REMARKS, getByIdFeeDueFollowUpRemarksGen);
    yield takeLatest(FeeCollectionsConstants.SAVE_FEE_DUE_FOLLOW_UP_REMARKS, saveFeeDueFollowUpRemarksGen);


    yield takeLatest(FeeCollectionsConstants.CREATE_FEE_REVERSAL_REQUEST, createFeeReversalGen);
    yield takeLatest(FeeCollectionsConstants.GET_FEE_REVERSAL_REQUEST, getFeeReversalsGen);
    yield takeLatest(FeeCollectionsConstants.EXPORT_FEE_REVERSAL, exportFeeReversalGen);
    yield takeLatest(FeeCollectionsConstants.DELETE_LEDGER_DETAILS, deleteLedgerDetailGen);
    yield takeLatest(FeeCollectionsConstants.GET_FEELEDGERS_CONCESSION_REQUEST, feeLedgersConcessionGen);
    yield takeLatest(FeeCollectionsConstants.GET_PAYMENT_DETAILS, getPaymentActiveDetailsGen);
    yield takeLatest(FeeCollectionsConstants.GET_PAYMENT_ACTIVE_DETAILS_BY_ID, getPaymentActiveDetailsByIdGen);
    yield takeLatest(FeeCollectionsConstants.EXPORT_ACTIVE_PAYMENT_DETAILS, exportActivePaymentDetailsGen)
    yield takeLatest(FeeCollectionsConstants.GET_WEBHOOK_LOGS, getWebhookLogsGen)
    yield takeLatest(FeeCollectionsConstants.GET_WEBHOOK_LOGS_CATEGORY_DETAILS, getWebhookLogsCategoryDetailsGen)

    yield takeLatest(FeeCollectionsConstants.UPDATE_STATUS_DETAILS, updateStatusListGen)
    yield takeLatest(FeeCollectionsConstants.GET_PAYEMNT_RECONCILIATION, getPaymentReconciliationGen)
    yield takeLatest(FeeCollectionsConstants.GET_PAYEMNT_RECONCILIATION_DETAILS_BY_ID, getPaymentReconciliationDetailsByIdGen);

    yield takeLatest(FeeCollectionsConstants.GET_CHRONIC_PARENT_TYPES_LIST, getChronicParentTypesListGen);
    yield takeLatest(FeeCollectionsConstants.ADD_CHRONIC_PARENT_TYPES, addChronicParentTypesGen);
    yield takeLatest(FeeCollectionsConstants.GET_CHRONIC_PARENT_TYPE_BY_ID, getChronicParentTypeByIdGen);
    yield takeLatest(FeeCollectionsConstants.UPDATE_CHRONIC_PARENT_TYPE, updateChronicParentTypeGen);
    yield takeLatest(FeeCollectionsConstants.DELETE_CHRONIC_PARENT_TYPE, deleteChronicParentTypeGen);

}