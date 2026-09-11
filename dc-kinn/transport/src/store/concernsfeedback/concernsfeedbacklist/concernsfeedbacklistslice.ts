import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConcernsFeedbackReducerState } from "./concernsfeedbacklisttypes";
import { set } from "date-fns";


const initialState: IConcernsFeedbackReducerState = {
    getConcernsFeedbackListResp:undefined,
    getConcernsStatsResp:undefined,
    getConcernsFeedbackListByIdResp:undefined,
    getCommentListResp:undefined,
    editCommentListResp:undefined,
    deleteCommentListResp:undefined,
    deleteConcernFileResp:undefined,
    addConcernFileResp:undefined,
    addCommentListResp:undefined,
    editConcernsFeedbackListResp:undefined,
    getConcernsUserListResp:undefined,
    addConcernsFeedbackListResp:undefined,
    exportConcernsFeedbackListResp:undefined,
    concernDeptByHeadResp: undefined,
    allModulesListResp: undefined,

    // concern to parent
    getConcernsToParentListResp : undefined,
    saveConcernsToParentListResp : undefined,
    getConcernsToParentSectionListResp : undefined,

    // helpdesk dashboard
    getHelpDeskStatsResp : undefined,
    getFetchRequestTypeResp : undefined,
    getDepartmentListResp : undefined,
    getMonthWiseTicketsResp : undefined,
    getTopTenDepartmentsResp : undefined,
    getTopTenDepartmentsModelResp : undefined,
    getDepartmentAnalysisResp : undefined,
    exportOpenTicketsResp : undefined,

    // error state

    concernsFeedbackErrResp : undefined,
}
export const concernFeedback = createSlice({
    name: "concernFeedback",
    initialState,
    reducers: {
        setConcernsFeedbackListAct: (state, action: PayloadAction<any>) => {
            state.getConcernsFeedbackListResp = action.payload;
        },
        resetConcernsFeedbackListAct: (state, action: PayloadAction<any>) => {
            state.getConcernsFeedbackListResp = action.payload;
        },
        setConcernsStatsAct: (state, action: PayloadAction<any>) => {
            state.getConcernsStatsResp = action.payload;
        },
        setConcernsFeedbackListByIdAct: (state, action: PayloadAction<any>) => {
            state.getConcernsFeedbackListByIdResp = action.payload;
        },
        setCommentListAct: (state, action: PayloadAction<any>) => {
            state.getCommentListResp = action.payload;
        },
        setEditCommentListAct: (state, action: PayloadAction<any>) => {
            state.editCommentListResp = action.payload;
        },
        setDeleteCommentListAct: (state, action: PayloadAction<any>) => {
            state.deleteCommentListResp = action.payload;
        },
        setDeleteConcernFileAct: (state, action: PayloadAction<any>) => {
            state.deleteConcernFileResp = action.payload;
        },
        setAddConcernFileAct: (state, action: PayloadAction<any>) => {
            state.addConcernFileResp = action.payload;
        },
        setAddCommentListAct: (state, action: PayloadAction<any>) => {
            state.addCommentListResp = action.payload;
        },
        setEditConcernsFeedbackListAct: (state, action: PayloadAction<any>) => {
            state.editConcernsFeedbackListResp = action.payload;
        },
        setAddConcernsFeedbackListAct: (state, action: PayloadAction<any>) => {
            state.addConcernsFeedbackListResp = action.payload;
        },
        setConcernsUserListAct: (state, action: PayloadAction<any>) => {
            state.getConcernsUserListResp = action.payload;
        },
        setExportConcernsFeedbackListAct: (state, action: PayloadAction<any>) => {
            state.exportConcernsFeedbackListResp = action.payload;
        },

        setConcernDeptByHeadAct: (state, action: PayloadAction<any>) => {
            state.concernDeptByHeadResp = action.payload;
        },
        setAllModulesListAct: (state, action: PayloadAction<any>) => {
            state.allModulesListResp = action.payload;
        },

        // concern to parent
        setConcernsToParentListAct: (state, action: PayloadAction<any>) => {
            state.getConcernsToParentListResp = action.payload;
        },
        setConcernsToParentSectionListAct: (state, action: PayloadAction<any>) => {
            state.getConcernsToParentSectionListResp = action.payload;
        },
        setSaveConcernsToParentListAct: (state, action: PayloadAction<any>) => {
            state.saveConcernsToParentListResp = action.payload;
        },

        // helpdesk dashboard
        setHelpDeskStatsAct: (state, action: PayloadAction<any>) => {
            state.getHelpDeskStatsResp = action.payload;
        },
        setFetchRequestTypeAct: (state, action: PayloadAction<any>) => {
            state.getFetchRequestTypeResp = action.payload;
        },
        setDepartmentListAct: (state, action: PayloadAction<any>) => {
            state.getDepartmentListResp = action.payload;
        },
        setMonthWiseTicketsAct: (state, action: PayloadAction<any>) => {
            state.getMonthWiseTicketsResp = action.payload;
        },
        setTopTenDepartmentsAct: (state, action: PayloadAction<any>) => {
            state.getTopTenDepartmentsResp = action.payload;
        },
        setTopTenDepartmentsModelAct: (state, action: PayloadAction<any>) => {
            state.getTopTenDepartmentsModelResp = action.payload;
        },
        setDepartmentAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getDepartmentAnalysisResp = action.payload;
        },
        setExportOpenTicketsAct: (state, action: PayloadAction<any>) => {
            state.exportOpenTicketsResp = action.payload;
        },
        
        //error state

        setConcernsFeedbackErrorAct: (state, action: PayloadAction<any>) => {
            state.concernsFeedbackErrResp = action.payload;
        },
      
    }
})
export const {
    setConcernsFeedbackListAct,
    setConcernsStatsAct,
    setConcernsFeedbackListByIdAct,
    setCommentListAct,
    setEditCommentListAct,
    setDeleteCommentListAct,
    setDeleteConcernFileAct,
    setAddCommentListAct,
    setAddConcernFileAct,
    setConcernsUserListAct,
    setEditConcernsFeedbackListAct,
    setAddConcernsFeedbackListAct,
    resetConcernsFeedbackListAct,
    setExportConcernsFeedbackListAct,
    setConcernDeptByHeadAct,
    setAllModulesListAct,

    // concern to parent
    setConcernsToParentListAct,
    setConcernsToParentSectionListAct,
    setSaveConcernsToParentListAct,

    // helpdesk dashboard
    setHelpDeskStatsAct,
    setFetchRequestTypeAct,
    setDepartmentListAct,
    setMonthWiseTicketsAct,
    setTopTenDepartmentsAct,
    setTopTenDepartmentsModelAct,
    setDepartmentAnalysisAct,
    setExportOpenTicketsAct,

    //error state
    setConcernsFeedbackErrorAct,
    
    } = concernFeedback.actions;
    
export default concernFeedback.reducer;