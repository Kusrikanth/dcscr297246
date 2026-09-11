import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    IFeeApprovalsInitialState
} from "./feeapprovalstypes";

const initialState: IFeeApprovalsInitialState = {
    requestITFormListResp: undefined,
    requestITFormCountResp: undefined,
    issuedITFormListResp: undefined,
    rejectITFormListResp: undefined,
    addRequestItFormResp: undefined,
    approveRejectItFormResp: undefined,
    itFormListByStudentIdResp: undefined,
    studentFeeItFormResp: undefined,
    studentLedgerItFormResp: undefined,
    getStudentsItFormResp: undefined,
    downloadItFormResp: undefined,
    previewItFormResp: undefined,
    sentItFormResp: undefined,
    admissionWithdrawalResp: undefined,
    addAdmissionWithdrawalResp: undefined,
    chequeHistoryResp: undefined,
    approvRejectChequeResp: undefined,
    chequeAdvanceFilterClassResp: undefined,
    feeApprovalsErrorResp: undefined,
    feecashPaymentsResp: undefined,
    approveFeeCashPaymentResp: undefined,
    exportFeeChequeResp: undefined,
    updateItFormResp: undefined,
    itFormErrorResp: undefined  
};


export const feeApprovals = createSlice({
    name: "feeapprovals",
    initialState,
    reducers: {
        setRequestItFormListAct: (state, action: PayloadAction<any>) => {
            state.requestITFormListResp = action.payload;
        },
        setRequestItFormCountAct: (state, action: PayloadAction<any>) => {
            state.requestITFormCountResp = action.payload;
        },
        setIssuedItFormListAct: (state, action: PayloadAction<any>) => {
            state.issuedITFormListResp = action.payload;
        },
        setRejectItFormListAct: (state, action: PayloadAction<any>) => {
            state.rejectITFormListResp = action.payload;
        },
        setAddNewRequestItFormAct: (state, action: PayloadAction<any>) => {
            state.addRequestItFormResp = action.payload;
        },
        setApproveRejectItFormAct: (state, action: PayloadAction<any>) => {
            state.approveRejectItFormResp = action.payload;
        },
        setItFormListByStudentIdAct: (state, action: PayloadAction<any>) => {
            state.itFormListByStudentIdResp = action.payload;
        },
        setDownloadItFormAct: (state, action: PayloadAction<any>) => {
            state.downloadItFormResp = action.payload;
        },
        setPreviewItFormAct: (state, action: PayloadAction<any>) => {
            state.previewItFormResp = action.payload;
        },
        setSentItFormAct: (state, action: PayloadAction<any>) => {
            state.sentItFormResp = action.payload;
        },
        setStudentFeeItFormAct: (state, action: PayloadAction<any>) => {
            state.studentFeeItFormResp = action.payload;
        },
        resetStudentFeeItFormAct: (state, action: PayloadAction<any>) => {
            state.studentFeeItFormResp = action.payload;
        },
        setStudentLedgerItFormAct: (state, action: PayloadAction<any>) => {
            state.studentLedgerItFormResp = action.payload;
        },
        resetStudentLedgerItFormAct: (state, action: PayloadAction<any>) => {
            state.studentLedgerItFormResp = action.payload;
        },
        setStudentsItFormAct: (state, action: PayloadAction<any>) => {
            state.getStudentsItFormResp = action.payload;
        },

        setAdmissionWithdrawalAct: (state, action: PayloadAction<any>) => {
            state.admissionWithdrawalResp = action.payload;
        },

        setAddAdmissionWithdrawalAct: (state, action: PayloadAction<any>) => {
            state.addAdmissionWithdrawalResp = action.payload;
        },


        setChequeHistoryAct: (state, action: PayloadAction<any>) => {
            state.chequeHistoryResp = action.payload;
        },

        setApproveRejectChequeAct: (state, action: PayloadAction<any>) => {
            state.approvRejectChequeResp = action.payload;
        },
        setChequeAdvanceFilterClassAct: (state, action: PayloadAction<any>) => {
            state.chequeAdvanceFilterClassResp = action.payload;
        },

        setFeeApprovalErrorAct: (state, action: PayloadAction<any>) => {
            state.feeApprovalsErrorResp = action.payload;
        },
        setFeeCashPaymentsAct: (state, action: PayloadAction<any>) => {
            state.feecashPaymentsResp = action.payload;
        },
        setFeeCashPaymentApproveAct: (state, action: PayloadAction<any>) => {
            state.approveFeeCashPaymentResp = action.payload;
        },
        setExportFeeChequeListAct: (state, action: PayloadAction<any>) => {
            state.exportFeeChequeResp = action.payload;
        },
        setItFormErrorAct: (state, action: PayloadAction<any>) => {
            state.itFormErrorResp = action.payload;
        },
        setUpdateItFormAct: (state, action: PayloadAction<any>) => {
            state.updateItFormResp = action.payload;
        },

    },
});


export const {
    setRequestItFormListAct, setRequestItFormCountAct, setIssuedItFormListAct, setRejectItFormListAct, setAddNewRequestItFormAct, setApproveRejectItFormAct,
    setItFormListByStudentIdAct,
    setStudentFeeItFormAct, resetStudentFeeItFormAct, setStudentLedgerItFormAct, resetStudentLedgerItFormAct, setStudentsItFormAct, setDownloadItFormAct,
    setPreviewItFormAct, setSentItFormAct,
    setAdmissionWithdrawalAct, setAddAdmissionWithdrawalAct, setItFormErrorAct,
    setChequeHistoryAct, setApproveRejectChequeAct, setChequeAdvanceFilterClassAct, setUpdateItFormAct,
    setFeeApprovalErrorAct, setFeeCashPaymentsAct, setFeeCashPaymentApproveAct,setExportFeeChequeListAct
} = feeApprovals.actions;

export default feeApprovals.reducer;



