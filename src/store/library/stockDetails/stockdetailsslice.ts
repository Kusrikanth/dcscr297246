import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStockCheckingListReducerState } from "./stockdetailstype";

const initialState: IStockCheckingListReducerState = {
    
    stockCheckingRequestListResp: undefined,
    stockCheckingDetailsRequestListResp: undefined,
    stockRecloateRequestListResp: undefined,
    stockVerificationRequestListResp: undefined,
    exportStockCheckingResp: undefined,
    stockRelocateSaveRequestListResp: undefined,
    saveRelocateStockRequestListResp: undefined,

    //Error
    stockCheckingErrorAct: undefined,
}

export const stockChecking = createSlice({
    name: "stockChecking",
    initialState,
    reducers: {

        setStockCheckingListAct: (state, action: PayloadAction<any>) => {
            state.stockCheckingRequestListResp = action.payload;
        },
        setStockCheckingDetailsListAct: (state, action: PayloadAction<any>) => {
            state.stockCheckingDetailsRequestListResp = action.payload;
        },
        setStockRelocateListAct: (state, action: PayloadAction<any>) => {
            state.stockRecloateRequestListResp = action.payload;
        },
        setStockVerificationListAct: (state, action: PayloadAction<any>) => {
            state.stockVerificationRequestListResp = action.payload;
        },
        
        setExportStockCheckingAct: (state, action: PayloadAction<any>) => {
            state.exportStockCheckingResp = action.payload;
        },
        setRelocateSaveListAct: (state, action: PayloadAction<any>) => {
            state.stockRelocateSaveRequestListResp = action.payload;
        },
        setSaveRelocateStockListAct: (state, action: PayloadAction<any>) => {
            state.saveRelocateStockRequestListResp = action.payload;
        },

        //reset
        resetStockRelocateSaveRequestAct: (state, action: PayloadAction<any>) => {
            state.stockRelocateSaveRequestListResp = action.payload
        },
        // Error
        setStockCheckingErrorAct: (state, action: PayloadAction<any>) => {
            state.stockCheckingErrorAct = action.payload;
        }


    }
})

export const {
    //libraryBookCollection
    setStockCheckingListAct,
    setStockCheckingDetailsListAct,
    setStockRelocateListAct,
    setStockVerificationListAct,
    setExportStockCheckingAct,
    setRelocateSaveListAct,
    setSaveRelocateStockListAct,
    //reset
    resetStockRelocateSaveRequestAct,
    //Error
    setStockCheckingErrorAct,


} = stockChecking.actions;

export default stockChecking.reducer;