import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../types";
import { AccessManagementConstants } from "./accessmanagementconstants";

// export { resetHealthRecordsListByIdAct } from "./accessmanagementslice"

// Health Records

export const getRoleTypesAct = createAction<INewActionType | undefined>(AccessManagementConstants.GET_ROLE_TYPES_LIST_REQUEST);
export const addRoleTypeAct = createAction<INewActionType | undefined>(AccessManagementConstants.ADD_ROLE_TYPE_REQUEST);
export const updateRoleTypeAct = createAction<INewActionType | undefined>(AccessManagementConstants.UPDATE_ROLE_TYPE_REQUEST);
export const deleteRoleTypeAct = createAction<INewActionType | undefined>(AccessManagementConstants.DELETE_ROLE_TYPE_REQUEST);


export const getFeaturesAct = createAction<INewActionType | undefined>(AccessManagementConstants.GET_FEATURES_LIST_REQUEST);
export const mutateFeatureAct = createAction<INewActionType | undefined>(AccessManagementConstants.MUTATE_FEATURE_REQUEST);
export const deleteFeatureAct = createAction<INewActionType | undefined>(AccessManagementConstants.DELETE_FEATURE_REQUEST);

export const getPermssionAct = createAction<INewActionType | undefined>(AccessManagementConstants.GET_PERMISSIONS_LIST_REQUEST);
export const mutatePermissionAct = createAction<INewActionType | undefined>(AccessManagementConstants.MUTATE_PERMISSION_REQUEST);
export const deletePermissionAct = createAction<INewActionType | undefined>(AccessManagementConstants.DELETE_PERMISSION_REQUEST);


export const rootFeaturesAct = createAction<INewActionType | undefined>(AccessManagementConstants.GET_ROOT_FEATURE_REQUEST);
export const subFeatureOfRootFeatureAct = createAction<INewActionType | undefined>(AccessManagementConstants.GET_SUBFEATURE_OFROOTFEATURE_REQUEST);
export const mutateFeaturePermissionAct = createAction<INewActionType | undefined>(AccessManagementConstants.MUTATE_FEATURE_PERMISSION_REQUEST);
