import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    IRegistrationInstructionInitialState
} from "./registrationinstructiontype";

const initialState: IRegistrationInstructionInitialState = {
    getRegistrationInstructionResp: undefined,
    registrationInstructionErrorResp: undefined,
    updateRegistrationInstructionResp: undefined,
    saveRegistrationInstructionResp: undefined,
    getRegistrationInstructionHtmlByIdResp: undefined,
    deleteRegistrationInstructionResp: undefined,
};


export const registrationInstruction = createSlice({
    name: "registrationInstruction",
    initialState,
    reducers: {
        setRegistrationInstructionAct: (state, action: PayloadAction<any>) => {
            state.getRegistrationInstructionResp = action.payload;
        },
        setRegistrationInstructionErrorAct: (state, action: PayloadAction<any>) => {
            state.registrationInstructionErrorResp = action.payload;
        },
        setUpdateRegistrationInstructionAct: (state, action: PayloadAction<any>) => {
            state.updateRegistrationInstructionResp = action.payload;
        },
        setSaveRegistrationInstructionAct: (state, action: PayloadAction<any>) => {
            state.saveRegistrationInstructionResp = action.payload;
        },
        setGetRegistrationInstructionHtmlByIdAct: (state, action: PayloadAction<any>) => {
            state.getRegistrationInstructionHtmlByIdResp = action.payload;
        },
        setResetRegistrationInstructionHtmlByIdAct: (state, action: PayloadAction<any>) => {
            state.getRegistrationInstructionHtmlByIdResp = action.payload;
        },
        setDeleteRegistrationInstructionAct: (state, action: PayloadAction<any>) => {
            state.deleteRegistrationInstructionResp = action.payload;
        },
    }
});


export const {
    setRegistrationInstructionAct,
    setRegistrationInstructionErrorAct,
    setUpdateRegistrationInstructionAct,
    setSaveRegistrationInstructionAct,
    setGetRegistrationInstructionHtmlByIdAct,
    setResetRegistrationInstructionHtmlByIdAct,
    setDeleteRegistrationInstructionAct
} = registrationInstruction.actions;

export default registrationInstruction.reducer;



