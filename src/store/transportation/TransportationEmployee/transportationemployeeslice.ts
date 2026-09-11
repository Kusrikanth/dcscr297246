import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITransportEmployeeReducerState } from "./transportationemployeetypes";

const initialState: ITransportEmployeeReducerState = {
    transportEmployeesResp: undefined,
    addTransportEmployeeResp: undefined,
    transportEmployeeByidResp: undefined,
    updateTransportEmployeeResp: undefined,
    updateTransempActinactResp: undefined,
    deleteTransportEmployeeResp: undefined,
    getEmployeeTypeListResp: undefined,
    getAadharValidationResp: undefined,
    exportTransportEmployeeResp: undefined,
    transportEmployeeErrorResp: undefined,
}

export const transportEmployee = createSlice({
    name: "transportemployee",
    initialState,
    reducers: {
        setTransportEmployeesAct: (state, action: PayloadAction<any>) => {
            state.transportEmployeesResp = action.payload;
        },
        setAddTransportEmployeeAct: (state, action: PayloadAction<any>) => {
            state.addTransportEmployeeResp = action.payload;
        },
        setTransportEmployeeByidAct: (state, action: PayloadAction<any>) => {
            state.transportEmployeeByidResp = action.payload;
        },
        setUpdateTransportEmployeeAct: (state, action: PayloadAction<any>) => {
            state.updateTransportEmployeeResp = action.payload;
        },
        setUpdateTransempActinactAct: (state, action: PayloadAction<any>) => {
            state.updateTransempActinactResp = action.payload;
        },
        setDeleteTransportEmployeeAct: (state, action: PayloadAction<any>) => {
            state.deleteTransportEmployeeResp = action.payload;
        },
        setEmployeeTypeListAct: (state, action: PayloadAction<any>) => {
            state.getEmployeeTypeListResp = action.payload;
        },
        setAadharValidationAct: (state, action: PayloadAction<any>) => {
            state.getAadharValidationResp = action.payload;
        },
        setExportTransportEmployeeAct: (state, action: PayloadAction<any>) => {
            state.exportTransportEmployeeResp = action.payload;
        },
        setTransportEmployeeErrorAct: (state, action: PayloadAction<any>) => {
            state.transportEmployeeErrorResp = action.payload;
        }

    }
})

export const {
    setTransportEmployeesAct,
    setAddTransportEmployeeAct, setTransportEmployeeByidAct,
    setUpdateTransportEmployeeAct, setUpdateTransempActinactAct,
    setDeleteTransportEmployeeAct,
    setEmployeeTypeListAct,
    setAadharValidationAct,
    setExportTransportEmployeeAct,
    setTransportEmployeeErrorAct
} = transportEmployee.actions;

export default transportEmployee.reducer;