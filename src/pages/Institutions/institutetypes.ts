// Interface & Types

import { IAddBranch, IBranchInfo, IUpdateBranchResp } from "../../store/mastersettings/branch/branchtypes";

//Branch Index Types
export interface IBranchProps {
    instituteName: string,
    instituteId: string,
}
export interface IBranchModal {
    showModal: boolean,
    branchId: string,
    modalData?: IBranchInfo,
}
export interface IBranchState {
    isListMode: boolean,
}
export interface IFilterBranchState {
    branchName: string | undefined,
}
export interface IDelBranchModalState {
    showModal: boolean,
    branchId: string,
}

export interface IBranchResp {
    prevDeleteBranchResp: any,
    prevSetMainBranchResp: any,
    prevBranchErrorResp: any
}


//Add Branch Modal Types
export interface IAddBranchProps {
    isOpen: boolean,
    toggle: any,
    modalTitle: string,
    branchId: string,
    instituteId: string,
    instituteName: string,
    editBranchDetails: (IBranchInfo | undefined)
}
export interface IAddBranchAdminProps {
    isOpen: boolean,
    toggle: any,
    modalTitle: string,
    branchId: string,
    instituteId: string,
    instituteName: string,
    editBranchAdminDetails: (IBranchInfo | undefined)
}
export interface IAddBranchModalRespRef {
    prevAddBranchResp: IAddBranch | undefined,
    prevUpdateBranchResp: IUpdateBranchResp | undefined,
    prevMasterDataErrorResp: any
}

export interface IMenuOptions {
    id: string;
    labelName: string;
    customPadding: string;
}