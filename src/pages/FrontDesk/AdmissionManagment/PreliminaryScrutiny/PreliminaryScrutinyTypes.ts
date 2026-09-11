export interface ModalPropsType {
    isOpen: boolean;
    toggle: any;
    modalTitle: string;
    instituteId: string;
    instituteName: string;
    branchId: string;
    editBranchDetails: string | undefined;
    submitHandler?:any;
    confirmationMessage?:any;
    cancelHandler?:any;
    submitTitle?:any;
    cancleTitle?:any;
  }

  export interface ConfirmationModalProps {
    isOpen: boolean;
    toggle: any;
    modalTitle?: string;
    instituteId?: string;
    instituteName?: string;
    branchId?: string;
    editBranchDetails?: string | undefined;
    submitHandler?:any;
    scrutinyId?:any;
    studentRegId?:any;
  }

  export interface IAssignGroupOpenModal {
    showModal: boolean;
    branchId: string;
    scrutinyId?:any,
    studentRegId?:any,
  }