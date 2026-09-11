export interface IDelTermsModalState {
    showModal: boolean;
    termId: string;
}
export interface IClassTermsRespRef {
    // prevAcademicTermListResp: any;
    prevDeleteClassTermResp: any;
    prevUpdateClassTermResp:any;
    prevAddClassTermResp:any;
    prevClassTermErrorResp: any;
}
export interface addEditClassTermModalProps {
    isOpen: boolean;
    toggle: any;
    modalTitle?: string;
    instituteId: string;
    instituteName: string;
    branchId: string;
    editBranchDetails: string | undefined;
    modalData:any;
    academicYearId?:any
  }