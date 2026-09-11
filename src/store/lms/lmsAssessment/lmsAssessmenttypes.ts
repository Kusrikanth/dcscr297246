export interface lmsAssessmentReducerState {
    getQuestionBankResp: any;
    saveQuestionBankResp: any;
    getQuestionBankByIdResp: any;
    updateQuestionBankResp: any;
    deleteQuestionBankResp: any;
    
    //Question Pool
    getQuestionPoolLibraryResp: any;
    saveQuestionPoolLibraryResp: any;
    deleteQuestionPoolLibraryResp: any;
    editQuestionPoolLibraryResp: any;
   getQuestionPoolLibraryByIdResp: any;

    //Create Assessment
    saveBasicAssessmentResp: any;
    getAssessmentCodeResp: any;
    getAssessmentByIdResp: any;
    saveAssessmentQuestionsResp: any;
    getAssessmentQuestionsByIdResp: any;
    saveAssignStudentAssessmentResp: any;
    getAssignStudentsAssessmentByIdResp: any;
    saveAssessemntSettingsStepResp:any;
    savePublishAssessmentResp: any;
    saveRescheduleAssessmentResp: any;
    getAssessmentStatsResp: any;
    //gett all assesments
    getAllAssessmentsResp: any;

    //Global Settings
    getSettingsByAssessmentIdResp: any;
    getGlobalSettingsBranchIdResp: any;
    saveGlobalSettingsResp: any;
    
    //Grades Distribution
    getGradeDistrubutionResp: any;
    saveGradeDistrubutionResp: any;
    updateGradeDistrubutionResp: any;
    deleteGradeDistrubutionResp: any;
    getGradeDistrubutionByIdResp: any;

    //Review
    getAssessmentReviewResp: any;

    //view assessment details
    getResultListResp: any;
    editFeedbackResp: any;
    getLiveMonitorResp: any;
    exportStudentResultListResp: any;

    //error
    lmsAssessmentErrorAct: any
}