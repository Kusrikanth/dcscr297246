// payment received table filter
export interface tcRequestsFilterhProps {
  search: string;
  academicYearId: string;
  curriculumId: string;
  classId: string;
  dateRange: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

// payment received table data type
export interface tcRequestsTableData {
  id: number;
  tcRequestDate: string,
  studentName: studentDetailsProps;
  curriculum: string;
  class: string;
  section: string;
  lastAttendedDate: string;
  feePaidStatus: string;
  // eslint-disable-next-line no-restricted-globals
  status: string;
}
