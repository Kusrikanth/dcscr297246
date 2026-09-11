import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { studentAssessmentConstants } from "./studentAssessmentConstants";
import { resetGetAssessmentQuestionsDetailsAct, resetGetAssessmentSummaryResultDetailsAct } from "./studentAssessmentSlice"

export const getStudentAssessmentsListAct = createAction<
  INewActionType | undefined
>(studentAssessmentConstants.GET_STUDENT_ASSESSMENTS);

export const getStudentAssessmentsListByIdAct = createAction<
  INewActionType | undefined
>(studentAssessmentConstants.GET_STUDENT_ASSESSMENTS_BY_ID);

export const getStudentAssessmentsQuestionsAct = createAction<
  INewActionType | undefined
>(studentAssessmentConstants.GET_STUDENT_ASSESSMENTS_QUESTIONS);

export const validateStudentReadinessAct = createAction<
  INewActionType | undefined
>(studentAssessmentConstants.VALIDATE_STUDENT_READINESS);

export const getCurrentStatusOfAssessmentAct = createAction<INewActionType | undefined>(studentAssessmentConstants.GET_CURRENT_STATUS_OF_ASSESSMENT)
export const getStartAssessmentDetailsAct = createAction<
  INewActionType | undefined
>(studentAssessmentConstants.GET_START_ASSESSMENT_CHANGES);

export const restartAssessmentAct = createAction<
  INewActionType | undefined
>(studentAssessmentConstants.RESTART_ASSESSMENT);

export const saveQuestionOrderByAttemptIdAct = createAction<INewActionType | undefined>(studentAssessmentConstants.SAVE_QUESTION_ORDER_BY_ATTEMPT_ID);
//Auto Save Assessment

export const saveAutoAssessmentAct = createAction<INewActionType | undefined>(studentAssessmentConstants.SAVE_AUTO_ASSESSMENT);

//Submit Assessment Test
export const submitAssessmentAct = createAction<INewActionType | undefined>(studentAssessmentConstants.SUBMIT_ASSESSMENT);
export const getAssessmentResultSummaryDetailsAct = createAction<INewActionType | undefined>(studentAssessmentConstants.GET_ASSESSMENT_RESULT_SUMMARY_DETAILS);
export const getAssessmentQuestionDetailsAct = createAction<INewActionType | undefined>(studentAssessmentConstants.GET_ASSESSMENT_QUESTION_DETAILS);
export const saveEvaluateManualMarksAct = createAction<INewActionType | undefined>(studentAssessmentConstants.SAVE_EVALUATE_MANUAL_MARKS);
export const downloadResultReportCardAct = createAction<INewActionType | undefined>(studentAssessmentConstants.DOWNLOAD_RESULT_REPORT_CARD);

//Dashboard
export const getAssessmentQuestionSectionHeatmap = createAction<INewActionType | undefined>(studentAssessmentConstants.GET_ASSESSMENT_QUESTION_SECTION_HEATMAP);
export const getStatsByAssessmentAct = createAction<INewActionType | undefined>(studentAssessmentConstants.GET_STATS_BY_ASSESSMENT);
export const getAssessmentWiseTopStudentsDetailsAct = createAction<INewActionType | undefined>(studentAssessmentConstants.GET_ASSESSMENT_WISE_TOP_STUDENTS_DETAILS);
export const getAssessmentSectionGradeSummaryDetailsAct = createAction<INewActionType | undefined>(studentAssessmentConstants.GET_ASSESSMENT_SECTION_GRADE_SUMMARY_DETAILS);
export const getAssessmentSectionWiseOutcomeDetailsAct = createAction<INewActionType | undefined>(studentAssessmentConstants.GET_ASSESSMENT_SECTION_WISE_OUTCOME_DETAILS);
export const getAssessmentSectionWiseMarksOutcomeDetailsAct = createAction<INewActionType | undefined>(studentAssessmentConstants.GET_ASSESSMENT_SECTION_WISE_MARKS_OUTCOME_DETAILS);

//Student-Assessment
export const getStudentStatsAssessmentsDetailsListAct = createAction<INewActionType | undefined>(studentAssessmentConstants.GET_STUDENT_ASSESSMENTS_STATS_DETAILS);