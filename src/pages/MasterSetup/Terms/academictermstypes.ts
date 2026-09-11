export interface IAcademicTermsProps {
    instituteName: string;
    instituteId: string;
}

export interface ITermsModalState {
    showModal: boolean;
    termId: string | undefined;
    modalData?: any;
}

export interface sortRef{
    id:string,
    desc:boolean
}

export interface IDelTermsModalState {
    showModal: boolean;
    termId: string;
}

export interface ITermsRespRef {
    prevAddTermResp: any;
    prevDeleteTermResp: any;
    prevUpdateTermResp: any;
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