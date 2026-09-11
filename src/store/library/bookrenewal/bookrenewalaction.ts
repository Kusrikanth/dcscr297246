import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { LibraryBookRenewalConstants } from "./bookrenewalconstants";

//Book Renewal

export const getLibraryBookRenewalListAct = createAction<INewActionType | undefined>(LibraryBookRenewalConstants.GET_LIBRARY_BOOK_RENEWAL);