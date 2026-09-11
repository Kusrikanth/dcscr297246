export interface TimeTableReducerState {
    //period category
    getPeriodCategoryResp: any;
    deletePeriodCategoryResp: any;
    savePeriodCategoryResp: any;
    updatePeriodCategoryResp: any;

    //breaks type
    getBreaksTypeResp: any;
    saveBreaksTypeResp: any;
    deleteBreaksTypeResp: any;
    updateBreaksTypeResp: any;

    //create timetable
    getWeeksResp: any;
    getSubjectsTeacherResp: any;
    saveTimetableResp: any;
    getTimeTableResp: any;
    viewTimeTableResp: any;
    viewParentTimeTableResp: any;
    viewTeacherTimeTableResp: any;

    //breaks
    getBreaksResp: any;
    saveBreaksResp: any;
    updateBreaksResp: any;
    deleteBreaksResp: any;
    
    //error
    getTimeTableErrResp: any;

}