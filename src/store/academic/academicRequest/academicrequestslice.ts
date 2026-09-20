import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    IAcademicRequestReducerState
} from "./academicrequesttypes";
import { IResponseErrorModel } from "../../types";
import { IModelWithPagination } from "../../types";

const initialState: IAcademicRequestReducerState = {
    changeCampusListResp: undefined,
    changeTransferRequestResp: undefined,
    campusChangeStudentListResp: undefined,
    addChangeCampusResp: undefined,
    addChangeCampusDpsResp: undefined,
    updateChangeCampusResp: undefined,
    delChangeCampushResp: undefined,
    apprRejChangeCampusResp: undefined,
    oldCampusFeeLedgerResp: undefined,
    newCampusFeeLedgerResp: undefined,

    submitOldCampusLedgersResp: undefined,
    submitNewCampusLedgersResp: undefined,

    changeCampusCurriculumResp: undefined,
    alamanacListResp: undefined,
    addAlamanacResp: undefined,
    deleteAlamanacResp: undefined,
    getUploadDocumentsResp: undefined,
    getUploadDocumentPreviewResp: undefined,
    exportUploadDocumentListresp: undefined,
    deleteUploadDocumentsResp: undefined,
    academicRequestErrorResp: undefined,
    getUrlDownloadFileResp: undefined,

    getWorkTypesListResp: undefined,
    addWorkTypesListResp: undefined,
    updateWorkTypeResp: undefined,
    getWorkTypeByIdResp: undefined,
    deleteWorkTypeResp: undefined,

    addUploadDocumentsResp: undefined,
    getSectionByMultipleClassesResp: undefined,
    exportChangeCampusResp: undefined,

    //branch dashboard
    getBranchDashboardStatsResp: undefined,
    getSectionAnalysisResp: undefined,
    getSchoolStrengthResp: undefined,
    getMasterSectionResp: undefined,
    getAttendanceTrackerReportResp: undefined,
    getBirthdayAnniversaryResp: undefined,
    getStudentBirthdayResp : undefined,
    exportStudentBirthdayReportResp : undefined,
    getEventsListResp: undefined,
    getFeedsListResp: undefined,
    getAppUsageStatsResp: undefined,
    getQuickLinkResp: undefined,
    saveQuickLinkResp: undefined,
    exportAdmissionDashboardResp: undefined,
    exportAttendanceTrackerReportResp: undefined,
    getSectionWiseLanguageResp: undefined,
    exportSectionWiseLanguageResp: undefined,
    getSecondLangListResp: undefined,
    getThirdLangListResp: undefined,
    getClassWiseGenderAnalysisResp: undefined,
    getStudentStatusAnalysisResp: undefined,
    exportStudentStatusAnalysisResp: undefined,
};

