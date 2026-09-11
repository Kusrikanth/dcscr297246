export interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

export interface LibraryTCRequestOpenModal {
  showModal: boolean;
  branchId: string;
}

export interface LibraryTCRequestModals2DataProps {
  id: number;
  academicYear: string;
  class: string;
  feeDetails: string;
  amounttoPay: string;
  paidAmount: string;
  balanceAmount: string;
}

export interface LibraryTCRequestModals2Props {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}
