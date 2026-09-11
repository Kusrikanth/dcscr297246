export interface lmsdigitalcurriculumReducerState {
    // Digital Curriculum
    getDigitalCurriculumStatsResp: any;
    getDigitalCurriculumListResp: any;
    saveBasicDigitalCurriculumResp: any;
    getDigitalCurriculumBasicDetailsByIdResp: any;
    saveDigitalCurriculumBulkUploadExcelResp: any;
    saveHeaderMapDigitalCurriculumResp: any;
    getDigitalCurriculumBulkUploadPreviewResp: any;
    saveDigitalCurriculumBulkUploadResp: any;
    getDigitalCurriculumanualUploadByIdResp: any;
    saveDigitalCurriculumanualUploadResp: any;
    getPreviewDigitalCurriculumDetailsResp: any;
    submitDigitalCurriculumReviewResp: any;
    savePublishDigitalCurriculumResp: any;

    getCurriculumStructureResp: any;
    getinlineBuilderGridResp: any;
    getWeeksListResp: any;
    saveSubjectCurriculumBuildResp: any;
    sendBuildReviewResp: any;
    saveBuildPublishResp: any;
    digitalCurriculumDownloadReportResp: any;
    
    //HOD Review
    getHodReviewDigitalCurriculumDetailsByIdResp: any;
    submitHodReviewDigitalCurriculumDetailsByIdResp: any;
    getHodFeedbackHistoryDetailsByIdResp: any;
    
    //HOD Course Planner Review
    getHodReviewCoursePlannerDetailsByIdResp: any;
    submitHodReviewCoursePlannerDetailsByIdResp: any;
    getHodFeedbackHistoryCoursePlannerDetailsByIdResp: any;
    
    //error
    lmsdigitalcurriculumErrorAct: any
}