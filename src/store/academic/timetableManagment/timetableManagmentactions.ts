import { createAction } from "@reduxjs/toolkit";
import { timetableManagmentConstants } from "./timetableManagmentconstants";
import { INewActionType } from "../../types";
export { resetSubjectsTeacherAct, resetViewTimeTableAct, resetViewParentTimeTableAct } from "./timetableManagmentslice"



//Period Category
export const getPeriodCategoryAct = createAction<INewActionType | undefined>(timetableManagmentConstants.GET_PERIOD_CATEGORY);
export const deletePeriodCategoryAct = createAction<INewActionType | undefined>(timetableManagmentConstants.DELETE_PERIOD_CATEGORY);
export const savePeriodCategoryAct = createAction<INewActionType | undefined>(timetableManagmentConstants.SAVE_PERIOD_CATEGORY);
export const updatePeriodCategoryAct = createAction<INewActionType | undefined>(timetableManagmentConstants.UPDATE_PERIOD_CATEGORY);

//Breaks Type
export const getBreaksTypeAct = createAction<INewActionType | undefined>(timetableManagmentConstants.GET_BREAKS_TYPE);
export const saveBreaksTypeAct = createAction<INewActionType | undefined>(timetableManagmentConstants.SAVE_BREAKS_TYPE);
export const deleteBreaksTypeAct = createAction<INewActionType | undefined>(timetableManagmentConstants.DELETE_BREAKS_TYPE);
export const updateBreaksTypeAct = createAction<INewActionType | undefined>(timetableManagmentConstants.UPDATE_BREAKS_TYPE);

//create timetable
export const getWeeksAct = createAction<INewActionType | undefined>(timetableManagmentConstants.GET_WEEKS);
export const getSubjectsTeacherAct = createAction<INewActionType | undefined>(timetableManagmentConstants.GET_SUBJECTS_TEACHER);
export const saveTimetableAct = createAction<INewActionType | undefined>(timetableManagmentConstants.SAVE_TIMETABLE);
export const getTimeTableAct = createAction<INewActionType | undefined>(timetableManagmentConstants.GET_TIMETABLE);
export const viewTimeTableAct = createAction<INewActionType | undefined>(timetableManagmentConstants.VIEW_TIMETABLE);
export const viewParentTimeTableAct = createAction<INewActionType | undefined>(timetableManagmentConstants.VIEW_PARENT_TIMETABLE);
export const viewTeacherTimeTableAct = createAction<INewActionType | undefined>(timetableManagmentConstants.VIEW_TEACHER_TIMETABLE);

//Breaks

export const getBreaksAct = createAction<INewActionType | undefined>(timetableManagmentConstants.GET_BREAKS);
export const saveBreaksAct = createAction<INewActionType | undefined>(timetableManagmentConstants.SAVE_BREAKS);
export const updateBreaksAct = createAction<INewActionType | undefined>(timetableManagmentConstants.UPDATE_BREAKS);
export const deleteBreaksAct = createAction<INewActionType | undefined>(timetableManagmentConstants.DELETE_BREAKS);