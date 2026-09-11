import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { TransportEmployeeConstants } from "./transportationemployeeconstants";

export { setTransportEmployeesAct } from "./transportationemployeeslice";
export const getTransportEmployeesAct = createAction<INewActionType | undefined>(TransportEmployeeConstants.GET_TRANSPORT_EMPLOYEE_REQUEST);
export const addTransportEmployeeAct = createAction<INewActionType | undefined>(TransportEmployeeConstants.ADD_TRANSPORT_EMPLOYEE_REQUEST);
export const transportEmployeeByidAct = createAction<INewActionType | undefined>(TransportEmployeeConstants.TRANSPORT_EMPLOYEE_BYID_REQUEST);
export const updateTransportEmployeeAct = createAction<INewActionType | undefined>(TransportEmployeeConstants.UPDATE_TRANSPORT_EMPLOYEE_REQUEST);
export const updateTransempActinactAct = createAction<INewActionType | undefined>(TransportEmployeeConstants.UPDATE_TRANSEMP_ACTINACT_REQUEST);
export const deleteTransportEmployeeAct = createAction<INewActionType | undefined>(TransportEmployeeConstants.DELETE_TRANSPORT_EMPLOYEE_REQUEST);
export const getEmployeeTypeListAct = createAction<INewActionType | undefined>(TransportEmployeeConstants.GET_EMPLOYEE_TYPE_LIST);
export const getAadharValidationAct = createAction<INewActionType | undefined>(TransportEmployeeConstants.GET_AADHAR_VALIDATION);
export const exportTransportEmployeeAct = createAction<INewActionType | undefined>(TransportEmployeeConstants.EXPORT_TRANSPORT_EMPLOYEE);