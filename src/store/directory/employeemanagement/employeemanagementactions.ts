import { createAction } from "@reduxjs/toolkit";
import { EmployeeManagementConstants } from "./employeemanagementconstants";
import { INewActionType } from "../../types";

export {
  setGetEmployeeByIdAct,
  setAllCompaniesListAct,
  setEmployeesByFilterAct,
  resetEmployeesByFilterAct,
} from "./employeemanagementslice";

export const getEmployeesStatsAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.GET_EMPLOYEES_STATS_REQUEST
);

export const getEmployeesListAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.GET_EMPLOYEES_LIST_REQUEST
);

export const getOtherEmployeesListAct = createAction<INewActionType | undefined>(EmployeeManagementConstants.GET_OTHER_EMPLOYEES_LIST_REQUEST);

export const addEmployeeAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.ADD_EMPLOYEE_REQUEST
);

export const getEmployeeByIdAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.GET_EMPLOYEE_BYID_REQUEST
);

export const downloadDocumentByIdAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.DOWNLOAD_DOCUMENT_BYID_REQUEST
);

export const updateEmployeeAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.UPDATE_EMPLOYEE_REQUEST
);

export const deleteEmployeeAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.DELETE_EMPLOYEE_REQUEST
);

export const uploadEmployeeDocumentAct = createAction<
  INewActionType | undefined
>(EmployeeManagementConstants.UPLOAD_EMPLOYEE_DOCUMENT_REQUEST);

export const getAllCompaniesListAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.GET_ALL_COMPANIES_LIST_REQUEST
);

export const getEmployeeByFilterAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.GET_EMPLOYEES_BYFILTER_REQUEST
);
export const getEmployeeNameByFilterAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.GET_EMPLOYEES_NAME_BYFILTER_REQUEST
);
export const getEmployeeDocumentListAct = createAction<
  INewActionType | undefined
>(EmployeeManagementConstants.GET_EMPLOYEE_DOCUMENT_TYPE_REQUEST);

export const getReporterListAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.GET_REPORTER_LIST_REQUEST
);
export const getReportingClassDivisionListAct = createAction<
  INewActionType | undefined
>(EmployeeManagementConstants.GET_REPORTING_CLASS_DIVISION_LIST_REQUEST);
export const getHODListAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.GET_HOD_LIST_REQUEST
);
export const exportEmployeeDataAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.EXPORT_EMPLOYEE_DATA_REQUEST
);
export const exportOtherEmployeeDataAct = createAction<INewActionType | undefined>(
  EmployeeManagementConstants.EXPORT_OTHER_EMPLOYEE_DATA_REQUEST
);

export const getCompanyDetailsListByIdAct = createAction<
  INewActionType | undefined
>(EmployeeManagementConstants.GET_COMPANY_DETAILS_LIST_BY_ID);
export const editCompanyDetailsListAct = createAction<
  INewActionType | undefined
>(EmployeeManagementConstants.EDIT_COMPANY_DETAILS_LIST);
export const saveCompanyDetailsListAct = createAction<
  INewActionType | undefined
>(EmployeeManagementConstants.SAVE_COMPANY_DETAILS_LIST);
export const deleteCompanyDetailsListAct = createAction<
  INewActionType | undefined
>(EmployeeManagementConstants.DELETE_COMPANY_DETAILS_LIST);