export const academicRequest = createSlice({
    name: "academicrequest",
    initialState,
    reducers: {
        setChangeCampusListAct: (state, action: PayloadAction<any>) => {
            state.changeCampusListResp = action.payload;
        },
        setChangeTransferRequestAct: (state, action: PayloadAction<any>) => {
            state.changeTransferRequestResp = action.payload;
        },
        setCampusChangeStudentListAct: (state, action: PayloadAction<any>) => {
            state.campusChangeStudentListResp = action.payload;
        },
        setAddChangeCampusAct: (state, action: PayloadAction<any>) => {
            state.addChangeCampusResp = action.payload;
        },
        setAddChangeCampusDpsAct: (state, action: PayloadAction<any>) => {
            state.addChangeCampusDpsResp = action.payload;
        },
        setUpdateChangeCampusAct: (state, action: PayloadAction<any>) => {
            state.updateChangeCampusResp = action.payload;
        },
        setDelChangeCampusAct: (state, action: PayloadAction<any>) => {
            state.delChangeCampushResp = action.payload;
        },
        setApprRejChangeCampusAct: (state, action: PayloadAction<any>) => {
            state.apprRejChangeCampusResp = action.payload;
        },
        setOldCampusFeeLedgerAct: (state, action: PayloadAction<any>) => {
            state.oldCampusFeeLedgerResp = action.payload;
        },
        setNewCampusFeeLedgerAct: (state, action: PayloadAction<any>) => {
            state.newCampusFeeLedgerResp = action.payload;
        },

        setSubmitOldCampusLedgersAct: (state, action: PayloadAction<any>) => {
            state.submitOldCampusLedgersResp = action.payload;
        },
        setSubmitNewCampusLedgersRespAct: (state, action: PayloadAction<any>) => {
            state.submitNewCampusLedgersResp = action.payload;
        },

        setChangeCampusCurriculumAct: (state, action: PayloadAction<any>) => {
            state.changeCampusCurriculumResp = action.payload;
        },

        setAlamanacListAct: (state, action: PayloadAction<any>) => {
            state.alamanacListResp = action.payload;
        },
        setAddAlamanacAct: (state, action: PayloadAction<any>) => {
            state.addAlamanacResp = action.payload;
        },
        setDelAlamanacAct: (state, action: PayloadAction<any>) => {
            state.deleteAlamanacResp = action.payload;
        },

        setUploadDocumentsAct: (state, action: PayloadAction<any>) => {
            state.getUploadDocumentsResp = action.payload;
        },
        setDeleteUploadDocumentsAct: (state, action: PayloadAction<any>) => {
            state.deleteUploadDocumentsResp = action.payload;
        },
        setUrlDownloadFileAct: (state, action: PayloadAction<any>) => {
            state.getUrlDownloadFileResp = action.payload;
        },
        resetUrlDownloadFileAct: (state, action: PayloadAction<any>) => {
            state.getUrlDownloadFileResp = action.payload;
        },
        setWorkTypesListAct: (state, action: PayloadAction<any>) => {
            state.getWorkTypesListResp = action.payload;
        },
        setUpdateWorkTypeAct: (state, action: PayloadAction<any>) => {
            state.updateWorkTypeResp = action.payload;
        },
        setGetWorkTypeByIdAct: (state, action: PayloadAction<any>) => {
            state.getWorkTypeByIdResp = action.payload;
        },
        setDeleteWorkTypeAct: (state, action: PayloadAction<any>) => {
            state.deleteWorkTypeResp = action.payload;
        },
        setSectionByMultipleClassesAct: (state, action: PayloadAction<any>) => {
            state.getSectionByMultipleClassesResp = action.payload;
        },
        setAddWorkTypesListAct: (state, action: PayloadAction<any>) => {
            state.addWorkTypesListResp = action.payload;
        },
        setAddUploadDocumentsAct: (state, action: PayloadAction<any>) => {
            state.addUploadDocumentsResp = action.payload;
        },
        setUploadDocumentPreviewAct: (state, action: PayloadAction<any>) => {
            state.getUploadDocumentPreviewResp = action.payload;
        },
        resetUploadDocumentPreviewAct: (state, action: PayloadAction<any>) => {
            state.getUploadDocumentPreviewResp = action.payload;
        },
        exportUploadDocumentListAct: (state, action: PayloadAction<any>) => {
            state.exportUploadDocumentListresp = action.payload;
        },
        setExportChangeCampusAct: (state, action: PayloadAction<any>) => {
            state.exportChangeCampusResp = action.payload;
        },

        setAcademicRequestErrorAct: (
            state,
            action: PayloadAction<IResponseErrorModel>
        ) => {
            state.academicRequestErrorResp = action.payload;
        },

        setBranchDashboardStatsAct: (state, action: PayloadAction<any>) => {
            state.getBranchDashboardStatsResp = action.payload
        },
        setSectionAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getSectionAnalysisResp = action.payload
        },
        resetSectionAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getSectionAnalysisResp = action.payload
        },
        setSchoolStrengthAct: (state, action: PayloadAction<any>) => {
            state.getSchoolStrengthResp = action.payload
        },
        setMasterSectionAct: (state, action: PayloadAction<any>) => {
            state.getMasterSectionResp = action.payload
        },
        resetMasterSectionAct: (state, action: PayloadAction<any>) => {
            state.getMasterSectionResp = action.payload
        },
        setAttendanceTrackerReportAct: (state, action: PayloadAction<any>) => {
            state.getAttendanceTrackerReportResp = action.payload
        },
        setBirthdayAnniversaryAct: (state, action: PayloadAction<any>) => {
            state.getBirthdayAnniversaryResp = action.payload
        },
        resetBirthdayAnniversaryAct: (state, action: PayloadAction<any>) => {
            state.getBirthdayAnniversaryResp = action.payload
        },
        setStudentBirthdayAct: (state, action: PayloadAction<any>) => {
            state.getStudentBirthdayResp = action.payload
        },
        setExportStudentBirthdayReportAct: (state, action: PayloadAction<any>) => {
            state.exportStudentBirthdayReportResp = action.payload
        },
        setEventsListAct: (state, action: PayloadAction<any>) => {
            state.getEventsListResp = action.payload
        },
        resetEventsListAct: (state, action: PayloadAction<any>) => {
            state.getEventsListResp = action.payload
        },
        seetFeedsListAct: (state, action: PayloadAction<any>) => {
            state.getFeedsListResp = action.payload
        },
        setAppUsageStatsAct: (state, action: PayloadAction<any>) => {
            state.getAppUsageStatsResp = action.payload
        },
        setQuickLinkAct: (state, action: PayloadAction<any>) => {
            state.getQuickLinkResp = action.payload
        },
        saveQuickLinkAct: (state, action: PayloadAction<any>) => {
            state.saveQuickLinkResp = action.payload
        },
        exportAdmissionDashboardAct: (state, action: PayloadAction<any>) => {
            state.exportAdmissionDashboardResp = action.payload
        },
        exportAttendanceTrackerReportAct: (state, action: PayloadAction<any>) => {
            state.exportAttendanceTrackerReportResp = action.payload
        },
        setSectionWiseLanguageAct: (state, action: PayloadAction<any>) => {
            state.getSectionWiseLanguageResp = action.payload
        },
        setExportSectionWiseLanguageAct: (state, action: PayloadAction<any>) => {
            state.exportSectionWiseLanguageResp = action.payload
        },
        setSecondLangListAct: (state, action: PayloadAction<any>) => {
            state.getSecondLangListResp = action.payload
        },
        setThirdLangListAct: (state, action: PayloadAction<any>) => {
            state.getThirdLangListResp = action.payload
        },
        setClassWiseGenderAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getClassWiseGenderAnalysisResp = action.payload
        },
        setStudentStatusAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getStudentStatusAnalysisResp = action.payload
        },
        setExportStudentStatusAnalysisAct: (state, action: PayloadAction<any>) => {
            state.exportStudentStatusAnalysisResp = action.payload
        },
    },
});


