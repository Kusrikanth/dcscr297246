export interface IFeeReportReducerState {
    feeNameByTypeResp: any;
    feeTermByTypeResp: any;
    feeNameForFilterResp: any;
    feeCollectionResp: any;
    exportFeeCollectionResp: any;
    getUnpaidListStudentResp: any;
    getUnpaidFeedbackListResp: any;
    sendEmailSmsUnpaidListResp: any;
    getFeedbackByIdResp: any;
    fillFeedbackFormResp: any;
    exportUnpaidListResp: any;
    fullEmployeeConcessionResp: any;
    getCbseVerifyReportResp: any;
    downloadCbseVerifyListResp: any;
    exportCbseVerificationResp: any;
    feeReportErrorResp: any;

    // Fee Dashboard

    getFeeDashboardStatsResp: any;
    getFeeDashboardJodoPaymentModeStatusStatsResp: any;
    getFeeDashboardTransactionSummaryResp : any;
    getFeeCollectionDashboardResp : any;
    getFeeDashboardCollectionStatsResp : any;
    getFeeRevenueDashboardResp : any;
    getFeeDashboardConcessionResp : any;
    getFeeDashboardPaymentModeResp : any;
    ccAvenueOrderStatsResp: any;

    // Super Admin Fee Dashboard
    
    getNetPaidFeeByBranchResp:any;
    getBranchWiseDueSummaryResp:any;
    getBranchWiseDueSummaryExportResp:any;
    getUnpaidStudentCountResp : any;
    getBranchWiseNetPaidByDateResp:any;
    exportBranchWiseNetPaidByDateResp:any;
    getBranchWiseNetAmountResp : any;
    getClassSectionWiseNetAmountResp : any;
    exportClassSectionWiseNetAmountResp : any;
    exportBranchWiseNetAmountResp : any;

    // Super Admin Transport Dashboard

    getVehicleTypeListDashboardResp : any;
    exportVehicleTypeListDashboardResp : any;
    getTransportFeeTermWiseResp : any;
    exportTransportFeeTermWiseResp : any;
    getActiveVehiclesListResp : any;
    getStuAvailingListResp : any;
    getTransportOptedListResp : any;
    getPendingReqListResp : any;

    feeCallingReportResp: any;
    feeCallingReportSummaryResp: any;
    exportFeeCallingReportResp: any;
}