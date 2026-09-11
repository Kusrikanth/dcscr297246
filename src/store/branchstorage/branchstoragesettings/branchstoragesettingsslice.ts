import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBranchStorageSettingsListReducerState } from "./branchstoragesettingstypes";

const initialState: IBranchStorageSettingsListReducerState = {

    //Institute Branch Storage Settings
    getBranchStorageList: undefined,
    getBranchStorageById: undefined,
    saveBranchStorageResp: undefined,
    updateBranchStorageResp: undefined,

    //User Groups
    getUserGroupsListResp: undefined,
    saveUserGroupsResp: undefined,
    getUserGroupsByIdResp: undefined,
    deleteUserGroupsResp: undefined,

    //User group members
    membersInUserGroupsResp: undefined,
    saveMembersInUserGroupsResp: undefined,
    deleteMembersInUserGroupsResp: undefined,

    //user Profile Permissions
    getUserAccessProfilePermissionsResp: undefined,
    saveUserAccessProfilePermissionsResp: undefined,
    getUserAccessProfilePermissionsByIdResp: undefined,
    deleteUserAccessProfileResp: undefined,
    deleteUserAccessProfilePermissionsResp: undefined,

    //Branch Policies
    getBranchPoliciesList: undefined,
    updateBranchPoliciesResp: undefined,

    //File Category
    getFileCategoryListResp: undefined,
    saveFileCategoryResp: undefined,

    // Error
    branchStorageSettingsErrorAct: undefined,
};

export const branchStorageSettings = createSlice({
    name: "branchStorageSettings",
    initialState,
    reducers: {

        //Institute Branch Storage Settings
        setBranchStorageAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageList = action.payload;
        },
        setBranchStorageByIdAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageById = action.payload;
        },
        setSaveBranchStorageAct: (state, action: PayloadAction<any>) => {
            state.saveBranchStorageResp = action.payload;
        },
        setUpdateBranchStorageAct: (state, action: PayloadAction<any>) => {
            state.updateBranchStorageResp = action.payload;
        },

        //User Groups
        setUserGroupsAct: (state, action: PayloadAction<any>) => {
            state.getUserGroupsListResp = action.payload;
        },

        setSaveUserGroupsAct: (state, action: PayloadAction<any>) => {
            state.saveUserGroupsResp = action.payload;
        },

        setUserGroupsByIdAct: (state, action: PayloadAction<any>) => {
            state.getUserGroupsByIdResp = action.payload;
        },

        setDeleteUserGroupsAct: (state, action: PayloadAction<any>) => {
            state.deleteUserGroupsResp = action.payload;
        },

        // User Group Members
        setMembersInUserGroupsAct: (state, action: PayloadAction<any>) => {
            state.membersInUserGroupsResp = action.payload;
        },

        setSaveMembersInUserGroupsAct: (state, action: PayloadAction<any>) => {
            state.saveMembersInUserGroupsResp = action.payload;
        },

        setDeleteMembersInUserGroupsAct: (state, action: PayloadAction<any>) => {
            state.deleteMembersInUserGroupsResp = action.payload;
        },

        //user Profile Permissions
        setUserAccessProfilePermissionsAct: (state, action: PayloadAction<any>) => {
            state.getUserAccessProfilePermissionsResp = action.payload;
        },
        setSaveUserAccessProfilePermissionsAct: (state, action: PayloadAction<any>) => {
            state.saveUserAccessProfilePermissionsResp = action.payload;
        },
        setUserAccessProfilePermissionsByIdAct: (state, action: PayloadAction<any>) => {
            state.getUserAccessProfilePermissionsByIdResp = action.payload;
        },
        setDeleteUserAccessProfileAct: (state, action: PayloadAction<any>) => {
            state.deleteUserAccessProfileResp = action.payload;
        },
        setDeleteUserAccessProfilePermissionsAct: (state, action: PayloadAction<any>) => {
            state.deleteUserAccessProfilePermissionsResp = action.payload;
        },

        //Branch Policies
        setBranchPoliciesAct: (state, action: PayloadAction<any>) => {
            state.getBranchPoliciesList = action.payload;
        },
        setUpdateBranchPoliciesAct: (state, action: PayloadAction<any>) => {
            state.updateBranchPoliciesResp = action.payload;
        },

        //File Category
        setFileCategoryListAct: (state, action: PayloadAction<any>) => {
            state.getFileCategoryListResp = action.payload;
        },
        resetFileCategoryListAct: (state, action: PayloadAction<any>) => {
            state.getFileCategoryListResp = action.payload;
        },
        setSavetFileCategoryAct: (state, action: PayloadAction<any>) => {
            state.saveFileCategoryResp = action.payload;
        },
        // Error
        setBranchStorageSettingsErrorAct: (state, action: PayloadAction<any>) => {
            state.branchStorageSettingsErrorAct = action.payload;
        },
    },
});

export const {

    //Institute Branch Storage Settings
    setBranchStorageAct,
    setBranchStorageByIdAct,
    setSaveBranchStorageAct,
    setUpdateBranchStorageAct,

    //User Groups
    setUserGroupsAct,
    setSaveUserGroupsAct,
    setUserGroupsByIdAct,
    setDeleteUserGroupsAct,

    //User group members
    setMembersInUserGroupsAct,
    setSaveMembersInUserGroupsAct,
    setDeleteMembersInUserGroupsAct,

    //user Profile Permissions
    setUserAccessProfilePermissionsAct,
    setSaveUserAccessProfilePermissionsAct,
    setUserAccessProfilePermissionsByIdAct,
    setDeleteUserAccessProfileAct,
    setDeleteUserAccessProfilePermissionsAct,

    //Branch Policies
    setBranchPoliciesAct,
    setUpdateBranchPoliciesAct,

    //File Category
    setFileCategoryListAct,
    resetFileCategoryListAct,
    setSavetFileCategoryAct,

    // Error
    setBranchStorageSettingsErrorAct,
} = branchStorageSettings.actions;

export default branchStorageSettings.reducer;