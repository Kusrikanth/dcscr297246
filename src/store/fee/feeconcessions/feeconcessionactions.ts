
import { createAction } from "@reduxjs/toolkit";
import { FeeConcessionConstants } from "./feeconcessionconstants";
import { INewActionType } from "../../types";

export {setPreviousStudentConcessionAct , setPrevStuConcessionListV2Act, blukUploadConcessionError} from "./feeconcessionslice";
export const getStudentConcessionListAct = createAction<INewActionType | undefined>(FeeConcessionConstants.STUDENT_CONCESSION_LIST);
export const getStudentConcessionById = createAction<INewActionType | undefined>(FeeConcessionConstants.STUDENT_CONCESSION_BY_ID);
export const getPreviousStudentConcessionAct = createAction<INewActionType | undefined>(FeeConcessionConstants.PREVIOUS_STUDENT_CONCESSION);
export const addStudentConcessionAct = createAction<INewActionType | undefined>(FeeConcessionConstants.ADD_STUDENT_CONCESSION);
export const editStudentConcessionAct = createAction<INewActionType | undefined>(FeeConcessionConstants.EDIT_STUDENT_CONCESSION);
export const getConcessionLedgerDetailsAct = createAction<INewActionType | undefined>(FeeConcessionConstants.CONCESSION_LEDGER_DETAILS);
export const getTutionFeeConcessionListAct = createAction<INewActionType | undefined>(FeeConcessionConstants.TUTION_FEE_CONCESSION_LIST);
export const getTutionFeeConcessionByIdAct = createAction<INewActionType | undefined>(FeeConcessionConstants.TUTION_FEE_CONCESSION_BY_ID);
export const addTutionFeeConcessionAct = createAction<INewActionType | undefined>(FeeConcessionConstants.ADD_TUTION_FEE_CONCESSION);
export const editTutionFeeConcessionAct = createAction<INewActionType | undefined>(FeeConcessionConstants.EDIT_TUTION_FEE_CONCESSION);
export const getEmployeeConcessionListAct = createAction<INewActionType | undefined>(FeeConcessionConstants.EMPLOYEE_CONCESSION_LIST);
export const deleteFeeConcessionListAct = createAction<INewActionType | undefined>(FeeConcessionConstants.DELETE_FEE_CONCESSION_LIST);
export const deleteStuConcessionListAct = createAction<INewActionType | undefined>(FeeConcessionConstants.DELETE_STUDENT_CONCESSION_LIST);
export const bulkUploadConcessionAct = createAction<INewActionType | undefined>(FeeConcessionConstants.BULK_UPLOAD_CONCESSION);

export const exportStuConcessionAct = createAction<INewActionType | undefined>(FeeConcessionConstants.EXPORT_STU_CONCESSION);
export const exportTutionFeeConcessionAct = createAction<INewActionType | undefined>(FeeConcessionConstants.EXPORT_TUTION_FEE_CONCESSION);

// Student Concession Updated

export const getStuConcessionListV2Act = createAction<INewActionType | undefined>(FeeConcessionConstants.GET_STU_CONCESSION_LIST_V2);
export const deleteStuConcessionListV2Act = createAction<INewActionType | undefined>(FeeConcessionConstants.DELETE_STU_CONCESSION_LIST_V2);
export const saveStuConcessionListV2Act = createAction<INewActionType | undefined>(FeeConcessionConstants.SAVE_STU_CONCESSION_LIST_V2);
export const editStuConcessionListV2Act = createAction<INewActionType | undefined>(FeeConcessionConstants.EDIT_STU_CONCESSION_LIST_V2);
export const getStuConcessionV2ByIdAct = createAction<INewActionType | undefined>(FeeConcessionConstants.STU_CONCESSION_LIST_V2_BY_ID);
export const exportStuConcessionV2Act = createAction<INewActionType | undefined>(FeeConcessionConstants.EXPORT_STU_CONCESSION_LIST_V2);
export const bulkUploadConcessionV2Act = createAction<INewActionType | undefined>(FeeConcessionConstants.BULK_UPLOAD_CONCESSION_V2);
export const getPrevStuConcessionListV2Act = createAction<INewActionType | undefined>(FeeConcessionConstants.PREV_STU_CONCESSION_LIST_V2);