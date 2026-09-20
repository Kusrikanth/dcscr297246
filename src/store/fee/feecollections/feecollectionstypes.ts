export interface IFeeCollectionsReducerState {

    feeReceiptsResp: any;
    addFeeReceiptResp: any;
    getFeeReceiptsFeeNamesResp: any;
    getSplFeeReceiptsFeeNamesResp: any;
    feeReceiptNoResp: any;
    updateFeeReceiptResp: any;
    previewFeeReceiptResp: any;
    downloadFeeReceiptResp: any;
    deleteFeeReceiptResp: any;
    exportFeeReceiptResp: any;
    sendEmailFeeReceiptResp: any;
    createCredentialsResp: any;
    notifyDueFeePaymentResp: any;
    exportNotifyDueFeePaymentResp: any;
    exportFeeFollowUpRemarksResp: any;
    getPayFeeDetailsResp: any;
    processCcavenueDummyPaymentResp: any;

    getSpecialFeePayDetailsResp: any;
    specialFeeLedgersResp: any;
    specialFeeReceiptsResp: any;

    createFeeReversalResp: any;
    feeReversalsResp: any;
    exportFeeReversalResp: any;

    studentLedgersResp: any;

    feeRefundsResp: any;
    addFeeRefundResp: any;
    updateFeeRefundResp: any;
    deleteFeeRefundResp: any;
    studentRefundLedgerResp: any;
    exportFeeRefundResp: any;

    feeSummaryList: any;
    feeSummaryDetails: any;
    ledgerDetails: any;
    feeDetails: any;
    scheduleDetails: any;
    getStudentConcessionForFee: any;
    exportFeeSummaryResp: any;
    downloadDueAmountStudentListResp: any;
    previousYearBalanceLedgersResp: any;
    printStudentLedgerDetailsResp: any;
    getByIdFeeDueFollowUpRemarksResp: any;
    saveFeeDueFollowUpRemarksResp: any;

    feeRefundDetails: any;

    updateJodoToErpPaymentResp: any;
    updateJodoDiscountResp: any;
    createJodoIdResp: any;
    updateErpToJodoReceiptResp: any;

    tutionFeeConcessionList: any;
    classListForAdvanceFilter: any;
    feePaymentResp: any;
    paymentOrderStatusResp: any;
    getStuForFeeAdjustResp: any;
    getLedgerForFeeAdjustResp: any;
    getStudentLedgersForFeeAdjustExcessAmountResp: any;
    getCampusTransferStudentRefundAmountResp: any;
    saveProcessStudentRefundAmountResp: any;
    deleteLedgerDetailResp: any;
    updateLedgerDetailsResp: any;
    // verifyingFeePaymentResp: any;


    feeLedgersConcessionResp: any;
    paymentActiveDetailsResp: any;
    paymentActiveDetailsByIdResp: any;
    exportActivePaymentDetailsResp: any;

    feeCollectionErrorResp: any;
    webhookLogsResp: any;
    updateStatusResp: any;
    webhookLogsCategoryDetailsResp: any;

    getPaymentReconciliationResp: any;
    getPaymentReconciliationDetailsByIdResp: any;

    getChronicParentTypesListResp: any;
    addChronicParentTypesResp: any;
    getChronicParentTypeByIdResp: any;
    updateChronicParentTypeResp: any;
    deleteChronicParentTypeResp: any;
}