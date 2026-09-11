import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBookRenewalListReducerState } from "./bookrenewaltypes";
import { IModelWithPagination } from "../../types";

const initialState: IBookRenewalListReducerState = {
    //libraryBook Renewal 
    libraryBookRenewalRequestListResp: undefined,

    //Error
    libraryBookRenewalErrorResp: undefined,
}

export const libraryBookRenewal = createSlice({
    name: "libraryBookRenewal",
    initialState,
    reducers: {
        // library Book Renewal

        setLibraryBookRenewalRequestListAct: (state, action: PayloadAction<any>) => {
            state.libraryBookRenewalRequestListResp = action.payload;
        },

        // Error
        setLibraryBookRenewalErrorAct: (state, action: PayloadAction<any>) => {
            state.libraryBookRenewalErrorResp = action.payload;
        }


    }
})

export const {
    //library Book Renewal
    setLibraryBookRenewalRequestListAct,
    
    //Error
    setLibraryBookRenewalErrorAct,


} = libraryBookRenewal.actions;

export default libraryBookRenewal.reducer;