// Requested List table filter
export interface requestedListFilterhProps {
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
  
  // Requested List table data type
  export interface requestedListTableData {
    id: number;
    studentName: studentDetailsProps;
    class: string;
    curriculum: string;
    section: string;
    claimedBy: string;
    fatherMotherName: string;
    requestDate: string,
    requestDescription:string,
    terms:string,
    requestType: string;
  }
  export interface StudentViewLedgerModalTypesProps {
    isOpen: boolean;
    toggle: any;
    modalTitle: string;
    instituteId: string;
    instituteName: string;
    branchId: string;
    editBranchDetails: string | undefined;
    ledgerId?:any;
  }