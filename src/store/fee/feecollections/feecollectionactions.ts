
import { createAction } from "@reduxjs/toolkit";
import { FeeCollectionsConstants } from "./feecollectionsconstants";
import { INewActionType } from "../../types";

export {
    setClassListForAdvanceFilterAct, setSpecialFeePayDetailsAct, setFeeReceiptNoAct, setFeeReceiptsAct, setPayFeeDetailsAct,
    resetLedgerDetailsAct, setStudentRefundLedgersAct, resetClassListForAdvanceFilterAct,
    setLedgerDetailsAct, setFeeSummaryDetailsAct, setAddFeeRefundAct, setLedgerForFeeAdjustAct, setStuForFeeAdjustAct, setPreviewFeeReceiptAct, resetJodoDiscountDetailsAct, resetPrintStudentLedgerDetailsAct, resetSplFeeReceiptsFeeNamesAct, resetSaveProcessStudentRefundAmountAct, resetDownloadDueAmountStudentListAct,
} from './feecollectionsslice';
export const getFeeReceiptsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_FEE_RECEIPTS_REQUEST);
export const addFeeReceiptAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.ADD_FEE_RECEIPT_REQUEST);
export const getFeeReceiptFeeNameAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_FEE_RECEIPT_FEE_NAMES_REQUEST);
export const getSplFeeReceiptFeeNameAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_SPL_FEE_RECEIPT_FEE_NAMES_REQUEST);
export const getFeeReceiptNoAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_FEE_RECEIPT_NO_REQUEST);
export const updateFeeReceiptAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.UPDATE_FEE_RECEIPT_REQUEST);
export const previewFeeReceiptAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.PREVIEW_FEE_RECEIPT_REQUEST);
export const downloadFeeReceiptAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.DOWNLOAD_FEE_RECEIPT_REQUEST);
export const deleteFeeReceiptAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.DELETE_FEE_RECEIPT_REQUEST);
export const exportFeeReceiptAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.EXPORT_FEE_RECEIPT);
export const sendEmailFeeReceiptAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.SEND_EMAIL_FEE_RECEIPT);
export const createCredentialsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.CREATE_CREDENTIALS_REQUEST);
export const notifyDueFeePaymentAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.NOTIFY_DUEFEE_PAYMENT_REQUEST);
export const exportNotifyDueFeePaymentAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.EXPORT_NOTIFY_DUEFEE_PAYMENT_REQUEST);
export const exportFeeFollowUpRemarksAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.EXPORT_FEE_FOLLOW_UP_REMARKS_REQUEST);


export const getPayFeeDetailsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_PAY_FEE_DETAILS);
export const processCcavenueDummyPaymentAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.PROCESS_CCAVENUE_DUMMY_PAYMENT_REQUEST);

export const getSpecialFeePayDetailsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_SPECIAL_PAYFEE_DETAILS_REQUEST);
export const getSpecialFeeLedgersAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_SPECIAL_FEE_LEDGERS_REQUEST);

export const getSpecialFeeReceiptAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.SPECIAL_FEE_RECEIPT_REQUEST);

export const getStudentLedgersAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_STUDENT_LEDGERS_REQUEST);

export const getFeeRefundsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_FEE_REFUNDS_REQUEST);
export const addFeeRefundAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.ADD_FEE_REFUND_REQUEST);
export const updateFeeRefundAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.UPDATE_FEE_REFUND_REQUEST);
export const deleteFeeRefundAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.DELETE_FEE_REFUND_REQUEST);
export const getStudentRefundLedgerAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_STUDENT_REFUND_LEDGERS_REQUEST);
export const exportFeeRefundListAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.EXPORT_FEE_REFUND_LIST);

