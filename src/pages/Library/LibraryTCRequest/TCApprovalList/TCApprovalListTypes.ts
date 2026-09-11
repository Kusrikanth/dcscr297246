export interface tcApprovalListFilterhProps {
    search: string;
    academicYearId: string;
    curriculumId: string;
    classId: string;
    dateRange: string;
  }

  export interface tcApprovalListTableData {
    id: number;
    approvalDate: string;
    studentName: string;
    studentCode: string;
    curriculum: string;
    class: string;
    section: string;
    remarks: string;
    status: string;
  }
  