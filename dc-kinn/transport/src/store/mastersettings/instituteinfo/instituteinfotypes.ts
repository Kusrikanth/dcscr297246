import { IResponseErrorModel } from "../../types";
import { IModelWithPagination } from "../../types";
export interface IInstinfoReducerState {
  instituteListResp: any;
  createInstituteResp: any;
  instDetailsResp: any | undefined;
  updateInstResp: any | undefined;
  deleteInstResp: any;
  uploadInstLogoResp: any;

  approvingInstResp: any;
  instDepartmentResp: any;
  addInstDepartmentResp: IInstDepartmentInfo | undefined;
  updateInstDepartmentResp: IUpdateInstDepartmentResp | undefined;
  deleteInstDepartmentResp: string | undefined;
  instMasterFieldsResp: any;
  instInfoError: IResponseErrorModel | undefined;

  formsAssignedToBranchResp: any;
  assignFormToBranchResp: any;
  updateFormToBranchResp: any;
  deleteFormAssignedToBranchResp: any;

  instRoleTypeListResp: any;
  addInstRoleTypeResp: any;
  updateInstRoleTypeResp: any;
  deleteInstRoleTypeResp: any;

  getInstRoleTypeV2Resp : any;
  addInstRoleTypeV2Resp : any;
  updateInstRoleTypeV2Resp : any;
  deleteInstRoleTypeV2Resp : any;

  getInstRoleV2Resp : any;
  addInstRoleV2Resp : any;
  updateInstRoleV2Resp : any;
  deleteInstRoleV2Resp : any;

  globalRecordData: any;
  // branchData: any;
  numberingSeriesListByBranchId: any;
  academicLanguages: any;
  updateAcademicLanguagesRep: any;
  addAcademicLanguagesRep: any;
  deleteAcademicLanguagesRep: any;
  instDocumentTypeResp: any;
  // academicYearData: any;

  // Inst_Subjects
  saveInstSubjectRep: any;
  editInstSubjectsRep: any;
  getInstSubjectsByIdResp: any;
}
//Models
export interface IInstituteDetails {
  id: string | undefined;
  instituteName: string | undefined;
  instituteCode: string | undefined;
  afflicationNo: string | null | undefined;
  trustName: string | null | undefined;
  institutionEmail: string | undefined;
  institutionPhoneNo: string | undefined;
  address: string | undefined;
  city: string | undefined;
  area: string | undefined;
  pinCode: number | undefined;
  contactPersonName: string | undefined;
  contactPersonPhoneNo: string | undefined;
  contactPersonEmail: string | undefined;
  licenceType: string | undefined;
  expiryDate: string | undefined;
  websiteUrl: string | undefined;
  active: boolean;
}

export interface IUpdateInstitute extends Omit<IInstituteDetails, "active"> {
  instituteGroupId: string | undefined;
}

//Institute Department Types

export interface IUpdateInstDepartmentResp {
  id: string;
  department: string;
  shortCode: string;
  branchId: string;
  branch: string;
  instituteId: string;
  institute: string;
  active: boolean;
}

export interface IUpdateDepartmentModel {
  name: string;
  code?: string;
}
export interface IAddDepartmentsModel {
  departments: Array<IUpdateDepartmentModel>;
}
export interface IInstDepartmentInfo {
  id: string;
  createdAt: string;
  createdBy: string | null;
  lastModifiedAt: string;
  deletedAt: string | null;
  modifiedBy: string | null;
  active: boolean;
  shortCode: string;
  name: string;
  status: string | null;
}