export const getFeeSummaryListAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_FEE_SUMMARY_LIST);
export const getStudentConcessionForFeeSummaryAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_STUDENT_CONCESSION_FOR_FEE);
export const getFeeSummaryDetailsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_FEE_SUMMARY_DETAILS);
export const getLedgerDetailsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_LEDGER_DETAILS);
export const getFeeDetailsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_FEE_DETAILS);
export const getScheduleDetailsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_SCHEDULE_DETAILS);
export const exportFeeSummaryAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.EXPORT_FEE_SUMMARY);
export const downloadDueAmountStudentListAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.DOWNLOAD_DUE_AMOUNT_STUDENT_LIST);
export const getPrevYearBalanceLedgersAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_PREVIOUSYEAR_BALANCELEDGERS_REQUEST);
export const printStudentLedgerDetailsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.PRINT_STUDENT_LEDGER_DETAILS);
export const getByIdFeeDueFollowUpRemarksAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_BYID_FEE_DUE_FOLLOW_UP_REMARKS);
export const saveFeeDueFollowUpRemarksAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.SAVE_FEE_DUE_FOLLOW_UP_REMARKS);

export const getFeeRefundDetails = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_REFUND_DETAILS);

export const updateJodoPaymentToErpAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.UPDATE_JODOTOERP_PAYMENT_REQUEST);
export const updateJodoDiscountAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.UPDATE_JODO_DISCOUNT_REQUEST);
export const createJodoIdAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.CREATE_JODO_ID);
export const updateErpToJodoReceiptAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.UPDATE_ERPTOJODO_RECEIPT_REQUEST);

export const getFeeReversalsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_FEE_REVERSAL_REQUEST);
export const createFeeReversalAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.CREATE_FEE_REVERSAL_REQUEST);
export const exportFeeReversalAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.EXPORT_FEE_REVERSAL);

export const getTutionFeeConcessionDetails = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_TUTUION_FEE_CONCESSION_LIST)


export const feePaymentAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.FEE_PAYMENT_REQUEST)
export const paymentOrderStatusAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.PAYMENT_ORDER_STATUS_REQUEST)

export const getClassListAdvanceFilter = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_CLASS_LIST_ADVANCE_FILTER)
export const getStuForFeeAdjustAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_STU_FOR_FEE_ADJUSTMENT)
export const getLedgerForFeeAdjustAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_LEDGER_FOR_FEE_ADJUSTMENT)
export const getStudentLedgersForFeeAdjustExcessAmountAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_STUDENT_LEDGERS_FOR_FEE_ADJUST_EXCESS_AMOUNT)
export const getCampusTransferStudentRefundAmountAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_CAMPUS_TRANSFER_STUDENT_REFUND_AMOUNT)
export const saveProcessStudentRefundAmountAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.SAVE_PROCESS_STUDENT_REFUND_AMOUNT)
export const deleteLedgerDetailAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.DELETE_LEDGER_DETAILS)

export const feeLedgersConcessionAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_FEELEDGERS_CONCESSION_REQUEST)

export const getPaymentActiveDetailsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_PAYMENT_DETAILS);
export const getPaymentActiveListByIdAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_PAYMENT_ACTIVE_DETAILS_BY_ID);
export const exportActivePaymentDetailsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.EXPORT_ACTIVE_PAYMENT_DETAILS)

export const getWebhookLogsAct = createAction<INewActionType | undefined>(
    FeeCollectionsConstants.GET_WEBHOOK_LOGS
)
export const getWebhookLogsCategoryDetailsAct = createAction<INewActionType | undefined>(
    FeeCollectionsConstants.GET_WEBHOOK_LOGS_CATEGORY_DETAILS
)

export const updateStatusDetailsAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.UPDATE_STATUS_DETAILS)

export const getPaymentReconciliationAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_PAYEMNT_RECONCILIATION)
export const getPaymentReconciliationDetailsByIdAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_PAYEMNT_RECONCILIATION_DETAILS_BY_ID)

export const getChronicParentTypesListAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_CHRONIC_PARENT_TYPES_LIST)
export const addChronicParentTypesAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.ADD_CHRONIC_PARENT_TYPES)
export const getChronicParentTypeByIdAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.GET_CHRONIC_PARENT_TYPE_BY_ID)
export const updateChronicParentTypeAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.UPDATE_CHRONIC_PARENT_TYPE)
export const deleteChronicParentTypeAct = createAction<INewActionType | undefined>(FeeCollectionsConstants.DELETE_CHRONIC_PARENT_TYPE)
