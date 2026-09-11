import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISettingsListReducerState } from "./bookissuancetypes";
import { IModelWithPagination } from "../../types";

const initialState: ISettingsListReducerState = {
    //libraryBookIssuance 
    libraryBookIssuanceRequestListResp: undefined,
    getBookDetailByAccessionNoResp: undefined,
    saveLibraryBookIssuanceResp: undefined,
    deleteLibraryBookIssuanceResp: undefined,
    getBookIssuanceUserTypeListResp: undefined,
    getExportBookIssuanceResp: undefined,
    getExportBooksOverDueResp: undefined,

    // Borrowed Books
    getLibraryBorrowedBooksListResp: undefined,
    exportLibraryBorrowedBooksResp: undefined,

    // library book renewal
    saveLibraryBookRenewalResp: undefined,

    //Stats
    libraryIssuanceStatsRequestListResp: undefined,

    //Error
    libraryBookIssuanceErrorAct: undefined,
}

export const libraryBookIssuance = createSlice({
    name: "libraryBookIssuance",
    initialState,
    reducers: {
        // libraryBookIssuance

        setLibraryBookIssuanceListAct: (state, action: PayloadAction<any>) => {
            state.libraryBookIssuanceRequestListResp = action.payload;
        },
        resetLibraryListAct: (state, action: PayloadAction<any>) => {
            state.libraryBookIssuanceRequestListResp = action.payload
        },
        setBookDetailByAccessionNoAct: (state, action: PayloadAction<any>) => {
            state.getBookDetailByAccessionNoResp = action.payload
        },
        setSaveLibraryBookIssuanceAct: (state, action: PayloadAction<any>) => {
            state.saveLibraryBookIssuanceResp = action.payload
        },
        setDeleteLibraryBookIssuanceAct: (state, action: PayloadAction<any>) => {
            state.deleteLibraryBookIssuanceResp = action.payload
        },
        setBookIssuanceUserTypeListAct: (state, action: PayloadAction<any>) => {
            state.getBookIssuanceUserTypeListResp = action.payload
        },
        setExportBookIssuanceAct: (state, action: PayloadAction<any>) => {
            state.getExportBookIssuanceResp = action.payload;
        },
        setExportBookOverDueAct: (state, action: PayloadAction<any>) => {
            state.getExportBooksOverDueResp = action.payload;
        },

        // Borrowed Books
        setLibraryBorrowedBooksListAct: (state, action: PayloadAction<any>) => {
            state.getLibraryBorrowedBooksListResp = action.payload;
        },
        setExportLibraryBorrowedBooksAct: (state, action: PayloadAction<any>) => {
            state.exportLibraryBorrowedBooksResp = action.payload;
        },

        // library book renewal 
        setSaveLibraryBookRenewalAct: (state, action: PayloadAction<any>) => {
            state.saveLibraryBookRenewalResp = action.payload
        },

        //stats
        setLibraryIssuanceStatsListAct: (state, action: PayloadAction<any>) => {
            state.libraryIssuanceStatsRequestListResp = action.payload;
        },
        // Error
        setLibraryBookIssuanceErrorAct: (state, action: PayloadAction<any>) => {
            state.libraryBookIssuanceErrorAct = action.payload;
        }


    }
})

export const {
    
    //libraryBookIssuance
    setLibraryBookIssuanceListAct,
    resetLibraryListAct,
    setBookDetailByAccessionNoAct,
    setSaveLibraryBookIssuanceAct,
    setDeleteLibraryBookIssuanceAct,
    setBookIssuanceUserTypeListAct,
    setExportBookIssuanceAct,
    setExportBookOverDueAct,

    //Borrowed Books
    setLibraryBorrowedBooksListAct,
    setExportLibraryBorrowedBooksAct,

    //stats
    setLibraryIssuanceStatsListAct,
    // library book renewal 
    setSaveLibraryBookRenewalAct,

    //Error
    setLibraryBookIssuanceErrorAct,


} = libraryBookIssuance.actions;

export default libraryBookIssuance.reducer;