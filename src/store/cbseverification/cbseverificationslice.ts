import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICbseVerificationReducerState } from "./cbseverificationtypes";

const initialState: ICbseVerificationReducerState = {
    cbseVerificationsResp: undefined,
    addCbseVerificationResp: undefined,
    studentSubjectsResp: undefined,
    cbseVerificationErrorResp: undefined,
}

export const cbseVerification = createSlice({
    name: "cbseVerification",
    initialState,
    reducers: {
        setCbseVerificationsAct: (state, action: PayloadAction<any>) => {
            state.cbseVerificationsResp = action.payload;
        },
        setAddCbseVerificationAct: (state, action: PayloadAction<any>) => {
            state.addCbseVerificationResp = action.payload;
        },
        setStudentSubjectsAct: (state, action: PayloadAction<any>) => {
            state.studentSubjectsResp = action.payload;
        },
        setCbseVerificationErrorAct: (state, action: PayloadAction<any>) => {
            state.cbseVerificationErrorResp = action.payload;
        }
    }
})

export const {
    setCbseVerificationsAct,
    setAddCbseVerificationAct, setStudentSubjectsAct,
    setCbseVerificationErrorAct
} = cbseVerification.actions;

export default cbseVerification.reducer;