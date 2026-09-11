import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { lmsdigitalcurriculumReducerState } from "./lmsdigitalcurriculumtypes";

const initialState: lmsdigitalcurriculumReducerState = {
    // Digital Curriculum
    getDigitalCurriculumStatsResp: undefined,
    getDigitalCurriculumListResp: undefined,
    saveBasicDigitalCurriculumResp: undefined,
    getDigitalCurriculumBasicDetailsByIdResp: undefined,
    saveDigitalCurriculumBulkUploadExcelResp: undefined,
    saveHeaderMapDigitalCurriculumResp: undefined,
    getDigitalCurriculumBulkUploadPreviewResp: undefined,
    saveDigitalCurriculumBulkUploadResp: undefined,
    getDigitalCurriculumanualUploadByIdResp: undefined,
    saveDigitalCurriculumanualUploadResp: undefined,
    getPreviewDigitalCurriculumDetailsResp: undefined,
    submitDigitalCurriculumReviewResp: undefined,
    savePublishDigitalCurriculumResp: undefined,

    getCurriculumStructureResp: undefined,
    getinlineBuilderGridResp: undefined,
    getWeeksListResp: undefined,
    saveSubjectCurriculumBuildResp: undefined,
    sendBuildReviewResp: undefined,
    saveBuildPublishResp: undefined,
    digitalCurriculumDownloadReportResp: undefined,
    
    //HOD Review
    getHodReviewDigitalCurriculumDetailsByIdResp: undefined,
    submitHodReviewDigitalCurriculumDetailsByIdResp: undefined,
    getHodFeedbackHistoryDetailsByIdResp: undefined,

    //HOD Course Planner Review
    getHodReviewCoursePlannerDetailsByIdResp: undefined,
    submitHodReviewCoursePlannerDetailsByIdResp: undefined,
    getHodFeedbackHistoryCoursePlannerDetailsByIdResp: undefined,

    //Error
    lmsdigitalcurriculumErrorAct: undefined
}

export const lmsdigitalcurriculum = createSlice({
    name: "lmsdigitalcurriculum",
    initialState,
    reducers: {
        // Digital Curriculum
        setDigitalCurriculumStatsAct: (state, action: PayloadAction<any>) => {
            state.getDigitalCurriculumStatsResp = action.payload;
        },
        setDigitalCurriculumListAct: (state, action: PayloadAction<any>) => {
            state.getDigitalCurriculumListResp = action.payload;
        },
        setSaveBasicDigitalCurriculumAct: (state, action: PayloadAction<any>) => {
            state.saveBasicDigitalCurriculumResp = action.payload;
        },
        setDigitalCurriculumBasicDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getDigitalCurriculumBasicDetailsByIdResp = action.payload;
        },
        resetDigitalCurriculumBasicDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getDigitalCurriculumBasicDetailsByIdResp = action.payload;
        },
        setSaveDigitalCurriculumBulkUploadExcelAct: (state, action: PayloadAction<any>) => {
            state.saveDigitalCurriculumBulkUploadExcelResp = action.payload;
        },
        resetSaveDigitalCurriculumBulkUploadExcelAct: (state, action: PayloadAction<any>) => {
            state.saveDigitalCurriculumBulkUploadExcelResp = action.payload;
        },
        setSaveHeaderMapDigitalCurriculumAct: (state, action: PayloadAction<any>) => {
            state.saveHeaderMapDigitalCurriculumResp = action.payload;
        },
        setGetDigitalCurriculumBulkUploadPreviewAct: (state, action: PayloadAction<any>) => {
            state.getDigitalCurriculumBulkUploadPreviewResp = action.payload;
        },
        setSaveDigitalCurriculumBulkUploadAct: (state, action: PayloadAction<any>) => {
            state.saveDigitalCurriculumBulkUploadResp = action.payload;
        },
        setDigitalCurriculumManualUploadByIdAct: (state, action: PayloadAction<any>) => {
            state.getDigitalCurriculumanualUploadByIdResp = action.payload;
        },
        resetDigitalCurriculumManualUploadByIdAct: (state, action: PayloadAction<any>) => {
            state.getDigitalCurriculumanualUploadByIdResp = action.payload;
        },
        setPreviewDigitalCurriculumDetailsAct: (state, action: PayloadAction<any>) => {
            state.getPreviewDigitalCurriculumDetailsResp = action.payload;
        },
        setSaveDigitalCurriculumManualUploadAct: (state, action: PayloadAction<any>) => {
            state.saveDigitalCurriculumanualUploadResp = action.payload;
        },
        resetSaveDigitalCurriculumManualUploadAct: (state, action: PayloadAction<any>) => {
            state.saveDigitalCurriculumanualUploadResp = action.payload;
        },
        setSubmitDigitalCurriculumReviewAct: (state, action: PayloadAction<any>) => {
            state.submitDigitalCurriculumReviewResp = action.payload;
        },
        setSavePublishDigitalCurriculumAct: (state, action: PayloadAction<any>) => {
            state.savePublishDigitalCurriculumResp = action.payload;
        },
        setCurriculumStructureAct: (state, action: PayloadAction<any>) => {
            state.getCurriculumStructureResp = action.payload;
        },
        resetCurriculumStructureAct: (state, action: PayloadAction<any>) => {
            state.getCurriculumStructureResp = action.payload;
        },
        setinlineBuilderGridAct: (state, action: PayloadAction<any>) => {
            state.getinlineBuilderGridResp = action.payload;
        },
        setWeeksListAct: (state, action: PayloadAction<any>) => {
            state.getWeeksListResp = action.payload;
        },
        saveSubjectCurriculumBuildAct: (state, action: PayloadAction<any>) => {
            state.saveSubjectCurriculumBuildResp = action.payload;
        },
        setSendBuildReviewAct: (state, action: PayloadAction<any>) => {
            state.sendBuildReviewResp = action.payload;
        },
        setSaveBuildPublishAct: (state, action: PayloadAction<any>) => {
            state.saveBuildPublishResp = action.payload;
        },
        setDigitalCurriculumDownloadReportAct: (state, action: PayloadAction<any>) => {
            state.digitalCurriculumDownloadReportResp = action.payload;
        },

        //HOD Review
        setHodReviewDigitalCurriculumDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getHodReviewDigitalCurriculumDetailsByIdResp = action.payload;
        },
        resetHodReviewDigitalCurriculumDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getHodReviewDigitalCurriculumDetailsByIdResp = action.payload;
        },
        setSubmitHodReviewDigitalCurriculumDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.submitHodReviewDigitalCurriculumDetailsByIdResp = action.payload;
        },
        setHodFeedbackHistoryDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getHodFeedbackHistoryDetailsByIdResp = action.payload;
        },

        //HOD Course Planner Review
        setHodReviewCoursePlannerDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getHodReviewCoursePlannerDetailsByIdResp = action.payload;
        },
        resetHodReviewCoursePlannerDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getHodReviewCoursePlannerDetailsByIdResp = action.payload;
        },
        setSubmitHodReviewCoursePlannerDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.submitHodReviewCoursePlannerDetailsByIdResp = action.payload;
        },
        setHodFeedbackHistoryCoursePlannerDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getHodFeedbackHistoryCoursePlannerDetailsByIdResp = action.payload;
        },
        resetHodFeedbackHistoryDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getHodFeedbackHistoryDetailsByIdResp = action.payload;
        },

        //Error
        lmsdigitalcurriculumErrorAct: (state, action: PayloadAction<any>) => {
            state.lmsdigitalcurriculumErrorAct = action.payload;
        },
    }
})

