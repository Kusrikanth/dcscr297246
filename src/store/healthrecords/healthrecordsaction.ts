import {createAction} from "@reduxjs/toolkit";
import { INewActionType } from "../types";
import { HealthRecordsConstants } from "./healthrecordsconstants";

export { resetHealthRecordsListByIdAct } from "./healthrecordsslice"

// Health Records

export const getHealthRecordsListAct =createAction<INewActionType | undefined>(HealthRecordsConstants.GET_HEALTH_RECORDS_LIST);
export const getStuHealthDetailsAct = createAction<INewActionType | undefined>(HealthRecordsConstants.GET_STU_HEALTH_DETAILS);
export const getEmpHealthDetailsAct = createAction<INewActionType | undefined>(HealthRecordsConstants.GET_EMP_HEALTH_DETAILS);
export const getStuAlimentListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.GET_STU_ALIMENT_LIST);
export const saveHealthRecordsListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.SAVE_HEALTH_RECORD_LIST);
export const editHealthRecordsListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.EDIT_HEALTH_RECORD_LIST);
export const getHealthRecordsListByIdAct = createAction<INewActionType | undefined>(HealthRecordsConstants.GET_HEALTH_RECORDS_LIST_BY_ID);
export const exportHealthRecordsAct = createAction<INewActionType | undefined>(HealthRecordsConstants.EXPORT_HEALTH_RECORDS);
export const exportEmpHealthRecordsAct = createAction<INewActionType | undefined>(HealthRecordsConstants.EXPORT_EMP_HEALTH_RECORDS);

// MI Rooms

export const getMiRoomListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.GET_MI_ROOM_LIST);
export const getMiRoomListByIdAct = createAction<INewActionType | undefined>(HealthRecordsConstants.GET_MI_ROOM_LIST_BY_ID);
export const editMiRoomListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.EDIT_MI_ROOM_LIST);
export const saveMiRoomListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.SAVE_MI_ROOM_LIST);
export const deleteMiRoomListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.DELETE_MI_ROOM_LIST);

export const getStuHealthIssueListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.GET_STU_HEALTH_ISSUE_LIST);
export const exportStudentHealthIssuesAct = createAction<INewActionType | undefined>(HealthRecordsConstants.EXPORT_STUDENTS_HEALTH_ISSUES);
export const getRegistrationHealthIssueListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.GET_REGISTRATION_HEALTH_ISSUE_LIST);

//settings

//manage-aliments
export const getSubAlingmentsListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.GET_SUB_ALINGMENTS_LIST);
export const saveSubAlingmentsListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.SAVE_SUB_ALINGMENTS_LIST);
export const getSubAlingmentsListByIdAct = createAction<INewActionType | undefined>(HealthRecordsConstants.GET_SUB_ALINGMENTS_LIST_BY_ID);
export const editSubAlingmentsListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.EDIT_SUB_ALINGMENTS_LIST);
export const deleteSubAlingmentsListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.DELETE_SUB_ALINGMENTS_LIST);

// Medicens

export const getMedicenListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.GET_Medicen_LIST);
export const getMedicenListByIdAct = createAction<INewActionType | undefined>(HealthRecordsConstants.GET_Medicen_LIST_BY_ID);
export const editMedicenListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.EDIT_Medicen_LIST);
export const saveMedicenListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.SAVE_Medicen_LIST);
export const deleteMedicenListAct = createAction<INewActionType | undefined>(HealthRecordsConstants.DELETE_Medicen_LIST);
