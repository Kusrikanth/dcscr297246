import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { lmsAssessmentConstants } from "./lmsAssessmentconstants";
export { resetAssessmentByIdAct, resetQuestionBankAct, resetAssessmentQuestionsByIdAct, resetAssignStudentsAssessmentByIdAct, resetSaveBasicAssessmentAct, resetSaveAssessemntSettingsStepAct, resetSettingsByAssessmentIdAct, resetAssessmentReviewAct, resetGradeDistrubutionAct } from "./lmsAssessmentslice";


//Lms Settings

export const getQuestionBankAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_QUESTION_BANK_REPOSITORY);
export const saveQuestionBankAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.SAVE_QUESTION_BANK_REPOSITORY);
export const getQuestionBankByIdAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_QUESTION_BANK_REPOSITORY_BY_ID);
export const updateQuestionBankAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.UPDATE_QUESTION_BANK_REPOSITORY);
export const deleteQuestionBankAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.DELETE_QUESTION_BANK_REPOSITORY);

//question pool
export const getQuestionPoolLibraryAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_QUESTION_POOL_LIBRARY);
export const saveQuestionPoolLibraryAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.SAVE_QUESTION_POOL_LIBRARY);
export const deleteQuestionPoolLibraryAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.DELETE_QUESTION_POOL_LIBRARY);
export const editQuestionPoolLibraryAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.EDIT_QUESTION_POOL_LIBRARY);
export const getQuestionPoolLibraryByIdAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_QUESTION_POOL_LIBRARY_BY_ID);


//Create Assessment
export const saveBasicAssessmentAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.SAVE_BASIC_ASSESSMENT);
export const getAssessmentCodeAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_ASSESSMENT_CODE);
export const getAssessmentCodeByIdAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_ASSESSMENT_BY_ID);
export const saveAssessmentQuestionsAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.SAVE_ASSESSMENT_QUESTIONS);
export const getAssessmentQuestionsByIdAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_ASSESSMENT_QUESTIONS_BY_ID);
export const saveAssignStudentAssessmentAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.SAVE_ASSIGN_STUDENTS_ASSESSMENT);
export const saveAssessmentSettingsStepAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.SAVE_ASSESSMENT_SETTINGS_STEP);
export const getAssignStudentsAssessmentByIdAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_ASSIGN_STUDENTS_ASSESSMENT_BY_ID);
export const savePublishAssessmentAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.SAVE_PUBLISHED_ASSESSMENT);
export const saveRescheduleAssessmentAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.SAVE_RESCHEDULE_ASSESSMENT);
export const getAssessmentStatsAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_ASSESSMENT_STATS);
//All-Assessments
export const getAllAssessmentsAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_ALL_ASSESSMENTS);

//Global Settings
export const getSettingsAssessmentIdAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_SETTINGS_ASSESSMENT_ID);
export const getGlobalSettingsBranchIdAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_GLOBAL_SETTINGS_BRANCH_ID);
export const saveGlobalSettingsAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.SAVE_GLOBAL_SETTINGS);

//Grades Distribution
export const getGradesDistributionAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_GRADES_DISTRIBUTION);
export const saveGradesDistributionAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.SAVE_GRADES_DISTRIBUTION);
export const updateGradesDistributionAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.UPDATE_GRADES_DISTRIBUTION);
export const deleteGradesDistributionAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.DELETE_GRADES_DISTRIBUTION);
export const getGradesDistributionByIdAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_GRADES_DISTRIBUTION_BY_ID);

//Review
export const getAssessmentReviewAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_ASSESSMENT_REVIEW);

//view Assessment
export const getResultListAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_RESULT_LIST);
export const editFeedbackAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.EDIT_FEEDBACK);
export const getLiveMonitorAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.GET_LIVE_MONITOR);
export const exportStudentResultListAct = createAction<INewActionType | undefined>(lmsAssessmentConstants.EXPORT_STUDENT_RESULT_LIST);