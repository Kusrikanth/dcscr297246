export interface IDailyAttendanceReducerState {
    getStuDailyAttListResp:any;
    addStuDailyAttListResp:any;
    updateStuDailyAttListResp:any;
    dateRangeDailyAttResp : any;
    attendanceReportListResp :any;
    exportAttendanceReportResp : any;
    getMonthForBranchAndClassResp : any;
    totalWorkingDaysReportListResp : any;
    exportTotalWorkingDaysReportResp : any;

    //month wise attendance
    getMonthWiseAttListResp : any;
    exportMostAbsenteesDataResp : any;
    updateMonthWiseAttListResp : any;
    saveTriggerAttendanceResp : any;

    //attendance dashboard
    getAttendanceDashboardResp : any;
    getAttendanceSectionAnalysisResp : any;
    
    //error state
    
    stuDailyAttErrResp:any;
}