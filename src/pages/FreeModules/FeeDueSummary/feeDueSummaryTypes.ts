export interface feeDueSummaryFilterTypes {
  academicYear: string;
  curriculum: string;
  feeName: string;
  class: string;
  section: string;
}

export interface totalFeedueOfClassFilterTypes {
  search: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

// total fee due of class table data type
export interface TotalFeedueOfClassTableData {
  id: number;
  studentDetails: studentDetailsProps;
  totalDueAmount: number;
}
