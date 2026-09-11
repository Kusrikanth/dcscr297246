// fee structure table filter
export interface FeeStuctureFilterhProps {
  search: string;
  year: string;
  department: string;
  board: string;
}

// fee structure table data type
export interface FeeStuctureTableData {
  id: number;
  feeName: string;
  feeType: string;
  class: string;
  amount: number;
  newAdmissionAmount: number;
}

export interface addNewOpenModal {
  showModal: boolean;
  branchId: string;
}

export interface checkBoxOptionTypes {
  name: string;
  label: string;
}

export interface FeeStructureTableModalData {
  id: number;
  terms: string;
  lastDatetoPay: string;
  fee: string;
  newAdmissionFee: string;
}

export interface addNewFeeStuctureModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}

export interface FeeStuctureModalFilterhProps {
  curriculum: string;
  feeName: string;
  feeType: string;
  academicYear: string;
}
export interface DeleteRecordModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}
