import { academicSubjectListTypes } from "../../../pages/NewAcademics/ClassSubject/classSubjectTypes";

export interface IAssignGroupReducerState {
  academicSubjectsListResp: any;
  assignedClassSubjectsListResp: any;
  academicSubjectsListErrorResp: any;
  updateAcademicSubjectsListResp: any;
  updateAcademicSubjectsListErrorResp: any;
  deleteClassSubjectsListResp: any;

  studentAllocatedSubjectResp: any;
  assignSubjectToStudentResp: any;
  copyPreviousSubjectAllocationResp: any;
  copyToCurrentClassResp: any;
  copyToCurrentSectionResp: any;
  deleteStudentSubjectAllocationResp: any;

  getAssignTeacherListResp: any;
  saveSubjectTeacherResp: any;

  saveBranchClassLanguagesResp:any;
  deleteBranchClassLanguagesResp : any;

  classSubjectErrorResp: any;
}
