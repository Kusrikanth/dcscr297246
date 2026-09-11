// defaulters students table filter
export interface tcApprovalListFilterhProps {
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
  
  // defaulters students table data type
  export interface tcApprovalListTableData {
    id: number;
    approvalDate: string;
    studentName: studentDetailsProps;
    curriculum: string;
    class: string;
    section: string;
    remarks: string;
    status: string;
  }
  