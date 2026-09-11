import { createAction } from "@reduxjs/toolkit";
import { ReportConstants } from "./reportsconstants";
import { INewActionType } from "../../types";
export {
    setExportAdmissionProcessReportAct, setAdmissionProcessReportAct,
    setConsolidatedNewAdmissionAct,
    resetFeeSumAmountListAct, resetFeeTypeWiseListAct , setClassByBranchStatusStudentsAct,
} from "./reportsslice";

export const getConsolidatedListAct = createAction<INewActionType | undefined>(ReportConstants.GET_CONSOLIDATED_VIEW_LIST);
export const getConsolidatedMappingKeysAct = createAction<INewActionType | undefined>(ReportConstants.GET_CONSOLIDATED_MAPPING_KEYS);
export const admissionConsolidatedReportAct = createAction<INewActionType | undefined>(ReportConstants.DOWNLOAD_CONSOLIDATED_ADMISSION_REPORT);
export const getAdmissionProcessReportAct = createAction<INewActionType | undefined>(ReportConstants.GET_ADMISSIONPROCESS_REPORT_REQUEST);
export const exportAdmissionProcessReportAct = createAction<INewActionType | undefined>(ReportConstants.EXPORT_ADMISSIONPROCESS_REPORT_REQUEST);
export const admissionTrackerReportAct = createAction<INewActionType | undefined>(ReportConstants.ADMISSION_TRACKER_REPORT);
export const admissionTrackerReportExportAct = createAction<INewActionType | undefined>(ReportConstants.ADMISSION_TRACKER_REPORT_EXPORT);

export const getFeeSumAmountListAct = createAction<INewActionType | undefined>(ReportConstants.GET_FEE_SUM_AMOUNT);
export const getFeeTypeWiseListAct = createAction<INewActionType | undefined>(ReportConstants.GET_FEE_TYPE_WISE_LIST);


export const getConsolidatedReportNewAct = createAction<INewActionType | undefined>(ReportConstants.GET_CONSOLIDATED_REPORT_NEW_REQUEST);
export const getConsolidatedReportNewKeyAct = createAction<INewActionType | undefined>(ReportConstants.GET_CONSOLIDATED_MAPPINGKEYS_NEW_REQUEST);
export const getConsolidateNewAdmissionProcessAct = createAction<INewActionType | undefined>(ReportConstants.GET_CONSOLIDATED_NEWREPORT_ADMISSIONPROCESS_REQUEST);


export const feeStatusReportAct = createAction<INewActionType | undefined>(ReportConstants.FEE_STATUS_REPORT_REQUEST);
export const feeReceivedReportAct = createAction<INewActionType | undefined>(ReportConstants.FEE_RECEIVED_REPORT_REQUEST);

// School Strength 
export const getSchoolStrengthStatsAct = createAction<INewActionType | undefined>(ReportConstants.GET_SCHOOL_STRENGTH_STATS);
export const getClassWiseStrengthListAct = createAction<INewActionType | undefined>(ReportConstants.GET_CLASS_WISE_STRENGTH);
export const getClassByBranchStatusAct = createAction<INewActionType | undefined>(ReportConstants.GET_CLASS_BY_BRANCH_STATUS);
export const exportClassByBranchStatusAct = createAction<INewActionType | undefined>(ReportConstants.EXPORT_CLASS_BY_BRANCH_STATUS);
export const exportClassWiseStrengthAct = createAction<INewActionType | undefined>(ReportConstants.EXPORT_CLASS_WISE_STRENGTH);
export const getClassByBranchStatusStudentsAct = createAction<INewActionType | undefined>(ReportConstants.GET_CLASS_BY_BRANCH_STATUS_STUDENTS);
export const getSchoolStrengthStatsCountAct = createAction<INewActionType | undefined>(ReportConstants.GET_SCHOOL_STRENGTH_STATS_COUNT);

// ERP Usage
export const getPlatformStatsLoginCountAct = createAction<INewActionType | undefined>(ReportConstants.GET_PLATFORM_STATS_LOGIN_COUNT);
export const getBranchWiseUsageForSuperAdminAct = createAction<INewActionType | undefined>(ReportConstants.GET_BRANCH_WISE_USAGE_FOR_SUPER_ADMIN);
export const getErpUsageStatsAct = createAction<INewActionType | undefined>(ReportConstants.GET_ERP_USAGE_STATS);
export const getErpUsageStatsHyperlinkAct = createAction<INewActionType | undefined>(ReportConstants.GET_ERP_USAGE_STATS_HYPERLINK);

// Admission Dashboard
export const getBranchWiseAdmAnalysisAct = createAction<INewActionType | undefined>(ReportConstants.GET_BRANCH_WISE_ADM_ANALYSIS);
export const exportBranchWiseAdmAnalysisAct = createAction<INewActionType | undefined>(ReportConstants.EXPORT_BRANCH_WISE_ADM_ANALYSIS);
export const getBranchWiseAdmAnalysisNewAct = createAction<INewActionType | undefined>(ReportConstants.GET_BRANCH_WISE_ADM_ANALYSIS_NEW);
export const exportBranchWiseAdmAnalysisNewAct = createAction<INewActionType | undefined>(ReportConstants.EXPORT_BRANCH_WISE_ADM_ANALYSIS_NEW);
export const getAdmissionsYearWiseAct = createAction<INewActionType | undefined>(ReportConstants.GET_ADMISSIONS_YEAR_WISE);
export const exportAdmissionsYearWiseAct = createAction<INewActionType | undefined>(ReportConstants.EXPORT_ADMISSIONS_YEAR_WISE);
export const getClassWiseLoginCountAct = createAction<INewActionType | undefined>(ReportConstants.GET_CLASS_WISE_LOGIN_COUNT);
export const exportClassWiseLoginCountAct = createAction<INewActionType | undefined>(ReportConstants.EXPORT_CLASS_WISE_LOGIN_COUNT);
export const getClassWiseAdmAnalysisAct = createAction<INewActionType | undefined>(ReportConstants.GET_CLASS_WISE_ADM_ANALYSIS);
export const exportClassWiseAdmAnalysisAct = createAction<INewActionType | undefined>(ReportConstants.EXPORT_CLASS_WISE_ADM_ANALYSIS);
export const getApplicationToAdmissionAct = createAction<INewActionType | undefined>(ReportConstants.GET_APPLICATION_TO_ADMISSION);
export const exportApplicationToAdmissionAct = createAction<INewActionType | undefined>(ReportConstants.EXPORT_APPLICATION_TO_ADMISSION);
export const getDateWiseLoginCountAct = createAction<INewActionType | undefined>(ReportConstants.DATE_WISE_LOGIN_COUNT);
export const getAppToAdmSummaryAct = createAction<INewActionType | undefined>(ReportConstants.GET_APP_TO_ADM_SUMMARY);
export const exportAppToAdmSummaryAct = createAction<INewActionType | undefined>(ReportConstants.EXPORT_APP_TO_ADM_SUMMARY);


