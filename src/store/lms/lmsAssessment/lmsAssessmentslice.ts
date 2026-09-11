import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { lmsAssessmentReducerState } from "./lmsAssessmenttypes";

const initialState: lmsAssessmentReducerState = {
   getQuestionBankResp: undefined,
   saveQuestionBankResp: undefined,
   getQuestionBankByIdResp: undefined,
   updateQuestionBankResp: undefined,
   deleteQuestionBankResp: undefined,
   
   //Question Pool
   getQuestionPoolLibraryResp: undefined,
   saveQuestionPoolLibraryResp: undefined,
   deleteQuestionPoolLibraryResp: undefined,
   editQuestionPoolLibraryResp: undefined,
   getQuestionPoolLibraryByIdResp: undefined,

    //Create Assessment
    saveBasicAssessmentResp: undefined,
    getAssessmentCodeResp: undefined,
    getAssessmentByIdResp: undefined,
    saveAssessmentQuestionsResp: undefined,
    getAssessmentQuestionsByIdResp: undefined,
    saveAssignStudentAssessmentResp: undefined,
    saveAssessemntSettingsStepResp:undefined,
    getAssignStudentsAssessmentByIdResp: undefined,
    savePublishAssessmentResp: undefined,
    saveRescheduleAssessmentResp: undefined,
    getAssessmentStatsResp: undefined,
   // get all assesments
   getAllAssessmentsResp: undefined,
   
   //Global Settings
   getSettingsByAssessmentIdResp: undefined,
   getGlobalSettingsBranchIdResp: undefined,
   saveGlobalSettingsResp: undefined,

   //Grades Distribution
    getGradeDistrubutionResp: undefined,
    saveGradeDistrubutionResp: undefined,
    updateGradeDistrubutionResp: undefined,
    deleteGradeDistrubutionResp: undefined,
    getGradeDistrubutionByIdResp: undefined,

    //Assessment Review
    getAssessmentReviewResp: undefined,

    //View Assessment
    getResultListResp: undefined,
    editFeedbackResp:undefined,
    getLiveMonitorResp: undefined,
    exportStudentResultListResp: undefined,
    
   //Error
   lmsAssessmentErrorAct: undefined
}

