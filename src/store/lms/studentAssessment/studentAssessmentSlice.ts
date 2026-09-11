import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStudentAssessmentState } from "./studentAssessmentTypes";

const initialState: IStudentAssessmentState = {
  getStudentAssessmentsListResp: undefined,
  getStudentAssessmentsListByIdResp: undefined,
  getStudentAssessmentsQuestionsResp: undefined,
  studentAssessmentsQuestionsErrorResp: undefined,

  studentAssessmentsErrorResp: undefined,
  studentAssessmentsListByIdErrorResp: undefined,

  validateStudentReadinessResp: undefined,
  getCurrentStatusOfAssessmentResp:undefined,
  validateStudentReadinessErrorResp: undefined,
  getStartAssessmentDetailsResp: undefined,
  restartAssessmentResp: undefined,
  saveSaveQuestionOrderByAttempIdResp: undefined,
  saveAutoAssessmentResp: undefined,
//Submit Assessment Test
  submitAssessmentResp: undefined,
  getAssessmentSummaryResultDetailsAct: undefined,
  getAssessmentQuestionDetailsAct: undefined,
  saveEvaluateManualMarksResp: undefined,
  getResultReportCardResp: undefined,

  //Dashboard
  getAssessmentQuestionSectionHeatMapResp: undefined,
  getStatsByAssessmentResp: undefined,
  getAssessmentWiseTopStudentsDetailsResp: undefined,
  getAssessmentSectionGradeSummaryDetailsResp: undefined,
  getAssessmentSectionWiseDetailsDetailsResp: undefined,
  getAssessmentSectionWiseMarksOutcomeDetailsGenAct: undefined,

  //Student-Assessment
  getStudentAssessmentStatsDetailsResp: undefined,
};

