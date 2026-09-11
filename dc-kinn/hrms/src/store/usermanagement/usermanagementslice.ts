import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserManagementState } from "./usermanagementtypes";
import { IResponseErrorModel } from "../types";

const initialState: IUserManagementState = {
    getRoleTypeUsersResp: undefined,
    singleCreateUserResp: undefined,
    updateRoleTypeUserResp: undefined,
    deleteRoleTypeUserResp: undefined,
    roleTypeUserByIdResp: undefined,
    changePasswordRoleTypeUserResp: undefined,
    deactivateRoleTypeUserResp: undefined,
    userLoginActivityResp: undefined,
    multipleCreateUserResp: undefined,
    roleTypePermissionResp: undefined,
    userManagementErrorResp: undefined,
    getLoginHistoryResp: undefined,
    getOSListResp: undefined,
    exportLoginHistoryResp: undefined,
    exportNotLoginUsersResp: undefined,
    getNotLoginUsersResp: undefined,
    getRoleTypeListResp: undefined,
    getIPRestrictionResp: undefined,
    deleteIPRestrictionResp: undefined,
    saveIPRestrictionResp: undefined,
    upadteIPRestrictionResp: undefined,
    exportIPRestrictionResp: undefined,
};

export const userManagementSlice = createSlice({
    name: "userManagement",
    initialState,
    reducers: {
        setRoleTypeUsersAct: (state, action: PayloadAction<any>) => {
            state.getRoleTypeUsersResp = action.payload;
        },
        setSingleCreateUserRespAct: (state, action: PayloadAction<any>) => {
            state.singleCreateUserResp = action.payload;
        },
        setUpdateRoleTypeUserAct: (state, action: PayloadAction<any>) => {
            state.updateRoleTypeUserResp = action.payload;
        },
        setDeleteRoleTypeUserAct: (state, action: PayloadAction<any>) => {
            state.deleteRoleTypeUserResp = action.payload;
        },
        setRoleTypeUserByIdAct: (state, action: PayloadAction<any>) => {
            state.roleTypeUserByIdResp = action.payload;
        },
        setChangePasswordRoleTypeUserAct: (state, action: PayloadAction<any>) => {
            state.changePasswordRoleTypeUserResp = action.payload;
        },
        setDeactivateRoleTypeUserAct: (state, action: PayloadAction<any>) => {
            state.deactivateRoleTypeUserResp = action.payload;
        },
        setUserLoginActivityAct: (state, action: PayloadAction<any>) => {
            state.userLoginActivityResp = action.payload;
        },
        setMultipleCreateUserAct: (state, action: PayloadAction<any>) => {
            state.multipleCreateUserResp = action.payload;
        },
        setRoleTypePermissionAct: (state, action: PayloadAction<any>) => {
            state.roleTypePermissionResp = action.payload;
        },
        setUserManagementErrorAct: (state, action: PayloadAction<any>) => {
            state.userManagementErrorResp = action.payload;
        },
        setLoginHistoryAct: (state, action: PayloadAction<any>) => {
            state.getLoginHistoryResp = action.payload;
        },
        setOSListAct: (state, action: PayloadAction<any>) => {
            state.getOSListResp = action.payload;
        },
        resetOSListAct: (state, action: PayloadAction<any>) => {
            state.getOSListResp = action.payload;
        },
        setExportLoginHistoryAct: (state, action: PayloadAction<any>) => {
            state.exportLoginHistoryResp =  action.payload;
        },
        setExportNotLoginUsersAct: (state, action: PayloadAction<any>) => {
            state.exportNotLoginUsersResp =  action.payload;
        },
        setNotLoginUsersAct: (state, action: PayloadAction<any>) => {
            state.getNotLoginUsersResp =  action.payload;
        },
        setRoleTypeListAct: (state, action: PayloadAction<any>) => {
            state.getRoleTypeListResp =  action.payload;
        },
        resetRoleTypeListAct: (state, action: PayloadAction<any>) => {
            state.getRoleTypeListResp =  action.payload;
        },
        setIPRestrictionAct: (state, action: PayloadAction<any>) => {
            state.getIPRestrictionResp =  action.payload;
        },
        deleteIPRestrictionAct: (state, action: PayloadAction<any>) => {
            state.deleteIPRestrictionResp =  action.payload;
        },
        saveIPRestrictionAct: (state, action: PayloadAction<any>) => {
            state.saveIPRestrictionResp =  action.payload;
        },
        updateIPRestrictionAct: (state, action: PayloadAction<any>) => {
            state.upadteIPRestrictionResp =  action.payload;
        },
        exportIPRestrictionAct: (state, action: PayloadAction<any>) => {
            state.exportIPRestrictionResp =  action.payload;
        },
    },
});

export const { setRoleTypeUsersAct, setSingleCreateUserRespAct, setUpdateRoleTypeUserAct,
    setDeleteRoleTypeUserAct, setRoleTypeUserByIdAct, setChangePasswordRoleTypeUserAct,
    setDeactivateRoleTypeUserAct, setUserLoginActivityAct, setMultipleCreateUserAct,
    setRoleTypePermissionAct, setUserManagementErrorAct,setLoginHistoryAct, setOSListAct,resetOSListAct, setExportLoginHistoryAct, setExportNotLoginUsersAct, setNotLoginUsersAct, setRoleTypeListAct,resetRoleTypeListAct, setIPRestrictionAct, deleteIPRestrictionAct, saveIPRestrictionAct, updateIPRestrictionAct, exportIPRestrictionAct } = userManagementSlice.actions;

export default userManagementSlice.reducer;
