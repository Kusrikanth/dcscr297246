import { createAction } from "@reduxjs/toolkit";
import { InstInfoConstants } from "./instituteinfoconstants";
import { INewActionType } from "../../types";


export { setFormsAssignedToBranchAct, setInstRoleV2Act } from "./instituteinfoslice";

export const getInstituteListAct = createAction<INewActionType | undefined>(
  InstInfoConstants.GET_INSTITUTE_LIST_REQUEST
);

export const createInstituteAct = createAction<INewActionType | undefined>(
  InstInfoConstants.CREATE_INSTITUTE_REQUEST
);

export const getInstByIdAct = createAction<INewActionType | undefined>(
  InstInfoConstants.GET_INSTITUTE_BY_ID_REQUEST
);

export const updateInstByIdAct = createAction<INewActionType | undefined>(
  InstInfoConstants.UPDATE_INSTITUTE_BY_ID_REQUEST
);

export const deleteInstByIdAct = createAction<INewActionType | undefined>(
  InstInfoConstants.DELETE_INSTITUTE_BY_ID_REQUEST
);

export const uploadInstLogoAct = createAction<INewActionType | undefined>(
  InstInfoConstants.UPLOAD_INSTITUTE_LOGO_REQUEST
);

export const approvingInstAct = createAction<INewActionType | undefined>(
  InstInfoConstants.APPROVING_INSTITUTE_REQUEST
);

export const getInstDepartmentAct = createAction<INewActionType | undefined>(
  InstInfoConstants.GET_INST_DEPARTMENT_REQUEST
);
export const addInstDepartmentAct = createAction<INewActionType | undefined>(
  InstInfoConstants.ADD_INST_DEPARTMENT_REQUEST
);
export const updateInstDepartmentAct = createAction<INewActionType | undefined>(
  InstInfoConstants.UPDATE_INST_DEPARTMENT_REQUEST
);
export const deleteInstDepartmentAct = createAction<INewActionType | undefined>(
  InstInfoConstants.DELETE_INST_DEPARTMENT_REQUEST
);

export const getInstMasterFieldsAct = createAction<INewActionType | undefined>(
  InstInfoConstants.GET_INST_MASTER_FIELDS_REQUEST
);
export const getFormAssignedToBranchAct = createAction<
  INewActionType | undefined
>(InstInfoConstants.GET_FORM_ASSIGNED_TO_BRANCH_REQUEST);
export const assignFormToBranchAct = createAction<INewActionType | undefined>(
  InstInfoConstants.ASSIGN_FORM_TO_BRANCH_REQUEST
);
export const updateFormToBranchAct = createAction<INewActionType | undefined>(
  InstInfoConstants.UPDATE_FORM_TO_BRANCH_REQUEST
);
export const deleteFormAssignedToBranchAct = createAction<
  INewActionType | undefined
>(InstInfoConstants.DELETE_FORM_ASSIGNED_TO_BRANCH_REQUEST);

export const getInstRoleTypeAct = createAction<INewActionType | undefined>(
  InstInfoConstants.GET_INST_ROLE_TYPE_REQUEST
);
export const addInstRoleTypeAct = createAction<INewActionType | undefined>(
  InstInfoConstants.ADD_INST_ROLE_TYPE_REQUEST
);
export const updateInstRoleTypeAct = createAction<INewActionType | undefined>(InstInfoConstants.UPDATE_INST_ROLE_TYPE_REQUEST);
export const deleteInstRoleTypeAct = createAction<INewActionType | undefined>(InstInfoConstants.DELETE_INST_ROLE_TYPE_REQUEST
);

export const getInstRoleTypeV2Act = createAction<INewActionType | undefined>(
  InstInfoConstants.GET_INST_ROLE_TYPE_V2
);
export const addInstRoleTypeV2Act = createAction<INewActionType | undefined>(
  InstInfoConstants.ADD_INST_ROLE_TYPE_V2
);
export const updateInstRoleTypeV2Act = createAction<INewActionType | undefined>(
  InstInfoConstants.UPDATE_INST_ROLE_TYPE_V2
);
export const deleteInstRoleTypeV2Act = createAction<INewActionType | undefined>(
  InstInfoConstants.DELETE_INST_ROLE_TYPE_V2
);

export const getInstRoleV2Act = createAction<INewActionType | undefined>(
  InstInfoConstants.GET_INST_ROLE_V2
);
export const addInstRoleV2Act = createAction<INewActionType | undefined>(
  InstInfoConstants.ADD_INST_ROLE_V2
);
export const updateInstRoleV2Act = createAction<INewActionType | undefined>(
  InstInfoConstants.UPDATE_INST_ROLE_V2
);
export const deleteInstRoleV2Act = createAction<INewActionType | undefined>(
  InstInfoConstants.DELETE_INST_ROLE_V2
);

export const getGlobalRecordsAct = createAction<INewActionType | undefined>(
  InstInfoConstants.GET_GLOBAL_RECORD_DATA
);
// export const getGlobalRecordsBySearchStringAct = createAction<
//   INewActionType | undefined
// >(InstInfoConstants.GET_GLOBAL_RECORD_DATA_BY_SEARCH_STRING);
export const getNumberingSeriesListByBranchIdAct = createAction<
  INewActionType | undefined
>(InstInfoConstants.GET_NUMBERING_SERIES_LIST_BY_BRANCHID);
// export const getBranchDataAct = createAction<INewActionType | undefined>(
//   InstInfoConstants.GET_BRANCH_DATA
// );
export const getAcademicLanguagesDataAct = createAction<
  INewActionType | undefined
>(InstInfoConstants.GET_ACADEMIC_LANGUAGE_DATA);
export const addAcademicLanguagesAct = createAction<INewActionType | undefined>(
  InstInfoConstants.ADD_ACADEMIC_LANGUAGE
);
export const updateAcademicLanguagesAct = createAction<
  INewActionType | undefined
>(InstInfoConstants.UPDATE_ACADEMIC_LANGUAGE);
export const removeAcademicLanguageAct = createAction<
  INewActionType | undefined
>(InstInfoConstants.REMOVE_ACADEMIC_LANGUAGE);

export const getInstDocumentTypeAct = createAction<
  INewActionType | undefined
>(InstInfoConstants.GET_INSTITUTE_DOCUMENT_TYPE_REQUEST);
// export const getAcademicYearAct = createAction<INewActionType | undefined>(
//   InstInfoConstants.GET_ACADEMIC_YEAR_DATA
// );
//inst-subjects
export const addInstSubjectsAct = createAction<INewActionType | undefined>(InstInfoConstants.ADD_INST_SUBJECTS);
export const updateInstSubjectsAct = createAction<INewActionType | undefined>(InstInfoConstants.UPDATE_INST_SUBJECTS);
export const getInstSubjectsByIdAct = createAction<INewActionType | undefined>(InstInfoConstants.GET_INST_SUBJECTS_BY_ID);