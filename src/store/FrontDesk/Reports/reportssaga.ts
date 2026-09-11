import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { ReportConstants } from "./reportsconstants";
import {
    deleteData,
    getData,
    postData,
    putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import {
    setAdmissionConsolidatedReportAct, setConsolidatedListAct,
    setAdmissionProcessReportAct,
    setExportAdmissionProcessReportAct,
    setConsolidatedMappingKeysAct, setFeeSumAmountListAct,
    setFeeTypeWiseListAct, setReportsErrAct, setConslidatedReportNewMappingKeysAct,
    setConsolidatedReportNewAct, setConsolidatedNewAdmissionAct,
    setAdmissionTrackerReportAct,
    setAdmissionTrackerReportExportAct, setFeeStatusReportAct, setFeeReceivedReportAct,
    setSchoolStrengthStatsAct,
    setClassWiseStrengthListAct,
    setClassByBranchStatusAct,
    setClassByBranchStatusStudentsAct,
    setSchoolStrengthStatsCountAct,
    setPlatformStatsLoginCountAct,
    setBranchWiseUsageForSuperAdminAct,
    setErpUsageStatsAct,
    setBranchWiseAdmAnalysisAct,
    setAdmissionsYearWiseAct,
    setClassWiseLoginCountAct,
    setClassWiseAdmAnalysisAct,
    setApplicationToAdmissionAct,
    setDateWiseLoginCountAct,
    setAppToAdmSummaryAct,
    setBranchWiseAdmAnalysisNewAct,
    setExportBranchWiseAdmAnalysisAct,
    setExportApplicationToAdmissionAct,
    setExportBranchWiseAdmAnalysisNewAct,
    setExportAdmissionsYearWiseAct,
    setExportAppToAdmSummaryAct,
    setExportClassWiseAdmAnalysisAct,
    setExportClassWiseLoginCountAct,
    setExportClassByBranchStatusAct,
    setExportClassWiseStrengthAct,
    setErpUsageStatsHyperlinkAct,
} from "./reportsslice";

function* getConsolidatedListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setConsolidatedListAct(response.data));
    }
}
function* getFeeSumAmountListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setFeeSumAmountListAct(response.data));
    }
}
function* getFeeTypeWiseListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setFeeTypeWiseListAct(response.data));
    }
}

function* getConsolidateMappingKeysGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setConsolidatedMappingKeysAct(response.data));
    }
}


function* admissionConsolidatedReportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setAdmissionConsolidatedReportAct(response.data));
    }
}

function* admissionProcessReportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setAdmissionProcessReportAct(response.data));
    }
}
function* admissionTrackerReportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setAdmissionTrackerReportAct(response.data));
    }
}

function* exportAdmissionProcessReportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setExportAdmissionProcessReportAct(response.data));
    }
}


function* getConsolidatedReportNewGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setConsolidatedReportNewAct(response.data));
    }
}

function* getConsolidatedReportNewKeyGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setConslidatedReportNewMappingKeysAct(response.data));
    }
}

function* getConsolidateNewAdmissionProcessGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setConsolidatedNewAdmissionAct(response.data));
    }
}
function* admissionTrackerReportExportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setAdmissionTrackerReportExportAct(response.data));
    }
}

function* feeStatusReportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setFeeStatusReportAct(response.data));
    }
}

function* feeReceivedReportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setFeeReceivedReportAct(response.data));
    }
}

// School Strength
function* getSchoolStrengthStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setSchoolStrengthStatsAct(response.data));
    }
}

function* getClassWiseStrengthListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setClassWiseStrengthListAct(response.data));
    }
}

function* getClassByBranchStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setClassByBranchStatusAct(response.data));
    }
}

function* getClassByBranchStatusStudentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setClassByBranchStatusStudentsAct(response.data));
    }
}

function* getSchoolStrengthStatsCountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setSchoolStrengthStatsCountAct(response.data));
    }
}

function* getPlatformStatsLoginCountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setPlatformStatsLoginCountAct(response.data));
    }
}

function* getBranchWiseUsageForSuperAdminGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setBranchWiseUsageForSuperAdminAct(response.data));
    }
}

function* getErpUsageStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setErpUsageStatsAct(response.data));
    }
}

// Admission Dashboard

function* getBranchWiseAdmAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setBranchWiseAdmAnalysisAct(response.data));
    }
}

function* getBranchWiseAdmAnalysisNewGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setBranchWiseAdmAnalysisNewAct(response.data));
    }
}

function* getAdmissionsYearWiseGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setAdmissionsYearWiseAct(response.data));
    }
}

function* getClassWiseLoginCountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setClassWiseLoginCountAct(response.data));
    }
}

function* getClassWiseAdmAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setClassWiseAdmAnalysisAct(response.data));
    }
}

function* getApplicationToAdmissionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setApplicationToAdmissionAct(response.data));
    }
}

function* getDateWiseLoginCountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setDateWiseLoginCountAct(response.data));
    }
}

function* getAppToAdmSummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setAppToAdmSummaryAct(response.data));
    }
}
function* getErpUsageStatsHyperlinkGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setErpUsageStatsHyperlinkAct(response.data));
    }
}

function* exportBranchWiseAdmAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setExportBranchWiseAdmAnalysisAct(response.data));
    }
}

function* exportApplicationToAdmissionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setExportApplicationToAdmissionAct(response.data));
    }
}

function* exportBranchWiseAdmAnalysisNewGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setExportBranchWiseAdmAnalysisNewAct(response.data));
    }
}

function* exportAdmissionsYearWiseGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setExportAdmissionsYearWiseAct(response.data));
    }
}

function* exportAppToAdmSummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setExportAppToAdmSummaryAct(response.data));
    }
}

function* exportClassWiseAdmAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setExportClassWiseAdmAnalysisAct(response.data));
    }
}

function* exportClassWiseLoginCountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setExportClassWiseLoginCountAct(response.data));
    }
}

function* exportClassByBranchStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setExportClassByBranchStatusAct(response.data));
    }
}

function* exportClassWiseStrengthGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setReportsErrAct(response.error));
    } else {
        yield put(setExportClassWiseStrengthAct(response.data));
    }
}

