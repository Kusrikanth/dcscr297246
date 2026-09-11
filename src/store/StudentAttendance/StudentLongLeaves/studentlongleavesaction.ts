import {createAction} from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { StudentLongLeavesConstants } from "./studentlongleavesconstants";


export const getStuLongLeavesListAct = createAction<INewActionType | undefined>(StudentLongLeavesConstants.GET_STU_LONG_LEAVES_LIST);
export const saveStuLongLeavesAct = createAction<INewActionType | undefined>(StudentLongLeavesConstants.SAVE_STU_LONG_LEAVES);
export const deleteStuLongLeavesAct = createAction<INewActionType | undefined>(StudentLongLeavesConstants.DELETE_STU_LONG_LEAVES);
export const editStuLongLeavesAct = createAction<INewActionType | undefined>(StudentLongLeavesConstants.EDIT_STU_LONG_LEAVES);
export const getStuLongLeavesByIdAct = createAction<INewActionType | undefined>(StudentLongLeavesConstants.GET_STU_LONG_LEAVES_BY_ID);
export const searchStuLongLeavesAct = createAction<INewActionType | undefined>(StudentLongLeavesConstants.SEARCH_STU_LONG_LEAVES);
export const approveStuLongLeavesAct = createAction<INewActionType | undefined>(StudentLongLeavesConstants.APPROVE_STU_LONG_LEAVES);
