
import { createAction } from "@reduxjs/toolkit";
import { FeeApprovalsConstants } from "./feeapprovalconstants";
import { INewActionType } from "../../types";


export {
    resetStudentLedgerItFormAct, resetStudentFeeItFormAct,
    setChequeHistoryAct,
    setChequeAdvanceFilterClassAct
} from './feeapprovalsslice';
export const getRequestItFormActList = createAction<INewActionType | undefined>(FeeApprovalsConstants.GET_REQUEST_ITFORM_REQUEST_LIST);
export const getRequestItFormCount = createAction<INewActionType | undefined>(FeeApprovalsConstants.GET_REQUEST_ITFORM_COUNT);
export const getIssuedItFormActList = createAction<INewActionType | undefined>(FeeApprovalsConstants.GET_ISSUED_ITFORM_REQUEST_LIST);
export const getRejectItFormActList = createAction<INewActionType | undefined>(FeeApprovalsConstants.GET_REJECTED_ITFORM_REQUEST_LIST);
export const addNewRequesrItFormAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.ADD_NEW_REQUEST_ITFORM_REQUEST);
export const approveRejectItFormAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.APPROVE_REJECT_ITFORM_REQUEST);
export const itFormListByStudentIdGen = createAction<INewActionType | undefined>(FeeApprovalsConstants.ITFORM_BY_STUDENTID_REQUEST);

export const downloadItFormAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.DOWNLOAD_ITFORM_REQUEST);
export const previewItFormAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.PREVIEW_IT_FORM);
export const sentItFormAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.SENT_IT_FORM);

export const getStudentFeeItFormAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.GET_STUDENT_FEE_ITFORM_REQUEST);
export const getStudentLedgerItFormAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.GET_STUDENT_LEDGER_ITFORM_REQUEST);
export const getStudentsItFromAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.GET_STUDENTS_ITFORM_REQUEST);

// export const getAdmissionWithdrawalAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.GET_ADMISSION_WITHDRAWAL_REQUEST);
// export const addAdmissionWithdrawalAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.ADD_ADMISSION_WITHDRAWAL_REQUEST);


export const getChequeHistoryAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.GET_CHEQUE_HISTORY_REQUEST);
export const approveRejectChequeAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.APPROVE_REJECT_CHEQUE_REQUEST);
export const chequeAdvanceFilterClassAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.CHEQUE_ADVANCE_FILTER_CLASS_REQUEST);

export const getFeeCashPaymentsAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.FEE_CASH_PAYMENTS);
export const approveFeeCashFormAct = createAction<INewActionType | undefined>(FeeApprovalsConstants.FEE_CASH_APPROVAL);
export const exportFeeChequeListAct =createAction<INewActionType | undefined>(FeeApprovalsConstants.EXPORT_FEE_CHEQUE_LIST);
export const updateItFormAct =createAction<INewActionType | undefined>(FeeApprovalsConstants.UPDATE_IT_FORM);
