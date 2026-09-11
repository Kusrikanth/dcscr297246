// change curriculum table filter
export interface ChangeCurriculumFilterProps {
  searchString: string;
  academicYearId: string;
  curriculumId: string;
  branchClassId: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

// change curriculum table data type
export interface ChangeCurriculumTableData {
  id: number;
  studentName: studentDetailsProps;
  fromCurriculum: string;
  fromClass: string;
  toCurriculum: string;
  toClass: string;
  // eslint-disable-next-line no-restricted-globals
  approvalStatus: string;
}

// change curriculum modal
export interface ChangeCurriculumModalType {
  showModal: boolean;
  // branchId: string;
}
export interface ConfirmationModalType {
  showModal: boolean;
  requestId:any;
  // branchId: string;
}

// ChangeCurriculum Form
export interface ChangeCurriculumModalFormType {
  academicYearId: string;
  studentId: string;
  branchClassId: string;
  curriculumId: string;
  changeCuriculumId: string;
  changeClassId: string;
}

// ChangeCurriculum Modal types
export interface ChangeCurriculumModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
  directory?: any;
  editChangeCurriculumDetails?: any;
}
export interface ConfirmationModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  // branchId: string;
  requestId:string;
  editBranchDetails: string | undefined;
}