export const {
    // Digital Curriculum
    setDigitalCurriculumStatsAct,
    setDigitalCurriculumListAct,
    setSaveBasicDigitalCurriculumAct,
    setDigitalCurriculumBasicDetailsByIdAct,
    resetDigitalCurriculumBasicDetailsByIdAct,
    setSaveDigitalCurriculumBulkUploadExcelAct,
    resetSaveDigitalCurriculumBulkUploadExcelAct,
    setSaveHeaderMapDigitalCurriculumAct,
    setGetDigitalCurriculumBulkUploadPreviewAct,
    setSaveDigitalCurriculumBulkUploadAct,
    setDigitalCurriculumManualUploadByIdAct,
    setSaveDigitalCurriculumManualUploadAct,
    resetDigitalCurriculumManualUploadByIdAct,
    setPreviewDigitalCurriculumDetailsAct,
    setSubmitDigitalCurriculumReviewAct,
    resetSaveDigitalCurriculumManualUploadAct,
    setSavePublishDigitalCurriculumAct,
    setCurriculumStructureAct,
    resetCurriculumStructureAct,
    setinlineBuilderGridAct,
    setWeeksListAct,
    saveSubjectCurriculumBuildAct,
    setSendBuildReviewAct,
    setSaveBuildPublishAct,
    setDigitalCurriculumDownloadReportAct,

    //HOD Review
    setHodReviewDigitalCurriculumDetailsByIdAct,
    resetHodReviewDigitalCurriculumDetailsByIdAct,
    setSubmitHodReviewDigitalCurriculumDetailsByIdAct,
    setHodFeedbackHistoryDetailsByIdAct,

    //HOD Course Planner Review
    setHodReviewCoursePlannerDetailsByIdAct,
    resetHodReviewCoursePlannerDetailsByIdAct,
    setSubmitHodReviewCoursePlannerDetailsByIdAct,
    setHodFeedbackHistoryCoursePlannerDetailsByIdAct,
    resetHodFeedbackHistoryDetailsByIdAct,
    //Error
    lmsdigitalcurriculumErrorAct,

} = lmsdigitalcurriculum.actions;

export default lmsdigitalcurriculum.reducer;
