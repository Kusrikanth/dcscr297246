import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAssignLanguagesReducerState } from "./assignlanguagestypes";

const initialState: IAssignLanguagesReducerState = {
    getAssignLanguagesListResp: undefined,
    getStuLanguagesListResp : undefined,
    getAssignLanClassListResp : undefined,
    getAssignLanSectionListResp : undefined,
    updateAssignLanguagesResp: undefined,
    copyAssignLanguagesResp: undefined,
    getAssignListCurriculumResp : undefined,
    advanceFilterCurriculumListResp : undefined,
    advanceFilterClassListResp : undefined,
    exportAssignLanguagesResp : undefined,
    getAssignLanBrchStreamGroupsResp : undefined,
    getExaminationLanguagesListResp: undefined,

    // error state

    assignLanguagesErrResp : undefined,
}
export const assignLanguages = createSlice({
    name: "assignLanguages",
    initialState,
    reducers: {
        setAssignLanguagesListAct: (state, action: PayloadAction<any>) => {
            state.getAssignLanguagesListResp = action.payload;
        },
        setStuLanguagesListAct: (state, action: PayloadAction<any>) => {
            state.getStuLanguagesListResp = action.payload;
        },
        resetStuLanguagesListAct: (state, action: PayloadAction<any>) => {
            state.getStuLanguagesListResp = action.payload;
        },
        setAssignLanClassListAct: (state, action: PayloadAction<any>) => {
            state.getAssignLanClassListResp = action.payload;
        },
        resetAssignLanClassListAct: (state, action: PayloadAction<any>) => {
            state.getAssignLanClassListResp = action.payload;
        },
        setAssignListCurriculumAct: (state, action: PayloadAction<any>) => {
            state.getAssignListCurriculumResp = action.payload;
        },
        resetAssignListCurriculumAct: (state, action: PayloadAction<any>) => {
            state.getAssignListCurriculumResp = action.payload;
        },
        setAssignLanSectionListAct: (state, action: PayloadAction<any>) => {
            state.getAssignLanSectionListResp = action.payload;
        },
        resetAssignLanSectionListAct: (state, action: PayloadAction<any>) => {
            state.getAssignLanSectionListResp = action.payload;
        },
        setUpdateAssignLanguagesAct: (state, action: PayloadAction<any>) => {
            state.updateAssignLanguagesResp = action.payload;
        },
        setCopyAssignLanguagesAct: (state, action: PayloadAction<any>) => {
            state.copyAssignLanguagesResp = action.payload;
        },
        setAdvanceFilterCurriculumListAct: (state, action: PayloadAction<any>) => {
            state.advanceFilterCurriculumListResp = action.payload;
        },
        setAdvanceFilterClassListAct: (state, action: PayloadAction<any>) => {
            state.advanceFilterClassListResp = action.payload;
        },
        setExportAssignLanguagesAct: (state, action: PayloadAction<any>) => {
            state.exportAssignLanguagesResp = action.payload;
        },
        setAssignLanBrchStreamGroupsAct: (state, action: PayloadAction<any>) => {
            state.getAssignLanBrchStreamGroupsResp = action.payload;
        },
        setExaminationLanguagesListAct: (state, action: PayloadAction<any>) => {
            state.getExaminationLanguagesListResp = action.payload;
        },

        //error state

        setAssignLanguagesErrAct: (state, action: PayloadAction<any>) => {
            state.assignLanguagesErrResp = action.payload;
        },
      
   
    }
})
export const {
    setAssignLanguagesListAct,
    setStuLanguagesListAct,
    setAssignLanClassListAct,
    setAssignLanSectionListAct,
    resetAssignLanClassListAct,
    setUpdateAssignLanguagesAct,
    resetStuLanguagesListAct,
    resetAssignLanSectionListAct,
    setCopyAssignLanguagesAct,
    setAssignListCurriculumAct,
    resetAssignListCurriculumAct,
    setAdvanceFilterCurriculumListAct,
    setAdvanceFilterClassListAct,
    setExportAssignLanguagesAct,
    setAssignLanBrchStreamGroupsAct,
    setExaminationLanguagesListAct,

    //error state

    setAssignLanguagesErrAct
    } = assignLanguages.actions;
export default assignLanguages.reducer;