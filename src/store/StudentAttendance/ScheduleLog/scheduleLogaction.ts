import {createAction} from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { ScheduleLogConstants } from "./scheduleLogconstants";


export const getScheduleLogListAct = createAction<INewActionType | undefined>(ScheduleLogConstants.GET_SCHEDULE_LOG_LIST);
