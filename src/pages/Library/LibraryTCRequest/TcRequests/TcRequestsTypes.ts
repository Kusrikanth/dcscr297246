export interface tcRequestsFilterhProps {
  search: string;
  academicYearId: string;
  curriculumId: string;
  classId: string;
  dateRange: string;
}

export interface tcRequestsTableData {
  id: number;
  studentName : string;
  studentCode : string;
  curriculumName: string;
  class: string;
  section: string;
  tcApplicationDate: string;
  lastAttendedDate: string;
  feePaidStatus: string;
  status: string;
}
