import { createAction } from "@reduxjs/toolkit";
import { NotReportingStudentsConstants } from "./notreportingstudentsconstants";
import { INewActionType } from "../../types";
export { resetDownloadStudentIdCardZipAct } from "./notreportingstudentsslice"

export const getNotReportingStuListAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.GET_NOT_REPORTING_STU_LIST);
export const addNotReportingStuAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.ADD_NOT_REPORTING_STU);
export const editNotReportingStuAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.EDIT_NOT_REPORTING_STU);
export const deleteNotReportingStuAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.DELETE_NOT_REPORTING_STU);
export const getByIdNotReportingStuAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.GET_BY_ID_NOT_REPORTING_STU);
export const exportNotReportingListAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.EXPORT_NOT_REPORTING_STU);

//Id-Card
export const getIdCardListAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.GET_ID_CARD_LIST);
export const approveStuLIdCardAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.APPROVE_STU_ID_CARD);
export const payStuLIdCardAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.PAY_STU_ID_CARD);
export const idCardAmountAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.ID_CARD_AMOUNT);
export const sendIdCardNotifcationAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.SEND_ID_CARD_NOTIFCATION);
export const idCardCollectedByParentAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.ID_CARD_COLLECTED_BY_PARENT);
export const getIdCardLogsRes = createAction<INewActionType | undefined>(NotReportingStudentsConstants.GET_ID_CARD_LOGS);
export const previewIssuedIdCardAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.PREVIEW_ISSUED_ID_CARD);
export const getStuDetailsAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.GET_STU_DETAILS);
export const exportStudentIdCardListAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.EXPORT_STUDENT_ID_CARD_LIST);
export const downloadStudentIdCardZipAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.DOWNLOAD_STUDENT_ID_CARD_ZIP);
export const requestReuploadIdCardAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.REQUEST_REUPLOAD_ID_CARD);
export const saveVlidateStudentStatusAct = createAction<INewActionType | undefined>(NotReportingStudentsConstants.SAVE_VALIDATE_STUDENT_STATUS);


