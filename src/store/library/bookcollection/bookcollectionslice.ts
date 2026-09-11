import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISettingsListReducerState } from "./bookcollectiontypes";
import { IModelWithPagination } from "../../types";

const initialState: ISettingsListReducerState = {
    //libraryBookCollection 
    libraryBookCollectionRequestListResp: undefined,
    getLibraryBookCollectionListByIdResp: undefined,
    saveLibraryBookCollectionResp: undefined,
    editLibraryBookCollectionRequestResp: undefined,
    deleteLibraryBookCollectionResp: undefined,
    exportLibraryBookCollectionResp: undefined,
    bulkUploadLibraryBookCollectionResp: undefined,
    downloadStaticLibraryBookCollectionResp: undefined,

    //Stats
    libraryCollectionStatsRequestListResp: undefined,
    //Error
    libraryBookCollectionErrorAct: undefined,

    //Dashboard
    getLibraryDashboardDataResp: undefined,
    getStockVerificationResp: undefined,
    getBookCirculationAnalysisResp: undefined,
    getLibrarySummaryResp: undefined,
}

export const libraryBookCollection = createSlice({
    name: "libraryBookCollection",
    initialState,
    reducers: {
        // libraryBookCollection

        setLibraryBookCollectionListAct: (state, action: PayloadAction<any>) => {
            state.libraryBookCollectionRequestListResp = action.payload;
        },
        setLibraryBookCollectionListByIdAct: (state, action: PayloadAction<any>) => {
            state.getLibraryBookCollectionListByIdResp = action.payload;
        },
        setDeleteLibraryBookCollectionAct: (state, action: PayloadAction<any>) => {
            state.deleteLibraryBookCollectionResp = action.payload;
        },
        setSaveLibraryBookCollectionListAct: (state, action: PayloadAction<any>) => {
            state.saveLibraryBookCollectionResp = action.payload;
        },
        setEditLibraryBookCollectionListAct: (state, action: PayloadAction<any>) => {
            state.editLibraryBookCollectionRequestResp = action.payload;
        },
        setExportLibraryBookCollectionAct: (state, action: PayloadAction<any>) => {
            state.exportLibraryBookCollectionResp = action.payload;
        },

        setBulkUploadLibraryBookCollectionAct: (state, action: PayloadAction<any>) => {
            state.bulkUploadLibraryBookCollectionResp = action.payload;
        },
        setDownloadStaticLibraryBookCollectionAct: (state, action: PayloadAction<any>) => {
          state.downloadStaticLibraryBookCollectionResp = action.payload;
        },
        
        //stats
        setLibraryCollectionStatsListAct: (state, action: PayloadAction<any>) => {
            state.libraryCollectionStatsRequestListResp = action.payload;
        },

        // Error
        setLibraryBookCollectionErrorAct: (state, action: PayloadAction<any>) => {
            state.libraryBookCollectionErrorAct = action.payload;
        },

        //Dashboard
        setLibraryDashboardDataAct: (state, action: PayloadAction<any>) => {
            state.getLibraryDashboardDataResp = action.payload;
        },
        setStockVerificationAct: (state, action: PayloadAction<any>) => {
            state.getStockVerificationResp = action.payload;
        },
        resetStockVerificationAct: (state, action: PayloadAction<any>) => {
            state.getStockVerificationResp = action.payload;
        },
        setBookCirculationAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getBookCirculationAnalysisResp = action.payload;
        },
        setLibrarySummaryAct: (state, action: PayloadAction<any>) => {
            state.getLibrarySummaryResp = action.payload;
        },
    }
})

export const {
    //libraryBookCollection
    setLibraryBookCollectionListAct,
    setLibraryBookCollectionListByIdAct,
    setSaveLibraryBookCollectionListAct,
    setEditLibraryBookCollectionListAct,
    setDeleteLibraryBookCollectionAct,
    setExportLibraryBookCollectionAct,
    setBulkUploadLibraryBookCollectionAct,
    setDownloadStaticLibraryBookCollectionAct,
    setLibraryCollectionStatsListAct,
    //Error
    setLibraryBookCollectionErrorAct,
    setLibraryDashboardDataAct,
    setStockVerificationAct,
    resetStockVerificationAct,
    setBookCirculationAnalysisAct,
    setLibrarySummaryAct,


} = libraryBookCollection.actions;

export default libraryBookCollection.reducer;