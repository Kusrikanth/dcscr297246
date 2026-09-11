// Rejected List table filter
export interface rejectedListFilterhProps {
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
  
  // Rejected List table data type
  export interface rejectedListTableData {
    id: number;
    requestDate: string,
    studentName: studentDetailsProps;
    class: string;
    section: string;
    claimedBy: string;
    parentsName: string;
    // eslint-disable-next-line no-restricted-globals
    requestType: string;
    remarks: string,
  }
  