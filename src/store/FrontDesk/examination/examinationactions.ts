
import { createAction } from "@reduxjs/toolkit";
import { ExaminationConstants } from "./examinationconstants";
import { INewActionType } from "../../types";

export {resetStudentsForExaminationScheduleAct} from './examinationslice'

export const getExaminationSchedulesListAct = createAction<INewActionType | undefined>(ExaminationConstants.GET_EXAMINATION_SCHEDULES_LIST_REQUEST);
export const getStudentsForExaminationScheduleAct = createAction<INewActionType | undefined>(ExaminationConstants.STUDENTS_FOR_EXAMINATION_SCHEDULE_REQUEST);
export const scheduleExaminationAct = createAction<INewActionType | undefined>(ExaminationConstants.SCHEDULE_EXAMINATION_REQUEST);
export const getExaminationDetailsAct = createAction<INewActionType | undefined>(ExaminationConstants.GET_EXAMINATION_DETAILS_REQUEST);
export const updateExaminationScheduleAct = createAction<INewActionType | undefined>(ExaminationConstants.UPDATE_EXAMINATION_SCHEDULE_REQUEST);
export const exportExaminationDataAct = createAction<INewActionType | undefined>(ExaminationConstants.EXPORT_EXAMINATION_DATA);

export const delExaminationAct = createAction<INewActionType | undefined>(ExaminationConstants.DELETE_EXAMINATION_REQUEST);
