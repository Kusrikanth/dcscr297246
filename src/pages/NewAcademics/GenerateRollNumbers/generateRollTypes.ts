// generate roll number table filter
export interface generateRollNumFilterhProps {
  searchString: string;
  academicYearId: string;
  // branchId: number;
  classId: string;
  curriculumId:string;
  sectionId: string;
}

interface studentDetailsProps {
  name?: string;
  dep_id?: string;
  imgUrl?: string;
}

// generate roll num table data
export interface IGenerateRollNumTableData {
  id: number;
  studentName: studentDetailsProps;
  class: string;
  section: string;
  rollNumber: number;
}

// Modal types
export interface IGenerateRollNumModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: number;
  editData: any;
}

// search input type generate roll number modal
export interface searchInputProps {
  academicYearId: string;
  curriculumId: string;
  branchClassId: string;
  sectionId: string;
  rollNumType: string;
}
