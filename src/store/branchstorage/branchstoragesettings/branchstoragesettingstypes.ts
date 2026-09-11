export interface IBranchStorageSettingsListReducerState {

    //Institute Branch Storage Settings
    getBranchStorageList: any;
    getBranchStorageById: any;
    saveBranchStorageResp: any;
    updateBranchStorageResp: any;

    //User Groups
    getUserGroupsListResp: any;
    saveUserGroupsResp: any;
    getUserGroupsByIdResp: any;
    deleteUserGroupsResp: any;

    //User group members
    membersInUserGroupsResp: any;
    saveMembersInUserGroupsResp: any;
    deleteMembersInUserGroupsResp: any;

    //user Profile Permissions
    getUserAccessProfilePermissionsResp: any;
    saveUserAccessProfilePermissionsResp: any;
    getUserAccessProfilePermissionsByIdResp: any;
    deleteUserAccessProfileResp: any;
    deleteUserAccessProfilePermissionsResp: any;

    //Branch Policies
    getBranchPoliciesList: any;
    updateBranchPoliciesResp: any;

    //File Category
    getFileCategoryListResp: any;
    saveFileCategoryResp: any;

    // Error
    branchStorageSettingsErrorAct: any;

}