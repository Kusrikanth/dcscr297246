
export interface IClassProps {
    instituteName: string;
    instituteId: string;
}


export interface IDelClassModalState {
    showModal: boolean;
    departmentId: string;
}

export interface IDepartmentRespRef {
    prevDeleteInstDepartmentResp: string | undefined;
    prevInstInfoError: any
}
export interface IFilterDepartmentState {
    departmentName: string | undefined;
}
//Add Edit Class Modal
export interface IAddEditDepartmentProps {
    isOpen: boolean;
    toggle: any;
    modalTitle: string;
    departmentId: string;
    instituteId: string;
    editDepartmentDetails?: any
}
export interface IAddDepartmentResp {
    prevAddInstDepartmentResp: any;
    prevUpdateInstDepartmentResp: any
}
export interface IAddClassInfoState {
    uniqueId?: string;
    instituteClassId: string;
    className: string;
    classOrder: string;
    shortName: string
}
export interface IAddClassState {
    classes: Array<IAddClassInfoState>
}