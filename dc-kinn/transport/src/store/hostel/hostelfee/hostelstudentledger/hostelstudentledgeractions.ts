

import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../../types";
import { HostelStudentLedgerConstants } from "./hostelstudentledgerconstants";

export { setHostelStuLedgerDetailsAct, setHostelPayfeeDetailsAct } from "./hostelstudentledgerslice";
export const getHostelStuLedgerListAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_STU_LEDGER_LIST);
export const getHostelStuLedgerDetailsAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.HOSTEL_STU_LEDGER_DETAILS);
export const getHostelChequeClearanceListAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.HOSTEL_CHEQUE_CLEARANCE_LIST);
export const downloadHostelFeeReceiptAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.DOWNLOAD_HOSTEL_FEE_RECEIPT);
export const exportHostelStuLedgerAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.EXPORT_HOSTEL_STU_LEDGER_LIST);
export const getHostelStudentAvailabilityAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_STUDENT_AVAILABILITY);
export const notifyHostelDueFeePaymentAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.NOTIFY_HOSTEL_DUEFEE_PAYMENT_REQUEST);
export const exportHostelDueFeePaymentAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.EXPORT_HOSTEL_DUEFEE_PAYMENT_REQUEST);

//Parent Hostel Fee
export const getHostelPayfeeDetailsAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_PAY_FEE_DETAILS);


//Hostel Concession
export const exportHostelConcessionAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.EXPORT_HOSTEL_CONCESSION);
export const deleteHostelConcessionAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.DELETE_HOSTEL_CONCESSION);

//Hostel Fee Recipts
export const exportHostelFeeReceiptAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.EXPORT_HOSTEL_FEE_RECEIPT);

//Hostel Cheque Clearence
export const exportHostelChequeClearanceAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.EXPORT_HOSTEL_CHEQUE_CLEARENCE);

//Hostel Fee Reversal
export const exportHostelFeeReversalAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.EXPORT_HOSTEL_FEE_REVERSAL);

//Hostel Shortlist
export const exportHostelShortlistAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.EXPORT_HOSTEL_SHORTLIST);

// Hostel Fee Refunds

export const getHostelFeeRefundsListAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_FEE_REFUNDS_LIST);
export const exportHostelFeeRefundsAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.EXPORT_HOSTEL_FEE_REFUNDS);

// Hostel Fee Fine
export const getHostelFeeFineListAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_FEE_FINE_LIST);
export const getHostelFeeNamesAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_FEE_NAMES);
export const addHostelFeeFinesAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.ADD_HOSTEL_FEE_FINE);
export const delHostelFeeFineAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.DELETE_HOSTEL_FEE_FINE);
export const updateHostelFeeFineAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.UPDATE_HOSTEL_FEE_FINE);