export const {
    setChangeCampusListAct, setChangeTransferRequestAct,
    setCampusChangeStudentListAct, setAddChangeCampusAct, setAddChangeCampusDpsAct,
    setUpdateChangeCampusAct, setDelChangeCampusAct, setApprRejChangeCampusAct,
    setOldCampusFeeLedgerAct, setNewCampusFeeLedgerAct,
    setSubmitOldCampusLedgersAct, setSubmitNewCampusLedgersRespAct,
    setChangeCampusCurriculumAct,
    setAlamanacListAct,
    setAddAlamanacAct, setDelAlamanacAct,
    setAcademicRequestErrorAct,

    setUploadDocumentsAct,
    setDeleteUploadDocumentsAct,

    setWorkTypesListAct,
    setUpdateWorkTypeAct,
    setGetWorkTypeByIdAct,
    setDeleteWorkTypeAct,

    setSectionByMultipleClassesAct,
    setAddUploadDocumentsAct,
    setAddWorkTypesListAct,
    setUrlDownloadFileAct,
    setUploadDocumentPreviewAct,
    resetUploadDocumentPreviewAct,
    exportUploadDocumentListAct,
    resetUrlDownloadFileAct,

    setBranchDashboardStatsAct,
    setSectionAnalysisAct,
    setSchoolStrengthAct,
    setMasterSectionAct,
    resetMasterSectionAct,
    resetSectionAnalysisAct,
    setAttendanceTrackerReportAct,
    setBirthdayAnniversaryAct,
    resetBirthdayAnniversaryAct,
    setStudentBirthdayAct,
    setExportStudentBirthdayReportAct,
    setEventsListAct,
    resetEventsListAct,
    seetFeedsListAct,
    setAppUsageStatsAct,
    setQuickLinkAct,
    saveQuickLinkAct,
    exportAdmissionDashboardAct,
    exportAttendanceTrackerReportAct,
    setSectionWiseLanguageAct,setSecondLangListAct,setThirdLangListAct,
    setExportSectionWiseLanguageAct, setExportChangeCampusAct, setClassWiseGenderAnalysisAct,
    setStudentStatusAnalysisAct, setExportStudentStatusAnalysisAct,
} = academicRequest.actions;

export default academicRequest.reducer;



