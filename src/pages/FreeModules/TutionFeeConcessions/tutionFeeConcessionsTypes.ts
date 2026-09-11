// tution fee concession table filter
export interface TutionFeeConcessionFilterhProps {
  studentName: string;
  academicYearId: string;
  curriculumId: string;
  classId: string;
  dateRange: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: any;
}

// tution fee concession table data type
export interface TutionFeeConcessionTableData {
  id: number;
  studentName: studentDetailsProps;
  campus: string;
  curriculum: string;
  class: string;
  section: string;
  employeeName: string;
  siblingName: string;
  concessionAmount: number;
  concessionType: string;
}
export interface IStudentConcessionModal {
  showModal: boolean;
  branchId: string;
}