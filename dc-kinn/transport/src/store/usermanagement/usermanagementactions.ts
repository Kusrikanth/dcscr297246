import { createAction } from "@reduxjs/toolkit";
import { UserManagementConstants } from "./usermanagementconstants";
import { INewActionType } from "../types";
export { resetOSListAct,resetRoleTypeListAct } from './usermanagementslice'

export const getRoleTypeUsersAct = createAction<INewActionType | undefined>(UserManagementConstants.GET_ROLETYPE_USERS_REQUEST);

export const singleCreateUserAct = createAction<INewActionType | undefined>(UserManagementConstants.SINGLE_CREATE_USER_REQUEST);

export const updateRoleTypeUserAct = createAction<INewActionType | undefined>(UserManagementConstants.UPDATE_ROLETYPE_USER_REQUEST);

export const deleteRoleTypeUserAct = createAction<INewActionType | undefined>(UserManagementConstants.DELETE_ROLETYPE_USER_REQUEST);

export const getRoleTypeUserByIdAct = createAction<INewActionType | undefined>(UserManagementConstants.GET_ROLETYPE_USER_BYID_REQUEST);

export const changePasswordRoleTypeUserAct = createAction<INewActionType | undefined>(UserManagementConstants.CHANGE_PASSWORD_ROLETYPE_USER_REQUEST);

export const deactivateRoleTypeUserAct = createAction<INewActionType | undefined>(UserManagementConstants.DEACTIVATE_ROLETYPE_USER_REQUEST);

export const getUserLoginActivityAct = createAction<INewActionType | undefined>(UserManagementConstants.GET_USER_LOGIN_ACTIVITY_REQUEST);

export const multipleCreateUserAct = createAction<INewActionType | undefined>(UserManagementConstants.MULTIPLE_CREATE_USER_REQUEST);

export const getRoleTypePermissionAct = createAction<INewActionType | undefined>(UserManagementConstants.GET_ROLETYPE_PERMISSION_REQUEST);

export const getLoginHistoryAct = createAction<INewActionType | undefined>(UserManagementConstants.GET_LOGIN_HISTORY);
export const getOSListAct = createAction<INewActionType | undefined>(UserManagementConstants.GET_OS_LIST);
export const exportLoginHistoryAct = createAction<INewActionType | undefined>(UserManagementConstants.EXPORT_LOGIN_HISTORY);
export const exportNotLoginUsersAct = createAction<INewActionType | undefined>(UserManagementConstants.EXPORT_NOT_LOGIN_USERS);
export const getNotLoginUsersAct = createAction<INewActionType | undefined>(UserManagementConstants.GET_NOT_LOGIN_USERS);
export const getRoleTypeListAct = createAction<INewActionType | undefined>(UserManagementConstants.GET_ROLE_TYPE_LIST);
export const getIPRestrictionAct = createAction<INewActionType | undefined>(UserManagementConstants.GET_IP_RESTRICTION);
export const deleteIPRestrictionAct = createAction<INewActionType | undefined>(UserManagementConstants.DELETE_IP_RESTRICTION);
export const saveIPRestrictionAct = createAction<INewActionType | undefined>(UserManagementConstants.SAVE_IP_RESTRICTION);
export const updateIPRestrictionAct = createAction<INewActionType | undefined>(UserManagementConstants.UPDATE_IP_RESTRICTION);
export const exportIPRestrictionAct = createAction<INewActionType | undefined>(UserManagementConstants.EXPORT_IP_RESTRICTION);
