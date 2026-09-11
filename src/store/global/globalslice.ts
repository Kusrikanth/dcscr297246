import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IGlobalState {
    showApiLoader: boolean,
    registrationTabId: string,
    transportationTabId : string,
    hostelAdmissionTabId : string,
    paymentReconciliationTabId: string,
    loginHistoryId: string,
}

const initialState: IGlobalState = {
    showApiLoader: false,
    registrationTabId: "",
    transportationTabId : "",
    hostelAdmissionTabId : "",
    paymentReconciliationTabId: "",
    loginHistoryId: "",
};

export const globalSlice = createSlice({
    name: 'globalData',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setShowGlobalLoaderAct: (state, action: PayloadAction<any>) => {
            state.showApiLoader = action.payload;
        },
        setRegistrationTabIdAct: (state, action: PayloadAction<any>) => {
            state.registrationTabId = action.payload;
        },
        setTransportationTabIdAct: (state, action: PayloadAction<any>) => {
            state.transportationTabId = action.payload;
        },
        setHostelAdmissionTabIdAct: (state, action: PayloadAction<any>) => {
            state.hostelAdmissionTabId = action.payload;
        },
        setPaymentReconciliationTabIdAct: (state, action: PayloadAction<any>) => {
            state.paymentReconciliationTabId = action.payload;
        },
        setLoginHistoryAct: (state, action: PayloadAction<any>) => {
            state.loginHistoryId = action.payload;
        }
    },
});

export const { setShowGlobalLoaderAct, setRegistrationTabIdAct , setTransportationTabIdAct , setHostelAdmissionTabIdAct,setPaymentReconciliationTabIdAct, setLoginHistoryAct } = globalSlice.actions;
export default globalSlice.reducer;
