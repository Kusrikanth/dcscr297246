// assign group table filter
export interface SubjectTeacherFilterhProps {
  searchString: string;
  masterAcademicYearId: string;
  curriculumId:string;
  activeTeacherId:string;
}

// teacher name data type in subject teacher
export interface TeacherNameDataProps {
  id: number;
  name: string;
  dep_id: string;
  imgUrl: string;
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

// table sections batches data
export interface Sections {
  id: string;
  sectionName: string;
}

// subject and classes table data
export interface SubjectClassesTableData {
  id: number;
  subject: string;
  class: string;
  sections: Array<Sections>;
}

// assign subject modal
export interface AssignSubjectModalType {
  showModal: boolean;
  editData:any
  // branchId: string;
}
export interface ConfirmationModalType {
  showModal: boolean;
  // branchId: string;
}

// Modal types
export interface AssignSubjectModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
  academicDetails: {
    academicId: string;
  };
  teacherData: any;
  filterState?:any;
  editData?:any
}
export interface ISubjectState {
  classId: "";
  sections: any[];
  subjectId: "";
  languageId: "";
}

export interface ISubjectsState{
  subjects:ISubjectState[]
}
export interface searchInputProps {
  class: string;
  subjectName: string;
}

export interface ConformationModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  showApiLoader?:any;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
  submitHandler?:any;
}