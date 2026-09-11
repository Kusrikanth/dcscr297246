// higher class eligibility table filter
export interface HigherClassEligibilityFilterhProps {
  searchString: string;
  academicYearId: string;
  curriculumId: string;
  classId: string;
  promotionStatus: string;
  // branchId:number,
  // instituteId:number,
  pageNo:number,
  pageSize:number,
  // sortBy:string,
  // orderBy:string
}

interface studentDetailsProps {
  studentName?: string;
  studentCode?: string;
  studentPic?: string;
}

// higher class eligibility table data type
export interface HigherClassEligibilityTableData {
  id: number;
  studentName: studentDetailsProps;
  className: string;
  sectionName: string;
  rollNo: number;
  contactNo: number;
  emailId: string;
  // eslint-disable-next-line no-restricted-globals
}

// higher class modal
export interface HigherClassModalType {
  showModal: boolean;
  // branchId: string;
}

// Modal types
export interface HigherClassModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: number;
  instituteName: string;
  branchId: number;
  editBranchDetails: string | undefined;
  currentAcademicYearId?: string;
  filterState: any;
}

// Higher class modal filter types
export interface HigherClassModalFilterhProps {
  academicYearId: string;
  curriculumId: string;
  classId: string;
  sectionId: string;
  isFeeDue: string;
}

// assign student table data
export interface HigherClassModalTableDataTypes {
  id: number;
  studentName: studentDetailsProps;
  phoneNo: number;
  emailId: string;
}
