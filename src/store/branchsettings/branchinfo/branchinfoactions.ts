import { createAction } from "@reduxjs/toolkit";
import { BranchInfoConstants } from "./branchinfoconstants";
import { INewActionType } from "../../types";

export const getBranchBankDetailsAct = createAction<INewActionType | undefined>(BranchInfoConstants.GET_BRANCH_BANK_DETAILS_REQUEST);
export const addBranchBankDetailAct = createAction<INewActionType | undefined>(BranchInfoConstants.ADD_BRANCH_BANK_DETAIL_REQUEST);
export const updateBranchBankDetailAct = createAction<INewActionType | undefined>(BranchInfoConstants.UPDATE_BRANCH_BANK_DETAIL_REQUEST);
export const deleteBranchBankDetailAct = createAction<INewActionType | undefined>(BranchInfoConstants.DELETE_BRANCH_BANK_DETAIL_REQUEST);


export const getBranchAreasAct = createAction<INewActionType | undefined>(BranchInfoConstants.GET_BRANCH_AREAS_REQUEST);
export const addBranchAreaAct = createAction<INewActionType | undefined>(BranchInfoConstants.ADD_BRANCH_AREA_REQUEST);
export const updateBranchAreaAct = createAction<INewActionType | undefined>(BranchInfoConstants.UPDATE_BRANCH_AREA_REQUEST);
export const deleteBranchAreaAct = createAction<INewActionType | undefined>(BranchInfoConstants.DELETE_BRANCH_AREA_REQUEST);


export const getBranchContactPersonsAct = createAction<INewActionType | undefined>(BranchInfoConstants.GET_BRANCH_CONTACT_PERSONS_REQUEST);
export const addBranchContactPersonAct = createAction<INewActionType | undefined>(BranchInfoConstants.ADD_BRANCH_CONTACT_PERSON_REQUEST);
export const updateBranchContactPersonAct = createAction<INewActionType | undefined>(BranchInfoConstants.UPDATE_BRANCH_CONTACT_PERSON_REQUEST);
export const deleteBranchContactPersonAct = createAction<INewActionType | undefined>(BranchInfoConstants.DELETE_BRANCH_CONTACT_PERSON_REQUEST);

export const getBrchDepartmentsAct = createAction<INewActionType | undefined>(BranchInfoConstants.GET_BRANCH_DEPARTMENTS_REQUEST);
export const addBrchDepartmentAct = createAction<INewActionType | undefined>(BranchInfoConstants.ADD_BRANCH_DEPARTMENT_REQUEST);
export const updateBrchDepartmentAct = createAction<INewActionType | undefined>(BranchInfoConstants.UPDATE_BRANCH_DEPARTMENT_REQUEST);
export const deleteBrchDepartmentAct = createAction<INewActionType | undefined>(BranchInfoConstants.DELETE_BRANCH_DEPARTMENT_REQUEST);

//Logo's
export const getBrchLogosAct = createAction<INewActionType | undefined>(BranchInfoConstants.GET_BRANCH_LOGOS_REQUEST);
export const addBrchLogoAct = createAction<INewActionType | undefined>(BranchInfoConstants.ADD_BRANCH_LOGO_REQUEST);
export const deleteBrchLogoAct = createAction<INewActionType | undefined>(BranchInfoConstants.DELETE_BRANCH_LOGO_REQUEST);