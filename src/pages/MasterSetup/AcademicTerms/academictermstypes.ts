export interface IAcademicTermsProps {
    instituteName: string;
    instituteId: string;
}

export interface IAcademicTermsModalState {
    showModal: boolean;
    academicTermId: string | undefined;
    modalData?: any;
}


export interface IDelAcademicTermsModalState {
    showModal: boolean;
    academicTermId: string;
}

export interface IAcademicTermsRespRef {
    prevAcademicTermListResp: any;
    prevDeleteAcademicTermResp: any;
    prevAddAcademicTermResp:any;
    prevInstAcademicErrorResp: any;
}

//Add Academic Terms Modal Props
export interface IAddAcademicTermProps {
    isOpen: boolean,
    toggle: any,
    modalTitle: string,
    academicTermId: string | undefined,
    instituteId: string,
    editModalData: any
}

export interface IAddEditAcademicTermRespRef {
    prevAddAcademicTermResp: any,
    prevUpdateAcademicTermResp: any
}