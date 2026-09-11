// defaulters students table filter
export interface tcApprovalListFilterhProps {
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
  
  // defaulters students table data type
  export interface tcApprovalListTableData {
    id: number;
    studentName: studentDetailsProps;
    curriculum: string;
    class: string;
    amountReturned: string;
    remarks: string;
    paymentMode: string;
    approvalDate: string;
  }
  