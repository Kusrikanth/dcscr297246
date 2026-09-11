import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { LibraryBookReturnConstants } from "./bookreturnconstants";

//Book Return

export const getLibraryBookReturnListAct = createAction<INewActionType | undefined>(LibraryBookReturnConstants.GET_LIBRARY_BOOK_RETURN);
export const getBookReturnStuListAct = createAction<INewActionType | undefined>(LibraryBookReturnConstants.GET_BOOK_RETURN_STU_LIST);
export const saveLibraryBookReturnAct = createAction<INewActionType | undefined>(LibraryBookReturnConstants.SAVE_LIBRARY_BOOK_RETURN);
export const getBookReturnEmployeeListAct = createAction<INewActionType | undefined>(LibraryBookReturnConstants.GET_BOOK_RETURN_EMPLOYEE_LIST);
export const getBookReturnRecommendListAct = createAction<INewActionType | undefined>(LibraryBookReturnConstants.GET_BOOK_RETURN_RECOMMEND_LIST);
export const getBookListReturnForStudentAct = createAction<INewActionType | undefined>(LibraryBookReturnConstants.GET_BOOK_LIST_RETURN_FOR_STUDENT);
export const getBookListReturnForEmployeeAct = createAction<INewActionType | undefined>(LibraryBookReturnConstants.GET_BOOK_LIST_RETURN_FOR_EMPLOYEE);
export const getBookListReturnForRecommendAct = createAction<INewActionType | undefined>(LibraryBookReturnConstants.GET_BOOK_LIST_RETURN_FOR_RECOMMEND);
export const exportBookReturnAct = createAction<INewActionType | undefined>(LibraryBookReturnConstants.EXPORT_BOOK_RETURN);
export const getBookReturnListByAccessionNoAct = createAction<INewActionType | undefined>(LibraryBookReturnConstants.GET_BOOK_LIST_BY_ACCESSION_NO);

export const getLibraryBookReturnSaveListAct = createAction<INewActionType | undefined>(LibraryBookReturnConstants.GET_LIBRARY_BOOK_RETURN_SAVE_LIST);
//library Tc
export const getLibraryTcDetailsListAct = createAction<INewActionType | undefined>(LibraryBookReturnConstants.GET_LIBRARY_TC_DETAILS);
