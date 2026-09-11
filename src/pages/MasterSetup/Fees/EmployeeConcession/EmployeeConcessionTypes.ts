// ChequeHistory filter props

export interface EmployeeConcessionProps {
  search: string;
  instituteDepartments: string;
  branchType: string;
  experience: string;
}

// cheque history table data type
export interface EmployeeConcessionTableData {
  id: number;
  department: string;
  experience: number;
  feeName: string;
  concession: number;
}

export interface EmployeeConcessionModalType {
  showModal: boolean;
  employeeConcessionId: string;
  modalData:any;
}

export interface addNewEmployeeConcessionModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  modalData:any;
  departments:any;
  editBranchDetails: string | undefined;
}

export interface EmployeeConcessionModalFilterhProps {
  experience: string;
}

export interface EmployeeConcessionTableModalData {
  id: number;
  department: string;
  feeName: string;
  percentage: string;
}

export interface checkBoxOptionTypes {
  name: string;
  label: string;
}

// Modal types

// export interface ChequeHistoryModalProps {
//   isOpen: boolean;
//   toggle: any;
//   modalTitle: string;
//   instituteId: string;
//   instituteName: string;
//   branchId: string;
//   editBranchDetails: string | undefined;
// }
