import {createAction} from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { ScheduleTaskConstants } from "./scheduleTaskconstants";


export const getScheduleListAct = createAction<INewActionType | undefined>(ScheduleTaskConstants.GET_SCHEDULE_LIST);
export const addScheduleTaskAct = createAction<INewActionType | undefined>(ScheduleTaskConstants.ADD_SCHEDULE_TASK);
export const deleteScheduleTaskAct = createAction<INewActionType | undefined>(ScheduleTaskConstants.DELETE_SCHEDULE_TASK);
export const editScheduleTaskAct = createAction<INewActionType | undefined>(ScheduleTaskConstants.EDIT_SCHEDULE_TASK);
export const updateStatusScheduleTaskAct = createAction<INewActionType | undefined>(ScheduleTaskConstants.UPDATE_STATUS_SCHEDULE_TASK);

