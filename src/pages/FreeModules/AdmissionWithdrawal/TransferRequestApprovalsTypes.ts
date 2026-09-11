// Tabbar menu types
export interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}


export interface TransferRequestApprovalsModalsProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}

export interface TransferRequestApprovalsOpenModal {
  showModal: boolean;
  branchId: string;
}

// Modal types
export interface TransferRequestApprovalsModals2DataProps {
  id: number;
  academicYear: string;
  class: string;
  feeDetails: string;
  amounttoPay: string;
  paidAmount: string;
  balanceAmount: string;
}

// Modal types

export interface TransferRequestApprovalsModals2Props {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}
