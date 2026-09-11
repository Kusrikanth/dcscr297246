import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { AdmissionSettingConstants } from "./admissionsettingconstant";

export { setGetAdmissionWithdrawalAct ,
    setGetAdmissionWithdrawalApprovedAct,

} from "./admissionsettingslice";
export const admissionAvailabilityListAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.ADMISSION_AVAILABILITY_LIST_REQUEST);
export const proposedAdmissionListAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.PROPOSED_ADMISSION_LIST_REQUEST);
export const addProposedAdmissionAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.ADD_PROPOSED_ADMISSION);
export const editProposedAdmissionAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.EDIT_PROPOSED_ADMISSION);


export const getAdmissionWithdrawalAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.GET_ADMISSION_WITHDRAWAL_REQUEST);
export const getAdmissionWithdrawalByidAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.GET_ADMISSION_WITHDRAWAL_BYID_REQUEST);
export const createAdmissionWithdrawalAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.CREATE_ADMISSION_WITHDRAWAL_REQUEST);
export const searchStudentAdmissionWithdrawalAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.SEARCH_STUDENT_ADMISSION_WITHDRAWAL_REQUEST);
export const updateAdmissionWithdrawalAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.UPDATE_ADMISSION_WITHDRAWAL_REQUEST);
export const deleteAdmissionWithdrawalAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.DELETE_ADMISSION_WITHDRAWAL_REQUEST);
export const createFeeAdmissionWithdrawalAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.CREATE_FEE_ADMISSION_WITHDRAWAL_REQUEST);
export const getAdmissionWithdrawalApprovedAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.GET_ADMISSION_WITHDRAWAL_APPROVED_REQUEST);
export const getBranchClassLanguageAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.GET_BRANCH_CLASS_LANGUAGE);
export const saveBranchClassLanguageAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.SAVE_BRANCH_CLASS_LANGUAGE);
export const updateBranchClassLanguageAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.UPDATE_BRANCH_CLASS_LANGUAGE);
export const deleteBranchClassLanguageAct = createAction<INewActionType | undefined>(AdmissionSettingConstants.DELETE_BRANCH_CLASS_LANGUAGE);