export const lmsAssessment = createSlice({
    name: "lmsAssessment",
    initialState,
    reducers: {
    //Lms Settings
        setQuestionBankAct: (state, action: PayloadAction<any>) => {
            state.getQuestionBankResp = action.payload;
        },
        resetQuestionBankAct: (state, action: PayloadAction<any>) => {
            state.getQuestionBankResp = action.payload;
        },
        setSaveQuestionBankAct: (state, action: PayloadAction<any>) => {
            state.saveQuestionBankResp = action.payload;
        },
        setQuestionBankByIdAct: (state, action: PayloadAction<any>) => {
            state.getQuestionBankByIdResp = action.payload;
        },
        setUpdateQuestionBankAct: (state, action: PayloadAction<any>) => {
            state.updateQuestionBankResp = action.payload;
        },
        setDeleteQuestionBankAct: (state, action: PayloadAction<any>) => {
            state.deleteQuestionBankResp = action.payload;
        },

        //Question Pool Library
        setQuestionPoolLibraryAct: (state, action: PayloadAction<any>) => {
            state.getQuestionPoolLibraryResp = action.payload;
        },
        setSaveQuestionPoolLibraryAct: (state, action: PayloadAction<any>) => {
            state.saveQuestionPoolLibraryResp = action.payload;
        },
        setDeleteQuestionPoolLibraryAct: (state, action: PayloadAction<any>) => {
            state.deleteQuestionPoolLibraryResp = action.payload;
        },
        setEditQuestionPoolLibraryAct: (state, action: PayloadAction<any>) => {
            state.editQuestionPoolLibraryResp = action.payload;
        },
        setQuestionPoolLibraryByIdAct: (state, action: PayloadAction<any>) => {
            state.getQuestionPoolLibraryByIdResp = action.payload;
        },

        //Create Assessment
        setSaveBasicAssessmentAct: (state, action: PayloadAction<any>) => {
            state.saveBasicAssessmentResp = action.payload;
        },
        resetSaveBasicAssessmentAct: (state, action: PayloadAction<any>) => {
            state.saveBasicAssessmentResp = action.payload;
        },
        setAssessmentCodeAct: (state, action: PayloadAction<any>) => {
            state.getAssessmentCodeResp = action.payload;
        },
        setAssessmentByIdAct: (state, action: PayloadAction<any>) => {
            state.getAssessmentByIdResp = action.payload;
        },
        resetAssessmentByIdAct: (state, action: PayloadAction<any>) => {
            state.getAssessmentByIdResp = action.payload;
        },
        setSaveAssessmentQuestionsAct: (state, action: PayloadAction<any>) => {
            state.saveAssessmentQuestionsResp = action.payload;
        },
        setAssessmentQuestionsByIdAct: (state, action: PayloadAction<any>) => {
            state.getAssessmentQuestionsByIdResp = action.payload;
        },
        resetAssessmentQuestionsByIdAct: (state, action: PayloadAction<any>) => {
            state.getAssessmentQuestionsByIdResp = action.payload;
        },
        setSaveAssignStudentAssessmentAct: (state, action: PayloadAction<any>) => {
            state.saveAssignStudentAssessmentResp = action.payload;
        },
        setAssignStudentsAssessmentByIdAct: (state, action: PayloadAction<any>) => {
            state.getAssignStudentsAssessmentByIdResp = action.payload;
        },
        resetAssignStudentsAssessmentByIdAct: (state, action: PayloadAction<any>) => {
            state.getAssignStudentsAssessmentByIdResp = action.payload;
        },
        setSaveAssessemntSettingsStepAct:(state,action:PayloadAction<any>) => {
            state.saveAssessemntSettingsStepResp = action.payload
        },
        resetSaveAssessemntSettingsStepAct:(state,action:PayloadAction<any>) => {
            state.saveAssessemntSettingsStepResp = action.payload
        },
        setSavePublishAssessmentAct:(state,action:PayloadAction<any>) => {
            state.savePublishAssessmentResp = action.payload
        },
        setSaveRescheduleAssessmentAct:(state,action:PayloadAction<any>) => {
            state.saveRescheduleAssessmentResp = action.payload
        },
        setAssessmentStatsAct:(state,action:PayloadAction<any>) => {
            state.getAssessmentStatsResp = action.payload
        },
    
        //get all assesments
        setAllAssessmentsAct: (state, action: PayloadAction<any>) => {
            state.getAllAssessmentsResp = action.payload;
        },  

        //Global Settings
        setSettingsByAssessmentIdAct: (state, action: PayloadAction<any>) => {
            state.getSettingsByAssessmentIdResp = action.payload;
        }, 
        resetSettingsByAssessmentIdAct: (state, action: PayloadAction<any>) => {
            state.getSettingsByAssessmentIdResp = action.payload;
        }, 
        setGlobalSettingsBranchIdAct: (state, action: PayloadAction<any>) => {
            state.getGlobalSettingsBranchIdResp = action.payload;
        }, 
        setSaveGlobalSettingsAct: (state, action: PayloadAction<any>) => {
            state.saveGlobalSettingsResp = action.payload;
        },

        //Grades Distribution
            setGradeDistrubutionAct: (state, action: PayloadAction<any>) => {
            state.getGradeDistrubutionResp = action.payload;
        }, 
            resetGradeDistrubutionAct: (state, action: PayloadAction<any>) => {
            state.getGradeDistrubutionResp = action.payload;
        }, 
    setSaveGradeDistrubutionAct: (state, action: PayloadAction<any>) => {
            state.saveGradeDistrubutionResp = action.payload;
        }, 
    setUpdateGradeDistrubutionAct: (state, action: PayloadAction<any>) => {
            state.updateGradeDistrubutionResp = action.payload;
        }, 
    setDeleteGradeDistrubutionAct: (state, action: PayloadAction<any>) => {
            state.deleteGradeDistrubutionResp = action.payload;
        }, 
    setGradeDistrubutionByIdAct: (state, action: PayloadAction<any>) => {
            state.getGradeDistrubutionByIdResp = action.payload;
        }, 

        //Review
        setAssessmentReviewAct: (state, action: PayloadAction<any>) => {
            state.getAssessmentReviewResp = action.payload;
        },
        resetAssessmentReviewAct: (state, action: PayloadAction<any>) => {
            state.getAssessmentReviewResp = action.payload;
        },

        //View Assessment
        setResultListAct: (state, action: PayloadAction<any>) => {
            state.getResultListResp = action.payload;
        },
        setEditFeedbackAct: (state, action: PayloadAction<any>) => {
            state.editFeedbackResp = action.payload;
        },
        setLiveMonitorAct: (state, action: PayloadAction<any>) => {
            state.getLiveMonitorResp = action.payload;
        },
        setExportStudentResultListAct: (state, action: PayloadAction<any>) => {
            state.exportStudentResultListResp = action.payload
        },
        //Error
        lmsAssessmentErrorAct: (state, action: PayloadAction<any>) => {
            state.lmsAssessmentErrorAct = action.payload;
        },
    }
})

export const {
    //Lms Settings
    setQuestionBankAct,
    resetQuestionBankAct,
    setSaveQuestionBankAct,
    setQuestionBankByIdAct,
    setUpdateQuestionBankAct,
    setDeleteQuestionBankAct,
    
    setQuestionPoolLibraryAct,
    setSaveQuestionPoolLibraryAct,
    setDeleteQuestionPoolLibraryAct,
    setEditQuestionPoolLibraryAct,
    setQuestionPoolLibraryByIdAct,


    //Create Assessment
    setSaveBasicAssessmentAct,
    resetSaveBasicAssessmentAct,
    setAssessmentCodeAct,
    setAssessmentByIdAct,
    resetAssessmentByIdAct,
    setSaveAssessmentQuestionsAct,
    setAssessmentQuestionsByIdAct,
    resetAssessmentQuestionsByIdAct,
    setSaveAssignStudentAssessmentAct,
    setSaveAssessemntSettingsStepAct,
    resetSaveAssessemntSettingsStepAct,
    setAssignStudentsAssessmentByIdAct,
    setSavePublishAssessmentAct,
    setSaveRescheduleAssessmentAct,
    resetAssignStudentsAssessmentByIdAct,
    setAssessmentStatsAct,
    // get all assesments
    setAllAssessmentsAct,
    
    //Global Settings
    setSettingsByAssessmentIdAct,
    setGlobalSettingsBranchIdAct,
    setSaveGlobalSettingsAct,
    resetSettingsByAssessmentIdAct,

    //Grades Distribution
    setGradeDistrubutionAct,
    resetGradeDistrubutionAct,
    setSaveGradeDistrubutionAct,
    setUpdateGradeDistrubutionAct,
    setDeleteGradeDistrubutionAct,
    setGradeDistrubutionByIdAct,

    //Review
    setAssessmentReviewAct,
    resetAssessmentReviewAct,

    //View Assessment
    setResultListAct,
    setEditFeedbackAct,
    setLiveMonitorAct,
    setExportStudentResultListAct,

    //Error
    lmsAssessmentErrorAct,

} = lmsAssessment.actions;

export default lmsAssessment.reducer;
