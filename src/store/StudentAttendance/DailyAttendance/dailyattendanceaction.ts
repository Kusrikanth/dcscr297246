import {createAction} from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { DailyAttendanceConstants } from "./dailyattendanceconstants";

import { resetAddStuDailyAttListAct } from "./dailyattendanceslice";


export const getStuDailyAttListAct=createAction<INewActionType | undefined>(DailyAttendanceConstants.GET_STU_DAILY_ATT_LIST);
export const addStuDailyAttListAct =createAction<INewActionType | undefined>(DailyAttendanceConstants.ADD_STU_DAILY_ATT_LIST);
export const updateStuDailyAttListAct =createAction<INewActionType | undefined>(DailyAttendanceConstants.UPDATE_DAILY_ATT_LIST);

export const dateRangeDailyAttAct =createAction<INewActionType | undefined>(DailyAttendanceConstants.DATE_RANGE_DAILY_ATT);
export const attendanceReportListAct = createAction<INewActionType | undefined>(DailyAttendanceConstants.ATTENDANCE_REPORT_LIST);
export const exportAttendanceReportAct = createAction<INewActionType | undefined>(DailyAttendanceConstants.EXPORT_ATTENDANCE_REPORT);
export const totalWorkingDaysReportListAct = createAction<INewActionType | undefined>(DailyAttendanceConstants.TOTAL_WORKING_DAYS_REPORT_LIST);
export const exportTotalWorkingDaysReportAct = createAction<INewActionType | undefined>(DailyAttendanceConstants.EXPORT_TOTAL_WORKING_DAYS_REPORT);

export const getMonthForBranchAndClassAct = createAction<INewActionType | undefined>(DailyAttendanceConstants.GET_MONTH_FOR_BRANCH_AND_CLASS);

// Month wise Attendance

export const getMonthWiseAttListAct = createAction<INewActionType | undefined>(DailyAttendanceConstants.GET_MONTH_WISE_ATT_LIST);
export const exportMostAbsenteesDataAct = createAction<INewActionType | undefined>(DailyAttendanceConstants.EXPORT_MOST_ABSENTEES_DATA);
export const updateMonthWiseAttListAct = createAction<INewActionType | undefined>(DailyAttendanceConstants.UPDATE_MONTH_WISE_ATT_LIST);
export const getAttendanceDashboardAct = createAction<INewActionType | undefined>(DailyAttendanceConstants.GET_ATTENDANCE_DASHBOARD);
export const getAttendanceSectionAnalysisAct = createAction<INewActionType | undefined>(DailyAttendanceConstants.GET_ATTENDANCE_SECTION_ANALYSIS);
export const saveTriggerAttendanceAct = createAction<INewActionType | undefined>(DailyAttendanceConstants.SAVE_TRIGGER_ATTENDANCE);
