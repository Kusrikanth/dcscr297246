// Tabbar menu types
export interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

// upload new requests modal
export interface UploadNewRequestsModalType {
  showModal: boolean;
  branchId: string;
}

export interface ModalTypeProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}
