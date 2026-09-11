import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { StockDetailsConstants } from "./stockdetailsconstants";

export { setRelocateSaveListAct } from "./stockdetailsslice"

export const getStockCheckingListAct = createAction<INewActionType | undefined>(StockDetailsConstants.GET_STOCK_CHECKING);
export const getStockCheckingDetailsListAct = createAction<INewActionType | undefined>(StockDetailsConstants.GET_STOCK_CHECKING_Details);
export const getStockVerificationListAct = createAction<INewActionType | undefined>(StockDetailsConstants.GET_STOCK_CHECKING_VERIFICATION);
export const getStockRelocateListAct = createAction<INewActionType | undefined>(StockDetailsConstants.GET_STOCK_CHECKING_RELOCATE);
export const exportStockCheckingAct = createAction<INewActionType | undefined>(StockDetailsConstants.EXPORT_STOCK_CHECKING);
export const getRelocateSaveListAct = createAction<INewActionType | undefined>(StockDetailsConstants.GET_RELOCATE_SAVE);
export const saveRelocateStockListAct = createAction<INewActionType | undefined>(StockDetailsConstants.SAVE_RELOCATE_STOCK);
