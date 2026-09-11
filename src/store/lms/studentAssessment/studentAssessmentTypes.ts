export interface IStudentAssessmentState {
  getStudentAssessmentsListResp: any;

  getStudentAssessmentsListByIdResp: any;
  studentAssessmentsListByIdErrorResp: any;

  studentAssessmentsErrorResp: any;

  getStudentAssessmentsQuestionsResp: any;
  studentAssessmentsQuestionsErrorResp: any;

  validateStudentReadinessResp: any;
  getCurrentStatusOfAssessmentResp:any;

  validateStudentReadinessErrorResp: any;
  getStartAssessmentDetailsResp: any;
  saveSaveQuestionOrderByAttempIdResp: any;
  restartAssessmentResp: any;
  saveAutoAssessmentResp: any;
  
//Submit Assessment Test
  submitAssessmentResp: any;
  getAssessmentSummaryResultDetailsAct: any;
  getAssessmentQuestionDetailsAct: any;
  saveEvaluateManualMarksResp: any;
  getResultReportCardResp: any

  //Dashboard
  getAssessmentQuestionSectionHeatMapResp: any
  getStatsByAssessmentResp: any
  getAssessmentWiseTopStudentsDetailsResp: any
  getAssessmentSectionGradeSummaryDetailsResp: any
  getAssessmentSectionWiseDetailsDetailsResp: any
  getAssessmentSectionWiseMarksOutcomeDetailsGenAct: any

  //Student-Assessment
  getStudentAssessmentStatsDetailsResp: any
}
