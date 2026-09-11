import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAccessManagementReducerState } from "./accessmanagementtypes";


const initialState: IAccessManagementReducerState = {
    roleTypesListResp: undefined,
    addRoleTypeResp: undefined,
    updateRoleTypeResp: undefined,
    deleteRoleTypeResp: undefined,

    featureListResp: undefined,
    mutateFeatureResp: undefined,
    deleteFeatureResp: undefined,

    permissionsListResp: undefined,
    mutatePermissionResp: undefined,
    deletePermissionResp: undefined,

    rootFeaturesResp: undefined,
    subFeatureOfRootFeatureResp: undefined,
    mutateFeaturePermissionResp: undefined,

    accessManagementErrorResp: undefined,
}
export const accessManagement = createSlice({
    name: "accessManagement",
    initialState,
    reducers: {
        setRoleTypesAct: (state, action: PayloadAction<any>) => {
            state.roleTypesListResp = action.payload;
        },
        setAddRoleTypeAct: (state, action: PayloadAction<any>) => {
            state.addRoleTypeResp = action.payload;
        },
        setUpdateRoleTypeAct: (state, action: PayloadAction<any>) => {
            state.updateRoleTypeResp = action.payload;
        },
        setDeleteRoleTypeAct: (state, action: PayloadAction<any>) => {
            state.deleteRoleTypeResp = action.payload;
        },

        setFeatureListAct: (state, action: PayloadAction<any>) => {
            state.featureListResp = action.payload;
        },
        setMutateFeatureAct: (state, action: PayloadAction<any>) => {
            state.mutateFeatureResp = action.payload;
        },
        setDeleteFeatureAct: (state, action: PayloadAction<any>) => {
            state.deleteFeatureResp = action.payload;
        },


        setPermissionListAct: (state, action: PayloadAction<any>) => {
            state.permissionsListResp = action.payload;
        },
        setMutatePermissionAct: (state, action: PayloadAction<any>) => {
            state.mutatePermissionResp = action.payload;
        },
        setDeletePermissionAct: (state, action: PayloadAction<any>) => {
            state.deletePermissionResp = action.payload;
        },


        setRootFeaturesAct: (state, action: PayloadAction<any>) => {
            state.rootFeaturesResp = action.payload;
        },
        setSubFeatureOfRootFeatureAct: (state, action: PayloadAction<any>) => {
            state.subFeatureOfRootFeatureResp = action.payload;
        },
        setMutateFeaturePermissionAct: (state, action: PayloadAction<any>) => {
            state.mutateFeaturePermissionResp = action.payload;
        },


        setAccessManagementErrorAct: (state, action: PayloadAction<any>) => {
            state.accessManagementErrorResp = action.payload;
        },

    }
})
export const {
    setRoleTypesAct, setAddRoleTypeAct, setUpdateRoleTypeAct, setDeleteRoleTypeAct,
    setFeatureListAct, setMutateFeatureAct, setDeleteFeatureAct,
    setPermissionListAct, setMutatePermissionAct, setDeletePermissionAct,
    setRootFeaturesAct, setSubFeatureOfRootFeatureAct, setMutateFeaturePermissionAct,
    setAccessManagementErrorAct
} = accessManagement.actions;
export default accessManagement.reducer;