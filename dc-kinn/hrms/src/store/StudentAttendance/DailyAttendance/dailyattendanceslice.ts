import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDailyAttendanceReducerState } from "./dailyattendancetypes";
import { set } from "date-fns";

const initialState: IDailyAttendanceReducerState = {
    getStuDailyAttListResp: undefined,
    addStuDailyAttListResp: undefined,
    updateStuDailyAttListResp: undefined,
    dateRangeDailyAttResp: undefined,
    attendanceReportListResp:undefined,
    exportAttendanceReportResp:undefined,
    getMonthForBranchAndClassResp:undefined,
    totalWorkingDaysReportListResp: undefined,
    exportTotalWorkingDaysReportResp: undefined,

    //month wise attendance
    getMonthWiseAttListResp : undefined,
    exportMostAbsenteesDataResp : undefined,
    updateMonthWiseAttListResp : undefined,
    saveTriggerAttendanceResp : undefined,

    // attendance dashboard
    getAttendanceDashboardResp : undefined,
    getAttendanceSectionAnalysisResp : undefined,

    // error state

    stuDailyAttErrResp : undefined,
}
export const dailyAttendance = createSlice({
    name: "dailyAttendance",
    initialState,
    reducers: {
        setStuDailyAttListAct: (state, action: PayloadAction<any>) => {
            state.getStuDailyAttListResp = action.payload;
        },
        setAddStuDailyAttListAct: (state, action: PayloadAction<any>) => {
            state.addStuDailyAttListResp = action.payload;
        },
        resetAddStuDailyAttListAct: (state, action: PayloadAction<any>) => {
            state.addStuDailyAttListResp = action.payload;
        },
        setUpdateStuDailyAttListAct: (state, action: PayloadAction<any>) => {
            state.updateStuDailyAttListResp = action.payload;
        },
        setDateRangeDailyAttAct: (state, action: PayloadAction<any>) => {
            state.dateRangeDailyAttResp = action.payload;
        },
        setAttendanceReportListAct: (state, action: PayloadAction<any>) => {
            state.attendanceReportListResp = action.payload;
        },
        setExportAttendanceReportAct: (state, action: PayloadAction<any>) => {
            state.exportAttendanceReportResp = action.payload;
        },
        setMonthForBranchAndClassAct: (state, action: PayloadAction<any>) => {
            state.getMonthForBranchAndClassResp = action.payload;
        },
        setTotalWorkingDaysReportListAct: (state, action: PayloadAction<any>) => {
            state.totalWorkingDaysReportListResp = action.payload;
        },
        setExportTotalWorkingDaysReportAct: (state, action: PayloadAction<any>) => {
            state.exportTotalWorkingDaysReportResp = action.payload;
        },
        //month wise attendance

        setMonthWiseAttListAct: (state, action: PayloadAction<any>) => {    
            state.getMonthWiseAttListResp = action.payload;
        },
        setExportMostAbsenteesDataAct: (state, action: PayloadAction<any>) => {    
            state.exportMostAbsenteesDataResp = action.payload;
        },
        setUpdateMonthWiseAttListAct: (state, action: PayloadAction<any>) => {
            state.updateMonthWiseAttListResp = action.payload;
        },
        setSaveTriggerAttendanceAct: (state, action: PayloadAction<any>) => {
            state.saveTriggerAttendanceResp = action.payload;
        },
        //attendance dashboard

        setAttendanceDashboardAct: (state, action: PayloadAction<any>) => {
            state.getAttendanceDashboardResp = action.payload;
        },
        setAttendanceSectionAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getAttendanceSectionAnalysisResp = action.payload;
        },

        //error state

        setStuDailyAttErrAct: (state, action: PayloadAction<any>) => {
            state.stuDailyAttErrResp = action.payload;
        },
      
   
    }
})
export const {
     setStuDailyAttListAct,
     setAddStuDailyAttListAct,
     resetAddStuDailyAttListAct,
     setUpdateStuDailyAttListAct,
     setDateRangeDailyAttAct,
     setAttendanceReportListAct,
     setExportAttendanceReportAct,
     setMonthForBranchAndClassAct,
     setTotalWorkingDaysReportListAct,
     setExportTotalWorkingDaysReportAct,

     // month wise attendance
     setMonthWiseAttListAct,
     setExportMostAbsenteesDataAct,
     setUpdateMonthWiseAttListAct,
     setSaveTriggerAttendanceAct,
     //attendance dashboard

     setAttendanceDashboardAct,
     setAttendanceSectionAnalysisAct,
    //error state

    setStuDailyAttErrAct
    } = dailyAttendance.actions;
export default dailyAttendance.reducer;