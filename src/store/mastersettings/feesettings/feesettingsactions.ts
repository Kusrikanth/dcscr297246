import { createAction } from "@reduxjs/toolkit";
import { FeeSettingsConstants } from "./feesettingsconstants";
import { INewActionType } from "../../types";

export const getInstFeeDepartmentsAct = createAction<INewActionType | undefined>(FeeSettingsConstants.GET_INST_FEE_DEPARTMENTS_REQUEST);

export const addInstFeeDepartmentsAct = createAction<INewActionType | undefined>(FeeSettingsConstants.ADD_INST_FEE_DEPARTMENTS_REQUEST);

export const updateInstFeeDepartmentAct = createAction<INewActionType | undefined>(FeeSettingsConstants.UPDATE_INST_FEE_DEPARTMENT_REQUEST);

export const deleteInstFeeDepartmentAct = createAction<INewActionType | undefined>(FeeSettingsConstants.DELETE_INST_FEE_DEPARTMENT_REQUEST);

export const getInstFeeNamesAct = createAction<INewActionType | undefined>(FeeSettingsConstants.GET_INST_FEE_NAMES_REQUEST);

export const getInstEmployeeConcessionDepartmentAct = createAction<INewActionType | undefined>(FeeSettingsConstants.GET_INST_EMPLOYEE_CONSESSION_DEPATMENT_REQUEST);

export const getInstEmployeeConcessionAct = createAction<INewActionType | undefined>(FeeSettingsConstants.GET_INST_EMPLOYEE_CONSESSION_REQUEST);

export const addInstEmployeeConcessionAct = createAction<INewActionType | undefined>(FeeSettingsConstants.ADD_INST_EMPLOYEE_CONCESSION_REQUEST);

export const updateInstEmployeeConcessionAct = createAction<INewActionType | undefined>(FeeSettingsConstants.UPDATE_INST_EMPLOYEE_CONCESSION_REQUEST);

export const deleteInstEmployeeConcessionAct = createAction<INewActionType | undefined>(FeeSettingsConstants.DELETE_INST_EMPLOYEE_CONCESSION_REQUEST);

export const getInstConcessionDepartmentsAct = createAction<INewActionType | undefined>(FeeSettingsConstants.GET_INST_CONCESSION_DEPARTMENTS_REQUEST);
export const getInstFeeNameByDeptAct = createAction<INewActionType | undefined>(FeeSettingsConstants.GET_INST_FEE_NAME_BY_DEPT_REQUEST);

export const addInstFeeNameAct = createAction<INewActionType | undefined>(FeeSettingsConstants.ADD_INST_FEE_NAME_REQUEST);

export const updateInstFeeNameAct = createAction<INewActionType | undefined>(FeeSettingsConstants.UPDATE_INST_FEE_NAME_REQUEST);

export const deleteInstFeeNameAct = createAction<INewActionType | undefined>(FeeSettingsConstants.DELETE_INST_FEE_NAME_REQUEST);

export const getPaymentGatewaysListAct = createAction<INewActionType | undefined>(FeeSettingsConstants.GET_PAYMENT_GATEWAYS_LIST_RESP);
export const getPaymentGatewaysBranchListAct = createAction<INewActionType | undefined>(FeeSettingsConstants.GET_PAYMENT_GATEWAYS_BRANCHLIST_RESP);
export const savePaymentGatewaysBranchAct = createAction<INewActionType | undefined>(FeeSettingsConstants.SAVE_PAYMENT_GATEWAYS_BRANCH_ITEM);
