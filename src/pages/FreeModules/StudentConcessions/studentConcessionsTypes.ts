// student concession table filter
export interface StudentConcessionFilterhProps {
  studentName: string;
  academicYearId: string;
  classId: string;
  curriculumId: string;
  type: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

// student concession table data type
export interface StudentConcessionTableData {
  id: number;
  studentName: studentDetailsProps;
  curriculum: string;
  class: string;
  section: string;
  employeeName: string;
  siblingName: string;
  concessionAmount: number;
  type: string;
  document:any;
  concessionType: string;
}
export interface IStudentConcessionModal {
  showModal: boolean;
  branchId: string;
}
