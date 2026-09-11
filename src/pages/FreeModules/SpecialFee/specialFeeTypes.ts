// special fee table filter
export interface SpecialFeeFilterhProps {
  search: string;
  year: string;
  department: string;
  board: string;
}

// special fee table data type
export interface SpecialFeeTableData {
  id: number;
  feeName: string;
  feeType: string;
  description: string;
  applicableTo: string;
  amount: number;
}

// special fee modal
export interface SpecialFeeModalType {
  showModal: boolean;
  branchId: string;
}

export interface SpecialFeeTableModalData {
  id: number;
  terms: string;
  lastDatetoPay: string;
  fee: string;
  newAdmissionFee: string;
}

// special fee Modal types
export interface SpecialFeeModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}

// special fee modal data modal
export interface SpecialFeeDataModal {
  curriculum: string;
  feeName: string;
  feeType: string;
  feeDescription: string;
  applicableTo: string;
  section: string;
  amount: string;
  class: string;
  lastDate: string;
}

export interface checkBoxOptionTypes {
  name: string;
  label: string;
}

export interface addNewSpecialFeeModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}

export interface SpecialFeeModalFilterhProps {
  curriculum: string;
  feeName: string;
  feeType: string;
  feeDescription: string;
  applicableTo: string;
  class: string;
  section: string;
  studentIds: Array<string>;
  studentId: string;
  amount: number;
  lastDate: string;
}