export const studentAssessments = createSlice({
  name: "studentAssessments",
  initialState,
  reducers: {
    setStudentAssessmentsListAct: (state, action: PayloadAction<any>) => {
      state.getStudentAssessmentsListResp = action.payload;
    },
    setStudentAssessmentsErrorAct: (state, action: PayloadAction<any>) => {
      state.studentAssessmentsErrorResp = action.payload;
    },
    setStudentAssessmentsListByIdAct: (state, action: PayloadAction<any>) => {
      state.getStudentAssessmentsListByIdResp = action.payload;
    },
    setStudentAssessmentsListByIdErrorAct: (state, action: PayloadAction<any>) => {
      state.studentAssessmentsListByIdErrorResp = action.payload;
    },
    setStudentAssessmentsQuestionsAct: (state, action: PayloadAction<any>) => {
      state.getStudentAssessmentsQuestionsResp = action.payload;
    },
    setStudentAssessmentsQuestionsErrorAct: (state, action: PayloadAction<any>) => {
      state.studentAssessmentsQuestionsErrorResp = action.payload;
    },
    setValidateStudentReadinessAct: (state, action: PayloadAction<any>) => {
      state.validateStudentReadinessResp = action.payload;
    },
    setCurrentStatusOfAssessmentAct:(state, action: PayloadAction<any>) => {
      state.getCurrentStatusOfAssessmentResp = action.payload
    },

    setValidateStudentReadinessErrorAct: (state, action: PayloadAction<any>) => {
      state.validateStudentReadinessErrorResp = action.payload;
    },

    setStartAssessmentDetailsAct: (state, action: PayloadAction<any>) => {
      state.getStartAssessmentDetailsResp = action.payload;
    },

    setRestartAssessmentAct: (state, action: PayloadAction<any>) => {
      state.restartAssessmentResp = action.payload;
    },

    setSaveQuestionOrderByAttempIdAct: (state, action: PayloadAction<any>) => {
      state.saveSaveQuestionOrderByAttempIdResp = action.payload;
    },

    setSaveAutoAssessmentAct: (state, action: PayloadAction<any>) => {
      state.saveAutoAssessmentResp = action.payload;
    },

    //Dashboard
    setGetAssessmentQuestionSectionHeatMapGenAct: (state, action: PayloadAction<any>) => {
      state.getAssessmentQuestionSectionHeatMapResp = action.payload;
    },
    setGetStatsByAssessmentGenAct: (state, action: PayloadAction<any>) => {
      state.getStatsByAssessmentResp = action.payload;
    },
    setGetAssessmentWiseTopStudentsDetailsGenAct: (state, action: PayloadAction<any>) => {
      state.getAssessmentWiseTopStudentsDetailsResp = action.payload;
    },
    setGetAssessmentSectionGradeSummaryDetailsGenAct: (state, action: PayloadAction<any>) => {
      state.getAssessmentSectionGradeSummaryDetailsResp = action.payload;
    },
    setGetAssessmentSectionWiseOutcomeDetailsGenAct: (state, action: PayloadAction<any>) => {
      state.getAssessmentSectionWiseDetailsDetailsResp = action.payload;
    },
    setGetAssessmentSectionWiseMarksOutcomeDetailsGenAct: (state, action: PayloadAction<any>) => {
      state.getAssessmentSectionWiseMarksOutcomeDetailsGenAct = action.payload;
    },
//Submit Assessment Test
    setsubmitAssessmentAct: (state, action: PayloadAction<any>) => {
      state.submitAssessmentResp = action.payload;
    },
    setGetAssessmentSummaryResultDetailsAct: (state, action: PayloadAction<any>) => {
      state.getAssessmentSummaryResultDetailsAct = action.payload;
    },
    setGetAssessmentQuestionsDetailsAct: (state, action: PayloadAction<any>) => {
      state.getAssessmentQuestionDetailsAct = action.payload;
    },
    resetGetAssessmentQuestionsDetailsAct: (state, action: PayloadAction<any>) => {
      state.getAssessmentQuestionDetailsAct = action.payload;
    },
    resetGetAssessmentSummaryResultDetailsAct: (state, action: PayloadAction<any>) => {
      state.getAssessmentSummaryResultDetailsAct = action.payload;
    },
    setSaveEvaluateManualMarksAct: (state, action: PayloadAction<any>) => {
      state.saveEvaluateManualMarksResp = action.payload;
    },
    setDownloadResultReportCardAct: (state, action: PayloadAction<any>) => {
      state.getResultReportCardResp = action.payload;
    },

    //Student-Assessment
    setGetStudentAssessmentStatsDetailsGenAct: (state, action: PayloadAction<any>) => {
      state.getStudentAssessmentStatsDetailsResp = action.payload;
    },
  },
});


export const { setStudentAssessmentsListAct, setCurrentStatusOfAssessmentAct,
  
  //Dashboard
  setGetAssessmentQuestionSectionHeatMapGenAct, 
  setGetStatsByAssessmentGenAct,
  setGetAssessmentWiseTopStudentsDetailsGenAct,
  setGetAssessmentSectionGradeSummaryDetailsGenAct,
  setGetAssessmentSectionWiseOutcomeDetailsGenAct,
  setGetAssessmentSectionWiseMarksOutcomeDetailsGenAct,
  setGetStudentAssessmentStatsDetailsGenAct,
  setStudentAssessmentsErrorAct } =
  studentAssessments.actions;

export const { setStudentAssessmentsListByIdAct, setStudentAssessmentsListByIdErrorAct } =
  studentAssessments.actions;

export const { setStudentAssessmentsQuestionsAct, setStudentAssessmentsQuestionsErrorAct } =
  studentAssessments.actions;

export const { setValidateStudentReadinessAct, setStartAssessmentDetailsAct, setRestartAssessmentAct, setSaveQuestionOrderByAttempIdAct, setSaveAutoAssessmentAct, setsubmitAssessmentAct, setGetAssessmentSummaryResultDetailsAct, setGetAssessmentQuestionsDetailsAct, resetGetAssessmentQuestionsDetailsAct, resetGetAssessmentSummaryResultDetailsAct, setSaveEvaluateManualMarksAct, setDownloadResultReportCardAct,
  setValidateStudentReadinessErrorAct } =
  studentAssessments.actions;

export default studentAssessments.reducer;
