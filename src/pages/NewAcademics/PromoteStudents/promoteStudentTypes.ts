// student promote table filter
export interface PromoteStudentFilterhProps {
  studentName: string;
  academicYearId: string;
  curriculumId: string;
  classId: string;
  promotedBy:string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

// promote students table data type
export interface PromoteStudentsTableData {
  id: number;
  sNo:number;
  academicYear:string;
  curriculum:string;
  promotedBy:string;
  class:string;
  students: studentDetailsProps,
}

// promote student modal
export interface PromoteStudentModalType {
  showModal: boolean;
  branchId: string;
}

// Modal types
export interface PromoteStudentModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
  currentAcademicYearId: string;
}

export interface PromoteStudentsDataTypes {
  academicYearId: string;
  fromCurriculumId: string;
  fromClassId: string;
  newCurriculumId: string;
  promotedBy: string;
  nextClassId:string;
  nextClassName:string;
  studentId?: string;
  studentName?: string;
  studentClass?: string;
  students?:any
}
export interface IShowPromotedStudent {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  sectionDetails?: any;
  instituteName: string;
  branchId: number;
  editBranchDetails: string | undefined;
  academicDetails?: any;
  students?:any;
}
export interface searchInputProps {
  search: string;
}