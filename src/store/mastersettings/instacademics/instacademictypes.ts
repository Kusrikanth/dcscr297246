import { IModelWithPagination } from "../../types";

export interface IInstAcademicReducerState {
  academicYearListResp: IModelWithPagination<IAcademicYearInfo> | undefined;
  academicYearsDateListResp: any;
  addAcademicYearResp: any;
  updateAcademicYearResp: any;
  deleteAcademicYearResp: any;
  academicTermListResp: any;
  addAcademicTermResp: any;
  updateAcademicTermResp: any;
  deleteAcademicTermResp: any;

  termListResp:any;
  addTermResp:any;
  deleteTermResp:any;
  updateTermResp:any;

  instCurriculumResp: any;
  addCurriculumResp: any;
  updateCurriculumResp: any;
  deleteCurriculumResp: any;

  instClassResp: any;
  instClassForBranchResp: any;
  instSecondClassResp: any;
  addClassResp: any;
  updateClassResp: any;
  deleteClassResp: any;

  curriculumClassResp: any;
  addCurriculumClassResp: any;
  updateCurriculumClassResp: any;
  deleteCurriculumClassResp: any;

  modulesListResp:any;
  updateModuleResp:any;

  instAcademicErrorResp: any;
}

interface IMasterAcademicYearInfo {
  id: string;
  createdAt: string;
  createdBy: string | null;
  lastModifiedAt: string | null;
  deletedAt: string | null;
  modifiedBy: string | null;
  active: boolean;
  name: string;
  startYear: string;
  yearStatus: string;
  academicYearId:string;
  endYear: string;
}
export interface IAcademicYearInfo {
  id: string;
  createdAt: string;
  createdBy: string | null;
  lastModifiedAt: string | null;
  deletedAt: string | null;
  modifiedBy: string | null;
  active: boolean;
  academicYearName?:string;
  academicYearId: string;
  instituteAcademicYearId:number;
  yearId: string;
  startDate: string;
  endDate: string;
  startYear: string;
  endYear: string;
  isChallanDisplay: string;
  instituteId: string;
  status: string;
}

export interface IAddAcademicYearModel {
  academicYearId: string;
  startDate: string;
  endDate: string;
  startYear: string;
  endYear: string;
  isChallanDisplay: string;
}
