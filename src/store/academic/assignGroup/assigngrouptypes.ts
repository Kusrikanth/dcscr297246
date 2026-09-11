import { IAssignStudentTableData } from "../../../pages/NewAcademics/AssignGroup/assignGroupTypes";

export interface IAssignGroupReducerState {
  groupStudentListResp: any;
  groupStudentListErrorResp: any;
  academicDetailsResp: any;
  academicDetailsErrorResp: any;
  classDetailsResp: any;
  classDetailsErrorResp: any;
  streamListResp: any;
  streamByIdResp: any;
  streamListErrorResp: any;
  unassignedGroupStudentListResp: Array<IAssignStudentTableData>;
  unassignedGroupStudentListErrorResp: any;
  academicSubjectsListResp: any;
  academicSubjectsListErrorResp: any;
  updateClassroomStudentsResp: any;
  updateClassroomStudentsErrorResp: any;
  removeClassroomStudentsResp: any;
  removeClassroomStudentsErrorResp: any;
  assignGroupErrorResp:any;
}
