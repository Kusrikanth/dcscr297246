// Interface & Types

import { IInstDepartmentInfo, IUpdateInstDepartmentResp } from "../../../store/mastersettings/instituteinfo/instituteinfotypes";

export interface IDepartmentsProps {
    instituteName: string,
    instituteId: string,
}

export interface IAddDepartmentModalState {
    showModal: boolean,
    departmentId: string,
    modalData?: IInstDepartmentInfo,
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
    modalTitle?: string,
    departmentId: string,
    instituteId: string,
    editDepartmentDetails?: (IInstDepartmentInfo | undefined)
}
export interface IAddDepartmentResp {
    prevAddInstDepartmentResp: IInstDepartmentInfo | undefined,
    prevUpdateInstDepartmentResp: IUpdateInstDepartmentResp | undefined
}
export interface IAddDepartmentInfoState {
    uniqueId?: string,
    departmentName: string,
    shortName: string
}
export interface IAddDepartmentsState {
    departments: Array<IAddDepartmentInfoState>
}