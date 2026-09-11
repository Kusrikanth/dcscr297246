//Index File Types
export interface IRoleTypesProps {
    instituteId: string,
    instituteName: string
}
export interface IRoleModalState {
    showModal: boolean,
    roleId: (string | undefined),
    modalData: any,
}
export interface IDelRoleModalState {
    showModal: boolean,
    roleId: string,
}
export interface IRolesInfo {
    id: number,
    roleName: string
}

//Role Modal
export interface IAddEditRoleModalProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
    roleId: string | undefined,
    instituteId: string,
    editRoleDetails?: any
}

export interface IRoleTypeListInfo {
    userTypeName: string,
    uniqueId: string,
}

export interface IAddRoleTypeState {
    roles: IRoleTypeListInfo[]
}