import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import {  LibraryBookCollectionConstants } from "./bookcollectionconstants";

export { setLibraryBookCollectionListByIdAct, resetStockVerificationAct } from "./bookcollectionslice"

//BookCollection
export const getLibraryBookCollectionListAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.GET_LIBRARY_BOOK_COLLECTION);
export const getLibraryBookCollectionByIdAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.GET_LIBRARY_BOOK_COLLECTION_BY_ID);
export const saveLibraryBookCollectionAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.SAVE_LIBRARY_BOOK_COLLECTION);
export const editLibraryBookCollectionAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.EDIT_LIBRARY_BOOK_COLLECTION);
export const deleteLibraryBookCollectionAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.DELETE_LIBRARY_BOOK_COLLECTION);
export const exportLibraryBookCollectionAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.EXPORT_LIBRARY_BOOK_COLLECTION);
export const bulkUploadLibraryBookCollectionAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.BULK_UPLOAD_LIBRARY_BOOK_COLLECTION);
export const downloadLibraryBookCollectionFormAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.DOWNLOAD_LIBRARY_BOOK_COLLECTION_FORM);
// BookCollectionCount
export const getLibraryCollectionStatsCountListAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.GET_LIBRARY_COLLECTION_STATS);

//Dashboard
export const getLibraryDashboardDataAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.GET_LIBRARY_DASHBOARD_DATA);
export const getStockVerificationAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.GET_STOCK_VERIFICATION);
export const getBookCirculationAnalysisAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.GET_BOOK_CIRCULATION);
export const getLibrarySummaryAct = createAction<INewActionType | undefined>(LibraryBookCollectionConstants.GET_LIBRARY_SUMMARY);
