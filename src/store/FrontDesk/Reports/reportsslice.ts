import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IReportsInitialState } from "./reportstypes";

const initialState: IReportsInitialState = {
    consolidatedListResp: undefined,
    consolidatedMappingKeysResp: undefined,
    admissionConsolidateReportResp: undefined,
    admissionProcessReportResp: undefined,
    exportAdmissionProcessReportResp: undefined,
    admissionTrackerReportResp: undefined,
    getFeeSumAmountListResp: undefined,
    getFeeTypeWiseListResp: undefined,
    consolidatedReportNewResp: undefined,
    conslidatedReportNewMappingKeysResp: undefined,
    consolidatedNewAdmissionResp: undefined,
    admissionTrackerReportExportResp: undefined,
    feeStatusReportResp: undefined,
    feeReceivedReportResp: undefined,
    reportsErrResp: undefined,

    // School Strength
    getSchoolStrengthStatsResp : undefined,
    getClassWiseStrengthListResp : undefined,
    getClassByBranchStatusResp : undefined,
    exportClassByBranchStatusResp : undefined,
    exportClassWiseStrengthResp : undefined,
    getClassByBranchStatusStudentsResp : undefined,
    getSchoolStrengthStatsCountResp : undefined,
    getPlatformStatsLoginCountResp : undefined,
    getBranchWiseUsageForSuperAdminResp : undefined,
    getErpUsageStatsResp : undefined,
    getErpUsageStatsHyperlinkResp : undefined,

    // Admission Dashboard
    getBranchWiseAdmAnalysisResp : undefined,
    exportBranchWiseAdmAnalysisResp : undefined,
    getBranchWiseAdmAnalysisNewResp : undefined,
    exportBranchWiseAdmAnalysisNewResp : undefined,
    getAdmissionsYearWiseResp: undefined,
    exportAdmissionsYearWiseResp: undefined,
    getClassWiseLoginCountResp: undefined,
    exportClassWiseLoginCountResp: undefined,
    getClassWiseAdmAnalysisResp: undefined,
    getApplicationToAdmissionResp: undefined,
    getDateWiseLoginCountResp: undefined,
    getAppToAdmSummaryResp: undefined,
    exportApplicationToAdmissionResp: undefined,
    exportAppToAdmSummaryResp: undefined,
    exportClassWiseAdmAnalysisResp: undefined,
};

