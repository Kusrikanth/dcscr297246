import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { HolidayDetailsConstants } from "./holidaydetailsconstants";

export { setHolidayClassesAct, setHolidayDetailsListAct,resetBrchClassHolidaysAct } from "./holidaydetailsslice";
export const getHolidayDetailsListAct = createAction<INewActionType | undefined>(HolidayDetailsConstants.GET_HOLIDAY_DETAILES_LIST);
export const getHolidayClassesAct = createAction<INewActionType | undefined>(HolidayDetailsConstants.HOLIDAY_DETAILS_CLASSES_REQUEST);
export const getHolidayByIdAct = createAction<INewActionType | undefined>(HolidayDetailsConstants.HOLIDAY_DETAILS_BYID_LIST);
export const addHolidayAct = createAction<INewActionType | undefined>(HolidayDetailsConstants.ADD_HOLIDAY_DETAILS_REQUEST);
export const updateHolidayAct = createAction<INewActionType | undefined>(HolidayDetailsConstants.UPDATE_HOLIDAY_DETAILS_REQUEST);
export const deleteHolidayAct = createAction<INewActionType | undefined>(HolidayDetailsConstants.DELETE_HOLIDAY_DETAILS_REQUEST);
export const exportHolidayAct = createAction<INewActionType | undefined>(HolidayDetailsConstants.EXPORT_HOLIDAY_DETAILS_REQUEST);
export const getBrchClassHolidayAct = createAction<INewActionType | undefined>(HolidayDetailsConstants.GET_BRCH_CLASS_HOLIDAYS);


//attendance holiday details

export const getAttendanceHolidayDetailsListAct = createAction<INewActionType | undefined>(HolidayDetailsConstants.GET_ATTENDANCE_HOLIDAY_DETAILES_LIST);