export default function* ReportsSaga() {
    yield takeLatest(ReportConstants.GET_CONSOLIDATED_VIEW_LIST, getConsolidatedListGen);
    yield takeLatest(ReportConstants.GET_CONSOLIDATED_MAPPING_KEYS, getConsolidateMappingKeysGen);
    yield takeLatest(ReportConstants.DOWNLOAD_CONSOLIDATED_ADMISSION_REPORT, admissionConsolidatedReportGen);
    yield takeLatest(ReportConstants.ADMISSION_TRACKER_REPORT, admissionTrackerReportGen);
    yield takeLatest(ReportConstants.ADMISSION_TRACKER_REPORT_EXPORT, admissionTrackerReportExportGen);

    yield takeLatest(ReportConstants.GET_ADMISSIONPROCESS_REPORT_REQUEST, admissionProcessReportGen);
    yield takeLatest(ReportConstants.EXPORT_ADMISSIONPROCESS_REPORT_REQUEST, exportAdmissionProcessReportGen);
    yield takeLatest(ReportConstants.GET_FEE_SUM_AMOUNT, getFeeSumAmountListGen);
    yield takeLatest(ReportConstants.GET_FEE_TYPE_WISE_LIST, getFeeTypeWiseListGen);


    yield takeLatest(ReportConstants.GET_CONSOLIDATED_REPORT_NEW_REQUEST, getConsolidatedReportNewGen);
    yield takeLatest(ReportConstants.GET_CONSOLIDATED_MAPPINGKEYS_NEW_REQUEST, getConsolidatedReportNewKeyGen);
    yield takeLatest(ReportConstants.GET_CONSOLIDATED_NEWREPORT_ADMISSIONPROCESS_REQUEST, getConsolidateNewAdmissionProcessGen);

    yield takeLatest(ReportConstants.FEE_STATUS_REPORT_REQUEST, feeStatusReportGen);
    yield takeLatest(ReportConstants.FEE_RECEIVED_REPORT_REQUEST, feeReceivedReportGen);
    
    // School Strength
    yield takeLatest(ReportConstants.GET_SCHOOL_STRENGTH_STATS, getSchoolStrengthStatsGen);
    yield takeLatest(ReportConstants.GET_CLASS_WISE_STRENGTH, getClassWiseStrengthListGen);
    yield takeLatest(ReportConstants.GET_CLASS_BY_BRANCH_STATUS, getClassByBranchStatusGen);
    yield takeLatest(ReportConstants.EXPORT_CLASS_BY_BRANCH_STATUS, exportClassByBranchStatusGen);
    yield takeLatest(ReportConstants.EXPORT_CLASS_WISE_STRENGTH, exportClassWiseStrengthGen);
    yield takeLatest(ReportConstants.GET_CLASS_BY_BRANCH_STATUS_STUDENTS, getClassByBranchStatusStudentsGen);
    yield takeLatest(ReportConstants.GET_SCHOOL_STRENGTH_STATS_COUNT, getSchoolStrengthStatsCountGen);

    // ERP Usage
    yield takeLatest(ReportConstants.GET_PLATFORM_STATS_LOGIN_COUNT, getPlatformStatsLoginCountGen);
    yield takeLatest(ReportConstants.GET_BRANCH_WISE_USAGE_FOR_SUPER_ADMIN, getBranchWiseUsageForSuperAdminGen);
    yield takeLatest(ReportConstants.GET_ERP_USAGE_STATS, getErpUsageStatsGen);
    yield takeLatest(ReportConstants.GET_ERP_USAGE_STATS_HYPERLINK, getErpUsageStatsHyperlinkGen);
    
    // Admission Dashboard
    yield takeLatest(ReportConstants.GET_BRANCH_WISE_ADM_ANALYSIS, getBranchWiseAdmAnalysisGen);
    yield takeLatest(ReportConstants.EXPORT_BRANCH_WISE_ADM_ANALYSIS, exportBranchWiseAdmAnalysisGen);
    yield takeLatest(ReportConstants.GET_BRANCH_WISE_ADM_ANALYSIS_NEW, getBranchWiseAdmAnalysisNewGen);
    yield takeLatest(ReportConstants.EXPORT_BRANCH_WISE_ADM_ANALYSIS_NEW, exportBranchWiseAdmAnalysisNewGen);
    yield takeLatest(ReportConstants.GET_ADMISSIONS_YEAR_WISE, getAdmissionsYearWiseGen);
    yield takeLatest(ReportConstants.EXPORT_ADMISSIONS_YEAR_WISE, exportAdmissionsYearWiseGen);
    yield takeLatest(ReportConstants.GET_CLASS_WISE_LOGIN_COUNT, getClassWiseLoginCountGen);
    yield takeLatest(ReportConstants.EXPORT_CLASS_WISE_LOGIN_COUNT, exportClassWiseLoginCountGen);
    yield takeLatest(ReportConstants.GET_CLASS_WISE_ADM_ANALYSIS, getClassWiseAdmAnalysisGen);
    yield takeLatest(ReportConstants.EXPORT_CLASS_WISE_ADM_ANALYSIS, exportClassWiseAdmAnalysisGen);
    yield takeLatest(ReportConstants.GET_APPLICATION_TO_ADMISSION, getApplicationToAdmissionGen);
    yield takeLatest(ReportConstants.DATE_WISE_LOGIN_COUNT, getDateWiseLoginCountGen);
    yield takeLatest(ReportConstants.GET_APP_TO_ADM_SUMMARY, getAppToAdmSummaryGen);
    yield takeLatest(ReportConstants.EXPORT_APPLICATION_TO_ADMISSION, exportApplicationToAdmissionGen);
    yield takeLatest(ReportConstants.EXPORT_APP_TO_ADM_SUMMARY, exportAppToAdmSummaryGen);

}