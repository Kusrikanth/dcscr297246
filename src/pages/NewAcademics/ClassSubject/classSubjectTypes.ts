// class subject card data
export interface classSubjectCardData {
  id?: number;
  cardName: string;
  subName: string;
  image: any;
  color: string;
  shortName: string;
  bookColor:string;
}

// tab switch in class subject
export interface classSubjetcTabSwitchState {
  isListMode: boolean;
}

// class subject card filter
export interface classSubjectFilterhProps {
  academicYearId: string;
  curriculumId:string;
  branchClassId: string;
  subjectName: string;
  subjectType: string;
}

// class subject table data
export interface classSubjectTableData {
  id: number;
  subjectName: classSubjectCardData;
  shortName: string;
}

// show modal open type
export interface addClassSubjectOpenModal {
  showModal: boolean;
  branchId: string;
}

// Modal types
export interface classSubjectModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle?: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  academicDetails: any;
  classSubjectList:any;
}
export interface academicDetails {
  academicId: string | undefined;
  branchClassId: string | undefined;
}
// search input type
export interface searchInputProps {
  searchString: string;
}

// checkbox option types
export interface checkBoxOptionTypes {
  id: string;
  name: string;
  label: string;
  subjectType: string
}

export interface academicSubjectListTypes {
  subjectId: string;
  subjectName: string;
  shortCode: string;
  subjectType: string;
  assignedToClass: boolean;
}
export interface ConfirmationModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  showApiLoader?:any;
  editBranchDetails: string | undefined;
  submitHandler?:any;
}