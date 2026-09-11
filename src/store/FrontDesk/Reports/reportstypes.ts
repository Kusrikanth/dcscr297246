export interface IReportsInitialState {
    consolidatedListResp: any;
    consolidatedMappingKeysResp: any;
    admissionConsolidateReportResp: any;
    admissionProcessReportResp: any;
    exportAdmissionProcessReportResp: any;
    admissionTrackerReportResp: any;
    admissionTrackerReportExportResp: any;
    getFeeSumAmountListResp: any;
    getFeeTypeWiseListResp: any;
    consolidatedReportNewResp: any;
    conslidatedReportNewMappingKeysResp: any;
    consolidatedNewAdmissionResp: any;
    feeStatusReportResp: any;
    feeReceivedReportResp: any;
    reportsErrResp: any;

    // School Strength
    getSchoolStrengthStatsResp : any;
    getClassWiseStrengthListResp : any;
    getClassByBranchStatusResp : any;
    exportClassByBranchStatusResp : any;
    exportClassWiseStrengthResp : any;
    getClassByBranchStatusStudentsResp : any;
    getSchoolStrengthStatsCountResp: any;

    // ERP Usage 

    getPlatformStatsLoginCountResp : any;
    getBranchWiseUsageForSuperAdminResp : any;
    getErpUsageStatsResp : any;
    getErpUsageStatsHyperlinkResp : any;

    // Admission Dashboard
    
    getBranchWiseAdmAnalysisResp : any;
    exportBranchWiseAdmAnalysisResp : any;
    getBranchWiseAdmAnalysisNewResp : any;
    exportBranchWiseAdmAnalysisNewResp : any;
    getAdmissionsYearWiseResp: any;
    exportAdmissionsYearWiseResp: any;
    getClassWiseLoginCountResp : any;
    exportClassWiseLoginCountResp : any;
    getClassWiseAdmAnalysisResp : any;
    getApplicationToAdmissionResp : any;
    exportApplicationToAdmissionResp : any;
    getDateWiseLoginCountResp : any;
    getAppToAdmSummaryResp : any;
    exportAppToAdmSummaryResp : any;
    exportClassWiseAdmAnalysisResp : any;
}
