import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IResponseErrorModel, IModelWithPagination } from "../../types";
import { IFeeSettingsState } from "./feesettingstypes";

const initialState: IFeeSettingsState = {
    instFeeDepartmentsResp: undefined,
    addInstFeeDepartmentsResp: undefined,
    updateInstFeeDepartmentResp: undefined,
    delInstFeeDepartmentResp: undefined,

    instFeeNamesResp:undefined,
    addInstFeeNameResp:undefined,
    updateInstFeeNameResp:undefined,
    deleteInstFeeNameResp:undefined,

    instConcessionDepartmentsResp:undefined,
    instFeeNameByDeptResp:undefined,
    addInstEmployeeConcession:undefined,
    updateInstEmployeeConcession:undefined,
    instEmployeeConcessionDepartment:undefined,
    instEmployeeConcession:undefined,
    deleteInstEmployeeConcessionResp:undefined,

    // payment gateways 
    getPaymentGatewaysListResp:undefined,
    getPaymentGatewaysBranchListResp:undefined,
    savePaymentGatewaysBranchResp:undefined,

    instFeeSettingError: undefined
};

export const instFeeSettingsSlice = createSlice({
    name: 'instFeeSettings',
    initialState,
    reducers: {
        setInstFeeDepartmentsAct: (state, action: PayloadAction<any>) => {
            state.instFeeDepartmentsResp = action.payload;
        },
        setAddInstFeeDepartmentsAct: (state, action: PayloadAction<any>) => {
            state.addInstFeeDepartmentsResp = action.payload;
        },
        setUpdateInstFeeDepartmentAct: (state, action: PayloadAction<any>) => {
            state.updateInstFeeDepartmentResp = action.payload;
        },
        setDelInstFeeDepartmentAct: (state, action: PayloadAction<any>) => {
            state.delInstFeeDepartmentResp = action.payload;
        },

        setInstFeeNamesAct: (state, action: PayloadAction<any>) => {
            state.instFeeNamesResp = action.payload;
        },
        setAddInstFeeNamesAct: (state, action: PayloadAction<any>) => {
            state.addInstFeeNameResp = action.payload;
        },
        setUpdateInstFeeNameAct: (state, action: PayloadAction<any>) => {
            state.updateInstFeeNameResp = action.payload;
        },
        setDeleteInstFeeNameAct: (state, action: PayloadAction<any>) => {
            state.deleteInstFeeNameResp = action.payload;
        },

        setInstConcessionDepartmentsAct: (state, action: PayloadAction<any>) => {            
            state.instConcessionDepartmentsResp = action.payload;
        },
        setInstFeeNamesByDeptAct: (state, action: PayloadAction<any>) => {                     
            state.instFeeNameByDeptResp = action.payload;
        },
        setAddIntEmployeeConcessionAct: (state, action: PayloadAction<any>) => {                     
            state.addInstEmployeeConcession = action.payload;
        },
        setUpdateIntEmployeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.updateInstEmployeeConcession = action.payload;
        },
        setInstEmployeeConcessionDepartmentAct: (state, action: PayloadAction<any>) => {
            state.instEmployeeConcessionDepartment = action.payload;
        },
        setInstEmployeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.instEmployeeConcession = action.payload;
        },
        setDeleteInstEmployeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.deleteInstEmployeeConcessionResp = action.payload;
        },

        setPaymentGatewaysListAct : (state,action: PayloadAction<any>) => {
            state.getPaymentGatewaysListResp = action.payload
        },
        setPaymentGatewaysBranchListAct : (state,action: PayloadAction<any>) => {
            state.getPaymentGatewaysBranchListResp = action.payload
        },
        setSavePaymentGatewaysBranchAct : (state,action: PayloadAction<any>) => {
            state.savePaymentGatewaysBranchResp = action.payload
        },

        setInstFeeSettingsErrorAct: (state, action: PayloadAction<IResponseErrorModel>) => {
            state.instFeeSettingError = action.payload;
        },

    },
});

export const { setInstFeeDepartmentsAct,
    setAddInstFeeDepartmentsAct, setUpdateInstFeeDepartmentAct, setDelInstFeeDepartmentAct,
    setInstFeeNamesAct,
    setAddInstFeeNamesAct,setUpdateInstFeeNameAct,setDeleteInstFeeNameAct,
    setInstEmployeeConcessionDepartmentAct,
    setInstFeeNamesByDeptAct,
    setInstConcessionDepartmentsAct,
    setInstEmployeeConcessionAct,
    setAddIntEmployeeConcessionAct,
    setUpdateIntEmployeeConcessionAct,
    setDeleteInstEmployeeConcessionAct,
    setPaymentGatewaysListAct,
    setPaymentGatewaysBranchListAct,
    setSavePaymentGatewaysBranchAct,

    setInstFeeSettingsErrorAct
} = instFeeSettingsSlice.actions;

export default instFeeSettingsSlice.reducer;
