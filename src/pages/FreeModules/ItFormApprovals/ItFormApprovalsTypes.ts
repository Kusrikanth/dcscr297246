// Tabbar menu types
export interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  count?:any
}

export interface ItFromApprovalModalsProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  currentStudent?:any;
  instituteId: string;
  showApiLoader?:any;
  instituteName?: string;
  branchId: string;
  editBranchDetails?: string | undefined;
  cancelHandler?:any;
  submitText?:any;
  actionName?:any;
  modalText?:any;
  itFormId?:any;
}

// Modal types
export interface ItFromApprovalModalTypesProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}
