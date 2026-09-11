// ChequeHistory filter props

export interface FinesProps {
  search: string;
}

export interface FinesTableData {
  id: number;
  feeName: string;
  feeType: string;
  gracePeriod: string;
  fineSystem: string;
  finePerDay: string;
}

export interface addNewFineModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}
export interface fineModalFilterProps {
  applicableFor: string;
  gracePeriod: string;
  fineSystem: string;
  finePerDay: string;
}
export interface FineModalType {
  showModal: boolean;
  branchId: string;
}
export interface RemoveFineModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}