export const Reports = createSlice({
    name: "reports",
    initialState,
    reducers: {
        setConsolidatedListAct: (state, action: PayloadAction<any>) => {
            state.consolidatedListResp = action.payload;
        },
        setConsolidatedMappingKeysAct: (state, action: PayloadAction<any>) => {
            state.consolidatedMappingKeysResp = action.payload;
        },
        setAdmissionConsolidatedReportAct: (state, action: PayloadAction<any>) => {
            state.admissionConsolidateReportResp = action.payload;
        },
        setAdmissionProcessReportAct: (state, action: PayloadAction<any>) => {
            state.admissionProcessReportResp = action.payload;
        },
        setExportAdmissionProcessReportAct: (state, action: PayloadAction<any>) => {
            state.exportAdmissionProcessReportResp = action.payload;
        },
        setAdmissionTrackerReportAct: (state, action: PayloadAction<any>) => {
            state.admissionTrackerReportResp = action.payload;
        },
        setAdmissionTrackerReportExportAct: (state, action: PayloadAction<any>) => {
            state.admissionTrackerReportExportResp = action.payload;
        },

        setFeeSumAmountListAct: (state, action: PayloadAction<any>) => {
            state.getFeeSumAmountListResp = action.payload;
        },
        resetFeeSumAmountListAct: (state, action: PayloadAction<any>) => {
            state.getFeeSumAmountListResp = action.payload;
        },
        setFeeTypeWiseListAct: (state, action: PayloadAction<any>) => {
            state.getFeeTypeWiseListResp = action.payload;
        },
        resetFeeTypeWiseListAct: (state, action: PayloadAction<any>) => {
            state.getFeeTypeWiseListResp = action.payload;
        },
        setConsolidatedReportNewAct: (state, action: PayloadAction<any>) => {
            state.consolidatedReportNewResp = action.payload;
        },
        setConslidatedReportNewMappingKeysAct: (state, action: PayloadAction<any>) => {
            state.conslidatedReportNewMappingKeysResp = action.payload;
        },
        setConsolidatedNewAdmissionAct: (state, action: PayloadAction<any>) => {
            state.consolidatedNewAdmissionResp = action.payload;
        },
        setFeeStatusReportAct: (state, action: PayloadAction<any>) => {
            state.feeStatusReportResp = action.payload;
        },
        setFeeReceivedReportAct: (state, action: PayloadAction<any>) => {
            state.feeReceivedReportResp = action.payload;
        },
        
        // School Strength
        setSchoolStrengthStatsAct: (state, action: PayloadAction<any>) => {
            state.getSchoolStrengthStatsResp = action.payload;
        },
        setClassWiseStrengthListAct: (state, action: PayloadAction<any>) => {
            state.getClassWiseStrengthListResp = action.payload;
        },
        setClassByBranchStatusAct: (state, action: PayloadAction<any>) => {
            state.getClassByBranchStatusResp = action.payload;
        },
        setExportClassByBranchStatusAct: (state, action: PayloadAction<any>) => {
            state.exportClassByBranchStatusResp = action.payload;
        },
        setExportClassWiseStrengthAct: (state, action: PayloadAction<any>) => {
            state.exportClassWiseStrengthResp = action.payload;
        },
        setClassByBranchStatusStudentsAct: (state, action: PayloadAction<any>) => {
            state.getClassByBranchStatusStudentsResp = action.payload;
        },
        setSchoolStrengthStatsCountAct: (state, action: PayloadAction<any>) => {
            state.getSchoolStrengthStatsCountResp = action.payload;
        },
        setPlatformStatsLoginCountAct: (state, action: PayloadAction<any>) => {
            state.getPlatformStatsLoginCountResp = action.payload;
        },
        setBranchWiseUsageForSuperAdminAct: (state, action: PayloadAction<any>) => {
            state.getBranchWiseUsageForSuperAdminResp = action.payload;
        },
        setErpUsageStatsAct: (state, action: PayloadAction<any>) => {
            state.getErpUsageStatsResp = action.payload;
        },
        setErpUsageStatsHyperlinkAct: (state, action: PayloadAction<any>) => {
            state.getErpUsageStatsHyperlinkResp = action.payload;
        },
        
        // Admission Dashboard
        setBranchWiseAdmAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getBranchWiseAdmAnalysisResp = action.payload;
        },
        setExportBranchWiseAdmAnalysisAct: (state, action: PayloadAction<any>) => {
            state.exportBranchWiseAdmAnalysisResp = action.payload;
        },
        setBranchWiseAdmAnalysisNewAct: (state, action: PayloadAction<any>) => {
            state.getBranchWiseAdmAnalysisNewResp = action.payload;
        },
        setAdmissionsYearWiseAct: (state, action: PayloadAction<any>) => {
            state.getAdmissionsYearWiseResp = action.payload;
        },
        setExportAdmissionsYearWiseAct: (state, action: PayloadAction<any>) => {
            state.exportAdmissionsYearWiseResp = action.payload;
        },
        setClassWiseLoginCountAct: (state, action: PayloadAction<any>) => {
            state.getClassWiseLoginCountResp = action.payload;
        },
        setClassWiseAdmAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getClassWiseAdmAnalysisResp = action.payload;
        },
        setExportClassWiseAdmAnalysisAct: (state, action: PayloadAction<any>) => {
            state.exportClassWiseAdmAnalysisResp = action.payload;
        },
        setApplicationToAdmissionAct: (state, action: PayloadAction<any>) => {
            state.getApplicationToAdmissionResp = action.payload;
        },
        setDateWiseLoginCountAct: (state, action: PayloadAction<any>) => {
            state.getDateWiseLoginCountResp = action.payload;
        },
        setAppToAdmSummaryAct: (state, action: PayloadAction<any>) => {
            state.getAppToAdmSummaryResp = action.payload;
        },
        setExportApplicationToAdmissionAct: (state, action: PayloadAction<any>) => {
            state.exportApplicationToAdmissionResp = action.payload;
        },
        setExportBranchWiseAdmAnalysisNewAct: (state, action: PayloadAction<any>) => {
            state.exportBranchWiseAdmAnalysisNewResp = action.payload;
        },
        setExportAppToAdmSummaryAct: (state, action: PayloadAction<any>) => {
            state.exportAppToAdmSummaryResp = action.payload;
        },
        setExportClassWiseLoginCountAct: (state, action: PayloadAction<any>) => {
            state.exportClassWiseLoginCountResp = action.payload;
        },

        setReportsErrAct: (state, action: PayloadAction<any>) => {
            state.reportsErrResp = action.payload;
        },
    },
});


export const {
    setConsolidatedListAct,
    setConsolidatedMappingKeysAct,
    setAdmissionConsolidatedReportAct,
    setAdmissionProcessReportAct,
    setExportAdmissionProcessReportAct,
    setAdmissionTrackerReportAct,
    setFeeSumAmountListAct,
    setFeeTypeWiseListAct,
    resetFeeTypeWiseListAct,
    resetFeeSumAmountListAct,
    setConsolidatedReportNewAct,
    setConslidatedReportNewMappingKeysAct,
    setAdmissionTrackerReportExportAct,
    setConsolidatedNewAdmissionAct,
    setFeeStatusReportAct, setFeeReceivedReportAct,
    setSchoolStrengthStatsAct,
    setClassWiseStrengthListAct,
    setClassByBranchStatusAct,
    setExportClassWiseStrengthAct,
    setClassByBranchStatusStudentsAct,
    setSchoolStrengthStatsCountAct,
    setPlatformStatsLoginCountAct,
    setBranchWiseUsageForSuperAdminAct,
    setErpUsageStatsAct,setBranchWiseAdmAnalysisAct,
    setAdmissionsYearWiseAct,setClassWiseLoginCountAct,
    setClassWiseAdmAnalysisAct,setApplicationToAdmissionAct,
    setDateWiseLoginCountAct,setAppToAdmSummaryAct,
    setBranchWiseAdmAnalysisNewAct,
    setExportBranchWiseAdmAnalysisAct,setExportApplicationToAdmissionAct,
    setExportBranchWiseAdmAnalysisNewAct,
    setExportAdmissionsYearWiseAct,
    setExportAppToAdmSummaryAct,setExportClassWiseAdmAnalysisAct,
    setExportClassWiseLoginCountAct,setExportClassByBranchStatusAct,
    setReportsErrAct, setErpUsageStatsHyperlinkAct,
} = Reports.actions;

export default Reports.reducer;



