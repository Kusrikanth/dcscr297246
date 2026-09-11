import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { LibraryBookIssuanceConstants } from "./bookissuanceconstants";

export { setBookIssuanceUserTypeListAct } from "./bookissuanceslice"

//BookIssuance
export const getLibraryBookIssuanceListAct = createAction<INewActionType | undefined>(LibraryBookIssuanceConstants.GET_LIBRARY_BOOK_ISSUANCE);
export const getBookDetailByAccessionNoAct = createAction<INewActionType | undefined>(LibraryBookIssuanceConstants.GET_BOOK_DETAIL_BY_ACCESSION_NUMBER);
export const saveLibraryBookIssuanceAct = createAction<INewActionType | undefined>(LibraryBookIssuanceConstants.SAVE_LIBRARY_BOOK_ISSUANCE);
export const deleteLibraryBookIssuanceAct = createAction<INewActionType | undefined>(LibraryBookIssuanceConstants.DELETE_LIBRARY_BOOK_ISSUANCE);
export const getBookIssuanceUserTypeListAct = createAction<INewActionType | undefined>(LibraryBookIssuanceConstants.GET_USER_TYPE_LIST);
export const exportBookIssuanceAct = createAction<INewActionType | undefined>(LibraryBookIssuanceConstants.EXPORT_BOOK_ISSUANCE);
export const exportBooksOverDueAct = createAction<INewActionType | undefined>(LibraryBookIssuanceConstants.EXPORT_BOOKS_OVERDUE);

//Borrowed Books
export const getLibraryBorrowedBooksListAct = createAction<INewActionType | undefined>(LibraryBookIssuanceConstants.GET_LIBRARY_BORROWED_BOOKS_LIST);
export const exportLibraryBorrowedBooksAct = createAction<INewActionType | undefined>(LibraryBookIssuanceConstants.EXPORT_LIBRARY_BORROWED_BOOKS);

// BookRenewal
export const saveLibraryBookRenewalAct = createAction<INewActionType | undefined>(LibraryBookIssuanceConstants.SAVE_LIBRARY_BOOK_RENEWAL);

// BookIssuanceCount
export const getLibraryIssuanceStatsCountListAct = createAction<INewActionType | undefined>(LibraryBookIssuanceConstants.GET_LIBRARY_ISSUANCE_STATS);
