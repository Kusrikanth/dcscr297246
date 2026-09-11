export interface IOptionsHrtl {
    id: string;
    actionIcon: React.ReactNode;
    actionName: string;
    onClickHndlr?: any;
}
export interface ParentsDetailsTypes{
    id:number,
    name:string,
    aadharNo:string,
    relationType:string,
    email:string,
    phoneno:string,
    isEmployee:string
}
export interface SiblingDetailsTypes{
    id:number,
    studentId:string,
    name:string,
    campus:string,
    curriculum:string,
    class:string,
    section:string,
    intheSameSchool:boolean
}
export interface DocumentDetailsTypes{
    id:number,
    fileName:string,
    documentName:string,
    size:string,
    type:string,
    dateAdded:string,
    addedby:string,
}
export interface IModalProps {
    isOpen: boolean;
    toggle: any;
    modalTitle: string;
    instituteId: any;
    instituteName: string;
    branchId: any;
    editBranchDetails: string | undefined;
    editData?:any;
    data?:any;
    studentId?:any;
    academicYearId?:any;
    isDocumentRequired?:any;
}
export interface IAddDetailsModal {
    showModal: boolean;
    branchId: string;
    editData?:any;
    // modalData?: IBranchInfo;
}
export interface IUpdateStudentRepRef{
    preUpdateStudentDetails:any;
}
export interface IUploadDocumentRepRef{
    prevUploadDocumentResp:any;
}
export interface IUploadDocumentErrorRepRef{
    prevUploadDocumentErrorResp:any;
}

export interface IErrorStudentRepRef{
    prevErrorStudentRep:any;
}