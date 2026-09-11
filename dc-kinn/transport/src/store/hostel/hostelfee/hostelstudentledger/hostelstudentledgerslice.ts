import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IHostelStuLedgerReducerState } from "./hostelstudentledgertypes";

const initialState: IHostelStuLedgerReducerState = {
    getHostelStuLedgerListResp: undefined,
    getHostelStuLedgerDetailsResp: undefined,
    downloadHostelFeeReceiptResp: undefined,
    getHostelChequeClearanceListResp: undefined,
    exportHostelStuLedgerResp: undefined,
    hostelPayfeeDetailsResp: undefined,
    notifyHostelDueFeePaymentResp: undefined,
    exportHostelDueFeePaymentResp: undefined,
    hostelStudentAvailabilityResp: undefined,
    //Hostel Concession
    exportHostelConcessionResp: undefined,
    deleteHostelConcessionResp: undefined,

    //Hostel Fee Receipt
    exportHostelFeeReceiptResp: undefined,

    //Hostel Cheque Clearance
    exportHostelChequeClearanceResp: undefined,

    //Hostel Fee Reversal
    exportHostelFeeReversalResp: undefined,

    //Hostel ShortList
    exportHostelShortListResp: undefined,

    //Hostel Fee Refunds
    getHostelFeeRefundsListResp: undefined,
    exportHostelFeeRefundsResp: undefined,

    //Hostel Fee Fine
    getHostelFeeFinesListResp: undefined,
    getHostelFeeNamesResp: undefined,
    addHostelFeeFinesResp: undefined,
    deleteHostelFeeFinesResp: undefined,
    updateHostelFeeFinesResp: undefined,

    // error state

    hostelStuLedgerErrResp: undefined,
}
export const hostelStuLedger = createSlice({
    name: "hostelStuLedger",
    initialState,
    reducers: {
        setHostelStuLedgerListAct: (state, action: PayloadAction<any>) => {
            state.getHostelStuLedgerListResp = action.payload;
        },
        setHostelStuLedgerDetailsAct: (state, action: PayloadAction<any>) => {
            state.getHostelStuLedgerDetailsResp = action.payload;
        },
        setHostelChequeClearanceListAct: (state, action: PayloadAction<any>) => {
            state.getHostelChequeClearanceListResp = action.payload;
        },
        setDownloadHostelFeeReceiptAct: (state, action: PayloadAction<any>) => {
            state.downloadHostelFeeReceiptResp = action.payload;
        },
        setExportHostelStuLedgerAct: (state, action: PayloadAction<any>) => {
            state.exportHostelStuLedgerResp = action.payload;
        },
        setHostelPayfeeDetailsAct: (state, action: PayloadAction<any>) => {
            state.hostelPayfeeDetailsResp = action.payload;
        },
        setNotifyHostelDueFeePaymentAct: (state, action: PayloadAction<any>) => {
            state.notifyHostelDueFeePaymentResp = action.payload;
        },
        setExportHostelDueFeePaymentAct: (state, action: PayloadAction<any>) => {
            state.exportHostelDueFeePaymentResp = action.payload;
        },
        setHostelStudentAvailabilityAct: (state, action: PayloadAction<any>) => {
            state.hostelStudentAvailabilityResp = action.payload;
        },
        //Hostel Concession
        setExportHostelConcessionAct: (state, action: PayloadAction<any>) => {
            state.exportHostelConcessionResp = action.payload;
        },

        setDeleteHostelConcessionAct: (state, action: PayloadAction<any>) => {
            state.deleteHostelConcessionResp = action.payload;
        },

        //Hostel Fee Receipt
        setExportHostelFeeReceiptAct: (state, action: PayloadAction<any>) => {
            state.exportHostelFeeReceiptResp = action.payload;
        },

        //Hostel Cheque Clearance
        setExportHostelChequeClearanceAct: (state, action: PayloadAction<any>) => {
            state.exportHostelChequeClearanceResp = action.payload;
        },

        //Hostel Fee Reversal
        setExportHostelFeeReversalAct: (state, action: PayloadAction<any>) => {
            state.exportHostelFeeReversalResp = action.payload;
        },

        //Hostel Fee Reversal
        setExportHostelShortListAct: (state, action: PayloadAction<any>) => {
            state.exportHostelShortListResp = action.payload;
        },

        // Hostel Fee Refunds

        setHostelFeeRefundsListAct: (state, action: PayloadAction<any>) => {
            state.getHostelFeeRefundsListResp = action.payload;
        },
        setExportHostelFeeRefundsAct: (state, action: PayloadAction<any>) => {
            state.exportHostelFeeRefundsResp = action.payload;
        },

        // Hostel Fee Fine
        setHostelFeeFinesListAct: (state, action: PayloadAction<any>) => {
            state.getHostelFeeFinesListResp = action.payload;
        },

        setHostelFeeNamesAct: (state, action: PayloadAction<any>) => {
            state.getHostelFeeNamesResp = action.payload;
        },

        setAddHostelFeeFinesAct: (state, action: PayloadAction<any>) => {
            state.addHostelFeeFinesResp = action.payload;
        },
        setDeleteHostelFeeFinesAct: (state, action: PayloadAction<any>) => {
            state.deleteHostelFeeFinesResp = action.payload;
        },
        setUpdateHostelFeeFinesAct: (state, action: PayloadAction<any>) => {
            state.updateHostelFeeFinesResp = action.payload;
        },
        //error state

        setHostelStuLedgerErrAct: (state, action: PayloadAction<any>) => {
            state.hostelStuLedgerErrResp = action.payload;
        },

    }
})
export const {
    setHostelStuLedgerListAct,
    setHostelStuLedgerDetailsAct,
    setHostelChequeClearanceListAct,
    setDownloadHostelFeeReceiptAct,
    setExportHostelStuLedgerAct,
    setHostelPayfeeDetailsAct,
    setNotifyHostelDueFeePaymentAct,
    setExportHostelDueFeePaymentAct,
    setHostelStudentAvailabilityAct,

    //Hostel Concession
    setExportHostelConcessionAct,
    setDeleteHostelConcessionAct,

    //Hostel Fee Receipt
    setExportHostelFeeReceiptAct,

    //Hostel Cheque Clearance
    setExportHostelChequeClearanceAct,

    //Hostel Cheque Clearance
    setExportHostelFeeReversalAct,

    //Hostel Cheque Clearance
    setExportHostelShortListAct,

    // Hostel Fee Refunds
    setHostelFeeRefundsListAct,
    setExportHostelFeeRefundsAct,

    // Hostel Fee Fine
    setHostelFeeFinesListAct,
    setHostelFeeNamesAct,
    setAddHostelFeeFinesAct,
    setDeleteHostelFeeFinesAct,
    setUpdateHostelFeeFinesAct,

    //error state

    setHostelStuLedgerErrAct,
} = hostelStuLedger.actions;
export default hostelStuLedger.reducer;