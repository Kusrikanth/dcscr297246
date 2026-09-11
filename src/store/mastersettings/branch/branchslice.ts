import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBranchInfo, IBranchReducerState, IAddBranch, IUpdateBranchResp } from "./branchtypes";
import { IModelWithPagination } from "../../types";

const initialState: IBranchReducerState = {
    branchListResp: undefined,
    headerBranchListResp: undefined,
    branchesWithAdminResp: undefined,
    addBranchResp: undefined,
    branchbyIdResp: undefined,
    updateBranchResp: undefined,
    approveBranchResp: undefined,
    deleteBranchResp: undefined,
    setMainBranchResp: undefined,
    branchModulesResp: undefined,
    updateBranchModuleResp: undefined,
    addBranchAdminResp: undefined,
    updateBranchAdminResp: undefined,
    branchErrorResp: undefined
};

export const branchSlice = createSlice({
    name: 'branch',
    initialState,
    reducers: {
        setInstBranchesAct: (state, action: PayloadAction<IModelWithPagination<IBranchInfo>>) => {
            state.branchListResp = action.payload
        },
        setInstHeaderBranchesAct: (state, action: PayloadAction<IModelWithPagination<IBranchInfo>>) => {
            state.headerBranchListResp = action.payload
        },
        setInstBranchesWithAdminAct: (state, action: PayloadAction<any>) => {
            state.branchesWithAdminResp = action.payload
        },
        setAddBranchAct: (state, action: PayloadAction<IAddBranch>) => {
            state.addBranchResp = action.payload
        },
        setBranchByIdAct: (state, action: PayloadAction<IUpdateBranchResp>) => {
            state.branchbyIdResp = action.payload
        },
        setUpdateBranchAct: (state, action: PayloadAction<IUpdateBranchResp>) => {
            state.updateBranchResp = action.payload
        },
        setApproveBranchAct: (state, action: PayloadAction<any>) => {
            state.approveBranchResp = action.payload
        },
        setDeleteBranchAct: (state, action: PayloadAction<any>) => {
            state.deleteBranchResp = action.payload
        },
        setMainBranchAct: (state, action: PayloadAction<any>) => {
            state.setMainBranchResp = action.payload
        },

        setGetBranchModulesAct: (state, action: PayloadAction<any>) => {
            state.branchModulesResp = action.payload
        },

        setUpdateBranchModuleAct: (state, action: PayloadAction<any>) => {
            state.updateBranchModuleResp = action.payload
        },

        setAddBranchAdminAct: (state, action: PayloadAction<any>) => {
            state.addBranchAdminResp = action.payload
        },
        setUpdateBranchAdminAct: (state, action: PayloadAction<IAddBranch>) => {
            state.updateBranchAdminResp = action.payload
        },

        setBranchErrorAct: (state, action: PayloadAction<any>) => {
            state.branchErrorResp = action.payload;
        }
    },
});

export const { setInstBranchesAct, setInstHeaderBranchesAct, setInstBranchesWithAdminAct, setAddBranchAct, setBranchByIdAct, setUpdateBranchAct,
    setApproveBranchAct,
    setDeleteBranchAct, setMainBranchAct, setGetBranchModulesAct, setUpdateBranchModuleAct,
    setAddBranchAdminAct, setUpdateBranchAdminAct,
    setBranchErrorAct } = branchSlice.actions;

export default branchSlice.reducer;
