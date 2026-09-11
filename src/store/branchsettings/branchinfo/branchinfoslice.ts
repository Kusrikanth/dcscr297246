import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IBranchInfoReducerState } from "./branchinfotypes";

const initialState: IBranchInfoReducerState = {
    branchBankDetailsResp: undefined,
    addBranchBankDetailResp: undefined,
    updateBranchBankDetailResp: undefined,
    deleteBranchBankDetailResp: undefined,

    branchAreasResp: undefined,
    addBranchAreaResp: undefined,
    updateBranchAreaResp: undefined,
    deleteBranchAreaResp: undefined,

    contactPersonsResp: undefined,
    addContactPersonResp: undefined,
    updateContactPersonResp: undefined,
    deleteContactPersonResp: undefined,

    brchDepartmentsResp: undefined,
    addBrchDepartmentResp: undefined,
    updateBrchDepartmentResp: undefined,
    deleteBrchDepartmentResp: undefined,

    //Logo's
    brchLogosResp: undefined,
    addBrchLogoResp: undefined,
    deleteBrchLogoResp: undefined,
    
    branchInfoErrorResp: undefined,
};

export const branchInfoSlice = createSlice({
    name: 'branchInfo',
    initialState,
    reducers: {
        setBranchBankDetailsAct: (state, action: PayloadAction<any>) => {
            state.branchBankDetailsResp = action.payload;
        },
        setAddBranchBankDetailAct: (state, action: PayloadAction<any>) => {
            state.addBranchBankDetailResp = action.payload;
        },
        setUpdateBranchBankDetailAct: (state, action: PayloadAction<any>) => {
            state.updateBranchBankDetailResp = action.payload;
        },
        setDeleteBranchBankDetailAct: (state, action: PayloadAction<any>) => {
            state.deleteBranchBankDetailResp = action.payload;
        },


        setBranchBankAreasAct: (state, action: PayloadAction<any>) => {
            state.branchAreasResp = action.payload;
        },
        setAddBranchArealAct: (state, action: PayloadAction<any>) => {
            state.addBranchAreaResp = action.payload;
        },
        setUpdateBranchAreaAct: (state, action: PayloadAction<any>) => {
            state.updateBranchAreaResp = action.payload;
        },
        setDeleteBranchAreaAct: (state, action: PayloadAction<any>) => {
            state.deleteBranchAreaResp = action.payload;
        },

        setContactPersonsAct: (state, action: PayloadAction<any>) => {
            state.contactPersonsResp = action.payload;
        },
        setAddContactPersonAct: (state, action: PayloadAction<any>) => {
            state.addContactPersonResp = action.payload;
        },
        setUpdateContactPersonAct: (state, action: PayloadAction<any>) => {
            state.updateContactPersonResp = action.payload;
        },
        setDeleteContactPersonAct: (state, action: PayloadAction<any>) => {
            state.deleteContactPersonResp = action.payload;
        },

        setBrchDepartmentsAct: (state, action: PayloadAction<any>) => {
            state.brchDepartmentsResp = action.payload;
        },
        setAddBrchDepartmentAct: (state, action: PayloadAction<any>) => {
            state.addBrchDepartmentResp = action.payload;
        },
        setUpdateBrchDepartmentAct: (state, action: PayloadAction<any>) => {
            state.updateBrchDepartmentResp = action.payload;
        },
        setDeleteBrchDepartmentAct: (state, action: PayloadAction<any>) => {
            state.deleteBrchDepartmentResp = action.payload;
        },

        //Logo's
        setBrchLogosAct: (state, action: PayloadAction<any>) => {
            state.brchLogosResp = action.payload;
        },
        setAddBrchLogosAct: (state, action: PayloadAction<any>) => {
            state.addBrchLogoResp = action.payload;
        },
        setDeleteBrchLogosAct: (state, action: PayloadAction<any>) => {
            state.deleteBrchLogoResp = action.payload;
        },
        setBranchInfoErrorAct: (state, action: PayloadAction<any>) => {
            state.branchInfoErrorResp = action.payload;
        },

    },
});

export const { setBranchBankDetailsAct, setAddBranchBankDetailAct,
    setUpdateBranchBankDetailAct, setDeleteBranchBankDetailAct,
    setBranchBankAreasAct, setAddBranchArealAct, setUpdateBranchAreaAct,
    setDeleteBranchAreaAct,

    setContactPersonsAct, setAddContactPersonAct, setUpdateContactPersonAct, setDeleteContactPersonAct,

    setBrchDepartmentsAct, setAddBrchDepartmentAct, setUpdateBrchDepartmentAct, setDeleteBrchDepartmentAct, setBrchLogosAct, setAddBrchLogosAct, setDeleteBrchLogosAct,
    setBranchInfoErrorAct
} = branchInfoSlice.actions;

export default branchInfoSlice.reducer;
