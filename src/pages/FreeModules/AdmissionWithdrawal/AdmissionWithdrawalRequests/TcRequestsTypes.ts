// payment received table filter
export interface tcRequestsFilterhProps {
  search: string;
  year: string;
  curriculum: string;
  class: string;
  dateRange: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

// payment received table data type
export interface admissionWithdrawalTableData {
  id: number;
  studentName: studentDetailsProps;
  curriculum: string;
  class: string;
  parentName: string;
  contactNo: string;
  address: string;
}
