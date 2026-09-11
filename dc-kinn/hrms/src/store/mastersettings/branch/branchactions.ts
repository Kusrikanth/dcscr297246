import { createAction } from "@reduxjs/toolkit";
import { BranchConstants } from "./branchconstants";
import { INewActionType } from "../../types";

export { setInstHeaderBranchesAct } from './branchslice';
export const getInstBranchesAct = createAction<INewActionType | undefined>(BranchConstants.GET_INSTITUTE_BRANCHES_REQUEST);
export const getInstHeaderBranchesAct = createAction<INewActionType | undefined>(BranchConstants.GET_INSTITUTE_HEADER_BRANCHES_REQUEST);

export const getInstBranchesWithAdminAct = createAction<INewActionType | undefined>(BranchConstants.GET_INST_BRANCHES_WITH_ADMIN_REQUEST);

export const addInstBranchAct = createAction<INewActionType | undefined>(BranchConstants.ADD_INSTITUTE_BRANCH_REQUEST);

export const updateBranchAct = createAction<INewActionType | undefined>(BranchConstants.UPDATE_BRANCH_REQUEST);

export const getBranchByIdAct = createAction<INewActionType | undefined>(BranchConstants.GET_BRANCH_BYID_REQUEST);

export const approveBranchAct = createAction<INewActionType | undefined>(BranchConstants.APPROVE_BRANCH_REQUEST);

export const deleteBranchAct = createAction<INewActionType | undefined>(BranchConstants.DELETE_BRANCH_REQUEST);

export const updateMainBranchAct = createAction<INewActionType | undefined>(BranchConstants.UPDATE_MAIN_BRANCH_REQUEST);


export const getBranchModuleAct = createAction<INewActionType | undefined>(BranchConstants.GET_BRANCH_MODULE_REQUEST);
export const updateBranchModuleAct = createAction<INewActionType | undefined>(BranchConstants.UPDATE_BRANCH_MODULE_REQUEST);


export const addBranchAdminAct = createAction<INewActionType | undefined>(BranchConstants.ADD_BRANCH_ADMIN_REQUEST);
export const updateBranchAdminAct = createAction<INewActionType | undefined>(BranchConstants.UPDATE_BRANCH_ADMIN_REQUEST);

