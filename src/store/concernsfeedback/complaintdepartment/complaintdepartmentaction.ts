import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { ComplaintDepartmentConstants } from "./complaintdepartmentconstants";


export const getComplaintDepartmentListAct = createAction<INewActionType | undefined>(ComplaintDepartmentConstants.GET_COMPLAINT_DEPARTMENT_LIST);
export const getMasterComplaintDeptListAct = createAction<INewActionType | undefined>(ComplaintDepartmentConstants.GET_MASTER_DEPT_LIST);
export const editComplaintDeptAct = createAction<INewActionType | undefined>(ComplaintDepartmentConstants.EDIT_COMPLAINT_DEPT_LIST);
export const addComplaintDeptAct = createAction<INewActionType | undefined>(ComplaintDepartmentConstants.ADD_COMPLAINT_DEPT_LIST);
export const deleteComplaintDeptAct = createAction<INewActionType | undefined>(ComplaintDepartmentConstants.DELETE_COMPLAINT_DEPT_LIST)
export const saveMasterComplaintDeptAct = createAction<INewActionType | undefined>(ComplaintDepartmentConstants.SAVE_MASTER_DEPT_LIST)