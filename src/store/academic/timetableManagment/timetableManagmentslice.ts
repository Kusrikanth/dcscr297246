import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimeTableReducerState } from "./timetableManagmenttypes";

const initialState: TimeTableReducerState = {
    //Period Category
    getPeriodCategoryResp: undefined,
    deletePeriodCategoryResp: undefined,
    savePeriodCategoryResp: undefined,
    updatePeriodCategoryResp: undefined,

    //BreaksType
    getBreaksTypeResp: undefined,
    saveBreaksTypeResp: undefined,
    deleteBreaksTypeResp: undefined,
    updateBreaksTypeResp: undefined,

    //create timetable
    getWeeksResp: undefined,
    getSubjectsTeacherResp: undefined,
    saveTimetableResp: undefined,
    getTimeTableResp: undefined,
    viewTimeTableResp: undefined,
    viewParentTimeTableResp: undefined,
    viewTeacherTimeTableResp: undefined,

    //Breaks
    getBreaksResp: undefined,
    saveBreaksResp: undefined,
    updateBreaksResp: undefined,
    deleteBreaksResp: undefined,

    //error
    getTimeTableErrResp: undefined,
   
}
export const timeTableManagement = createSlice({
    name: "timeTableManagement",
    initialState,
    reducers: {
        //Period Category
        setPeriodCategoryAct: (state, action: PayloadAction<any>) => {
            state.getPeriodCategoryResp = action.payload;
        },
        setDeletePeriodCategoryAct: (state, action: PayloadAction<any>) => {
            state.deletePeriodCategoryResp = action.payload;
        },
        setSavePeriodCategoryAct: (state, action: PayloadAction<any>) => {
            state.savePeriodCategoryResp = action.payload;
        },
        setUpdatePeriodCategoryAct: (state, action: PayloadAction<any>) => {
            state.updatePeriodCategoryResp = action.payload;
        },

        //BreaksType
        setBreaksTypeAct: (state, action: PayloadAction<any>) => {
            state.getBreaksTypeResp = action.payload;
        },
        setSaveBreaksTypeAct: (state, action: PayloadAction<any>) => {
            state.saveBreaksTypeResp = action.payload;
        },
        setDeleteBreaksTypeAct: (state, action: PayloadAction<any>) => {
            state.deleteBreaksTypeResp = action.payload;
        },
        setUpdateBreaksTypeAct: (state, action: PayloadAction<any>) => {
            state.updateBreaksTypeResp = action.payload;
        },

        //create timetable
        setWeeksAct: (state, action: PayloadAction<any>) => {
            state.getWeeksResp = action.payload;
        },
        setSubjectsTeacherAct: (state, action: PayloadAction<any>) => {
            state.getSubjectsTeacherResp = action.payload;
        },
        resetSubjectsTeacherAct: (state, action: PayloadAction<any>) => {
            state.getSubjectsTeacherResp = action.payload;
        },
        setSaveTimetableAct: (state, action: PayloadAction<any>) => {
            state.saveTimetableResp = action.payload;
        },
        setTimeTableAct: (state, action: PayloadAction<any>) => {
            state.getTimeTableResp = action.payload;
        },
        setViewTimeTableAct: (state, action: PayloadAction<any>) => {
            state.viewTimeTableResp = action.payload;
        },
        resetViewTimeTableAct: (state, action: PayloadAction<any>) => {
            state.viewTimeTableResp = action.payload;
        },
        setViewParentTimeTableAct: (state, action: PayloadAction<any>) => {
            state.viewParentTimeTableResp = action.payload;
        },
        resetViewParentTimeTableAct: (state, action: PayloadAction<any>) => {
            state.viewParentTimeTableResp = action.payload;
        },
        setViewTeacherTimeTableAct: (state, action: PayloadAction<any>) => {
            state.viewTeacherTimeTableResp = action.payload;
        },

        //Breaks
        setBreaksAct: (state, action: PayloadAction<any>) => {
            state.getBreaksResp = action.payload;
        },
        setSaveBreaksAct: (state, action: PayloadAction<any>) => {
            state.saveBreaksResp = action.payload;
        },
        setUpdateBreaksAct: (state, action: PayloadAction<any>) => {
            state.updateBreaksResp = action.payload;
        },
        setDeleteBreaksAct: (state, action: PayloadAction<any>) => {
            state.deleteBreaksResp = action.payload;
        },

        //error
        setTimeTableErrAct: (state, action: PayloadAction<any>) => {
            state.getTimeTableErrResp = action.payload;
        },
              
   
    }
})
export const {
    //Period Category
    setPeriodCategoryAct,
    setDeletePeriodCategoryAct,
    setSavePeriodCategoryAct,
    setUpdatePeriodCategoryAct,

    //BreaksType
    setBreaksTypeAct,
    setSaveBreaksTypeAct,
    setDeleteBreaksTypeAct,
    setUpdateBreaksTypeAct,

    //create timetable
    setWeeksAct,
    setSubjectsTeacherAct,
    setSaveTimetableAct,
    setTimeTableAct,
    resetSubjectsTeacherAct,
    setViewTimeTableAct,
    resetViewTimeTableAct,
    setViewParentTimeTableAct,
    resetViewParentTimeTableAct,
    setViewTeacherTimeTableAct,
    
    //Breaks
    setBreaksAct,
    setSaveBreaksAct,
    setUpdateBreaksAct,
    setDeleteBreaksAct,

    //error
    setTimeTableErrAct,

    } = timeTableManagement.actions;
export default timeTableManagement.reducer;