// assign group table filter
export interface assignGroupFilterhProps {
    searchString: string;
    academicYearId: string;
    curriculumId:string;
    classId: string;
  }
  
  interface studentDetailsProps {
    name?: string;
    dep_id?: string;
    imgUrl?: string;
  }
  
  // assign student table data
  export interface IAssignStudentTableData {
    id: number;
    studentName: studentDetailsProps;
  }
  
  // show modal open type
  export interface IAssignGroupOpenModal {
    showModal: boolean;
    branchId: string;
  }
  
  // Modal types
  export interface IAssignGroupModalProps {
    isOpen: boolean;
    toggle: any;
    modalTitle: string;
    instituteId: string;
    instituteName: string;
    branchId: string;
    streamId: string;
    optionalDetails?: any;
  }
  
  // assign group modal data props
  export interface assignGroupDataProps {
    curriculum: string;
    class: string;
    searchString:string;
  }
  
  // assign group add student table data
  export interface IAssignGroupStudentsTableData {
    id: number;
    studentName: studentDetailsProps;
  }
  
  export interface IUpdateGroupRespRef{
    prevUpdateGroupStudentResp:any;
    prevRemoveStudentRep:any;
    prevAssignGroupErrorResp:any;
  }
  
  export interface ConfirmationModalProps {
    isOpen: boolean;
    toggle: any;
    modalTitle: string;
    instituteId: string;
    instituteName: string;
    branchId: string;
    editBranchDetails: string | undefined;
    submitHandler?:any;
    actionStatus:any;
    actionId:any;
    showApiLoader?:any;
  }