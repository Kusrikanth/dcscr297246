// Issued List table filter
export interface issuedListFilterhProps {
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
  
  // Issued List table data type
  export interface issuedListTableData {
    id: number;
    requestDate: string,
    studentName: studentDetailsProps;
    class: string;
    section: string;
    claimedBy: string;
    fatherMotherName: string;
    // eslint-disable-next-line no-restricted-globals
    requestType: string;
    approvalDate: string,
    remarks: string,
  }
  