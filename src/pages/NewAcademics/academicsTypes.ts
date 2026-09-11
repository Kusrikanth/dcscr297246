export interface IAcademicsModal {
  showModal: boolean;
}

// Modal types
export interface IAssignClassroomProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  academicYearId?:any;
  sectionDetails?: any;
  instituteName: string;
  branchId: number;
  editBranchDetails: string | undefined;
  academicDetails?: any;
}

// academics table filter
export interface academicsFilterhProps {
  searchString: string;
  branchClassId: string;
  masterAcademicYearId: string;
  curriculumId: string;
  sectionId: string;
  pageNo:number;
  pageSize:number;
}

// add students table data
interface studentDetailsProps {
  name?: string;
  dep_id?: string;
  imgUrl?: string;
}

// academic table data
export interface IAcademicTableData {
  id: number;
  sectionName: string;
  roomNo: string;
  classTeacher: studentDetailsProps | string;
  noStudents: number;
}

export interface IAddStudentsTableData {
  id: number;
  studentName: studentDetailsProps;
}
export interface ITeacherDataListType extends studentDetailsProps {
  type: string;
}

// search input type
export interface searchInputProps {
  search: string;
}

// assign clssroom moddal data props
export interface assignClassroomDataProps {
  classSection: string | undefined;
  roomNo: string;
}

// Tabbar menu types
export interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding?: string;
  className?: string;
  count?:any
}

export interface ISectionDetails {
  sectionDetails:any,
  apiCall?:any,
  notoggle?:any;
}

export interface IUpdateSectionTeacherRepRef{
  prevUpdateSectionTeacherResp:any;
}
export interface IUpdateClassroomRepRef{
  prevUpdateClassroomErrResp:any;
}
export interface IUpdateAssignRoomRepRef{
  prevAssignRoomResp:any;
}

export interface sortRef{
  id:string;
  desc:boolean;
}

export interface ISectionStudentListRepRef{
  prevRemoveStudentResp:any,
  prevRemoveStudentErrorResp:any
}
export interface ConfirmationModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
  confirmationMessage:any;
  submitHandler?:any;
  submitTxt?:any;
}
export interface IRemoveAssignedTeacherModal {
  showModal: boolean;
  branchId: string;
}