import { IBranchTypes } from "../../masterdata/masterdatatypes";
import { IModelWithPagination } from "../../types";

export interface IBranchReducerState {
    branchListResp: (IModelWithPagination<IBranchInfo> | undefined);
    headerBranchListResp: (IModelWithPagination<IBranchInfo> | undefined);
    branchesWithAdminResp: any;
    addBranchResp: IAddBranch | undefined;
    branchbyIdResp: any;
    updateBranchResp: IUpdateBranchResp | undefined;
    approveBranchResp: any;
    deleteBranchResp: string | undefined;
    setMainBranchResp: any;
    branchModulesResp: any;
    updateBranchModuleResp: any;
    addBranchAdminResp: any;
    updateBranchAdminResp: any;
    branchErrorResp: (any | undefined)
}
export interface IBranchInfo {
    branchId: string;
    createdAt: string;
    createdBy: string;
    lastModifiedAt: string;
    deletedAt: string;
    modifiedBy: string;
    active: string;
    branchName: string;
    instituteId: string;
    instituteName: string;
    shortName: string;
    branchType: IBranchTypes;
    affliatonNumber: string;
    url: string;
    contactName: string;
    contactPersonMailId: string;
    contactPersonNo: string;
    mailId: string;
    phoneNumber: string;
    noOfStudents: string;
    branchNo: string;
    location: string;
    branchLogo: string;
    isMainBranch: string;
    status: string;
    address: string;
    logo: string;
    stateId: string;
    countryId: string;
    pinCode: string;
    comments: string;
    clientCode: string;
    totalElements: any;
    admissionEmailId: any;
}

export interface IUpdateBranchResp extends Omit<IAddBranch, "branchType"> {
    active: boolean;
    branchTypeId: string;
    branchTypeName: string;
    status: string;
    isMainBranch: boolean
}

export interface IAddBranch {
    instituteId: string;
    branchName: string;
    branchId: string;
    shortName: string;
    branchTypeId: string;
    affliatonNumber: string | null;
    contactName: string | null;
    mailId: string | null;
    phoneNumber: string | null;
    noOfStudents: string | null;
    // eslint-disable-next-line no-restricted-globals
    location: any;
    branchLogo: string | null;
    instituteName: string | null;
}

