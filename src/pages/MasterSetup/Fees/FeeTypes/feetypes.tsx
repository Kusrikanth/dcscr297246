// fee name table filter
export interface FeeNameFilterhProps {
    search: string;
    year: string;
    department: string;
    board: string;
  }
  
  // fee name table data type
  export interface FeeNameTableData {
    id: number;
    department: string;
    feeName: string;
    feeType: string;
    allowRefunds: string;
    unformSlab: string;
    allowStudentConcessions: string;
    allowEmployeeConcessions: string;
  }
  
  export interface addNewOpenModal {
    showModal: boolean;
    branchId: string;
  }
  
  export interface checkBoxOptionTypes {
    name: string;
    label: string;
  }
  
  // Modal types
  export interface addNewFeeModalProps {
    isOpen: boolean;
    toggle: any;
    modalTitle: string;
    instituteId: string;
    instituteName: string;
    branchId: string;
    editBranchDetails: string | undefined;
  }
  
  // search input type
  export interface searchInputProps {
    search: string;
  }
  
  export interface FeeNameModalFilterhProps {
    curriculum: string;
    feeName: string,
    department: string,
    allowRefund: string,
    uniformSlab: string
  }
  
  