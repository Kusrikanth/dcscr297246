
import { createAction } from "@reduxjs/toolkit";
import { InterviewConstants } from "./interviewconstants";
import { INewActionType } from "../../types";

export { setRegistrationPaymentDetailsAct, resetObservationAndInterviewerReportListWhileSavingAct, resetEvaluationClassList, resetPanelInterviewResultListWhileSavingAct, resetObservationInterviewSubjectsAct, resetEditPanIntResAct, resetObservationAndInterviewReportByIdAct } from './interviewslice'
export const getInterviewSchedulesListAct = createAction<INewActionType | undefined>(InterviewConstants.GET_INTERVIEW_SCHEDULES_LIST_REQUEST);
export const getStudentsForInterviewScheduleAct = createAction<INewActionType | undefined>(InterviewConstants.STUDENTS_FOR_INTERVIEW_SCHEDULE_REQUEST);
export const getEvaluationClassList = createAction<INewActionType | undefined>(InterviewConstants.EVALUATION_CLASS_LIST);
export const scheduleInterviewAct = createAction<INewActionType | undefined>(InterviewConstants.SCHEDULE_INTERVIEW_REQUEST);
export const getInterviewDetailsAct = createAction<INewActionType | undefined>(InterviewConstants.GET_INTERVIEW_DETAILS_REQUEST);
export const updateInterviewScheduleAct = createAction<INewActionType | undefined>(InterviewConstants.UPDATE_INTERVIEW_SCHEDULE_REQUEST);

export const delInterviewAct = createAction<INewActionType | undefined>(InterviewConstants.DELETE_INTERVIEW_REQUEST);
export const getObservationAndInterviewerReportAct = createAction<INewActionType | undefined>(InterviewConstants.OBSERVATION_AND_INTERVIEWER_REPORT);
export const getObsAndIntRepListWhiSaveAct = createAction<INewActionType | undefined>(InterviewConstants.OBSERVATION_AND_INTERVIEWER_REPORT_WHILE_SAVING);
export const saveObservationReportAct = createAction<INewActionType | undefined>(InterviewConstants.SAVE_OBSERVATION_REPORT);
export const getObservationAndInterviewerReportByIdAct = createAction<INewActionType | undefined>(InterviewConstants.OBSERVATION_AND_INTERVIEWER_REPORT_BY_ID);
export const getPanelInterviewResultListAct = createAction<INewActionType | undefined>(InterviewConstants.GET_PANEL_INTERVIEW_RESULT_LIST);
export const savePanelIntResult = createAction<INewActionType | undefined>(InterviewConstants.SAVE_PANEL_INTERVIEW_RESULT);
export const getPanIntResListWhiSaveAct = createAction<INewActionType | undefined>(InterviewConstants.PANEL_INTERVIEW_RESULT_LIST_WHILE_SAVING);
export const getObsIntSubAct = createAction<INewActionType | undefined>(InterviewConstants.GET_OBSERVATION_INTERVIEW_SUBJECTS);
export const panIntResCancelAdmissionAct = createAction<INewActionType | undefined>(InterviewConstants.PAN_INT_RES_CANCEL_ADMISSION);
export const editObsAndIntReportAct = createAction<INewActionType | undefined>(InterviewConstants.EDIT_OBS_AND_INT_REPORT);
export const getPanIntResByIdAct = createAction<INewActionType | undefined>(InterviewConstants.GET_PAN_INT_RES_BY_ID);
export const editPanIntResListAct = createAction<INewActionType | undefined>(InterviewConstants.EDIT_PAN_INT_RES);
export const sendNotifiPanIntResAct = createAction<INewActionType | undefined>(InterviewConstants.SEND_NOTIFI_PAN_INT_RES);
export const exportPanIntListAct = createAction<INewActionType | undefined>(InterviewConstants.EXPORT_PAN_INT_LIST);
export const exportObsIntListAct = createAction<INewActionType | undefined>(InterviewConstants.EXPORT_OBS_INT_LIST);
export const exportPanIntResListAct = createAction<INewActionType | undefined>(InterviewConstants.EXPORT_PAN_INT_RES_LIST);

export const registrationPaymentDetailsAct = createAction<INewActionType | undefined>(InterviewConstants.REGISTRATION_PAYMENT_DETAILS);
