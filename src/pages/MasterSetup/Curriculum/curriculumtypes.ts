
export interface ICurriculumProps {
    instituteName: string,
    instituteId: string,
}


export interface IDelDepartmentModalState {
    showModal: boolean,
    departmentId: string,
}

export interface IDepartmentRespRef {
    prevDeleteInstDepartmentResp: string | undefined,
    prevInstInfoError: any
}
export interface IFilterDepartmentState {
    departmentName: string | undefined,
}
//Add Edit Department Modal
export interface IAddEditDepartmentProps {
    isOpen: boolean,
    toggle: any,
    modalTitle: string,
    departmentId: string,
    instituteId: string,
    editDepartmentDetails?: any
}
export interface IAddDepartmentResp {
    prevAddInstDepartmentResp: any,
    prevUpdateInstDepartmentResp: any
}
export interface IAddCurriculumInfoState {
    uniqueId?: string,
    instituteCurriculumId: string | undefined;
    curriculumName: string,
    shortName: string
}
export interface IAddCurriculumState {
    curriculums: Array<IAddCurriculumInfoState>
}