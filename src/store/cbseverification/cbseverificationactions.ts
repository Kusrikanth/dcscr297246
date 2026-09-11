import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../types";
import { CbseVerificationsConstants } from "./cbseverificationconstants";

export { setCbseVerificationsAct } from "./cbseverificationslice";
export const getCbseVerificationsAct = createAction<INewActionType | undefined>(CbseVerificationsConstants.GET_CBSE_VERIFICATIONS_REQUEST);
export const addCbseVerificationAct = createAction<INewActionType | undefined>(CbseVerificationsConstants.ADD_CBSE_VERIFICATIONS_REQUEST);
export const getStudentSubjectsAct = createAction<INewActionType | undefined>(CbseVerificationsConstants.GET_STUDENT_SUBJECTS_REQUEST);

