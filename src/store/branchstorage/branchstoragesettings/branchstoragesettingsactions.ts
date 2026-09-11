//Lms Settings

import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { branchstoragesettingsconstants } from "./branchstoragesettingsconstants";
export { resetFileCategoryListAct } from "./branchstoragesettingsslice";

//Institute Branch Storage Settings
export const getBranchStorageAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.GET_BRANCH_STORAGE);
export const saveBranchStorageAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.SAVE_BRANCH_STORAGE);
export const updateBranchStorageAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.UPDATE_BRANCH_STORAGE);
export const getBranchStorageByIdAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.GET_BRANCH_STORAGE_BY_ID);

//User Groups
export const getUserGroupsListAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.GET_USER_GROUPS_LIST);
export const saveUserGroupsAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.SAVE_USER_GROUPS);
export const getUserGroupsByIdAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.GET_USER_GROUPS_BY_ID);
export const deleteUserGroupsAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.DELETE_UPDATE_USER_GROUPS);

//User group members
export const getMembersInUserGroupsAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.GET_MEMBERS_IN_USER_GROUPS);
export const saveMembersInUserGroupsAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.SAVE_MEMBERS_IN_USER_GROUPS);
export const deleteMembersInUserGroupsAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.DELETE_MEMBERS_IN_USER_GROUPS);

//user Profile Permissions
export const getUserAccessProfilePremissionsAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.GET_USER_ACCESS_PROFILE_PERMISSIONS);
export const saveUserAccessProfilePremissionsAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.SAVE_USER_ACCESS_PROFILE_PERMISSIONS);
export const getUserAccessProfilePremissionsByIdAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.GET_USER_ACCESS_PROFILE_PERMISSIONS_BY_ID);
export const deleteUserAccessProfileAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.DELETE_USER_ACCESS_PROFILE);
export const deleteUserAccessProfilePremissionsAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.DELETE_USER_ACCESS_PROFILE_PERMISSIONS);

//Branch Policies
export const getBranchPoliciesAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.GET_BRANCH_POLICIES);
export const updateBranchPoliciesAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.UPDATE_BRANCH_POLICIES);

//File Category
export const getFileTypeCategoryListAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.GET_FILE_TYPE_CATEGORY_LIST);
export const saveFileTypeCategoryAct = createAction<INewActionType | undefined>(branchstoragesettingsconstants.SAVE_FILE_TYPE_CATEGORY);
