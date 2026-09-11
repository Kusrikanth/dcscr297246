export interface IHostelStuLedgerReducerState {
    getHostelStuLedgerListResp: any;
    getHostelStuLedgerDetailsResp: any;
    getHostelChequeClearanceListResp: any;
    downloadHostelFeeReceiptResp: any;
    exportHostelStuLedgerResp: any;
    hostelPayfeeDetailsResp: any;
    notifyHostelDueFeePaymentResp: any;
    exportHostelDueFeePaymentResp: any;
    hostelStudentAvailabilityResp: any;
    //Hostel Concession
    exportHostelConcessionResp:any;
    deleteHostelConcessionResp:any;

    //Hostel Fee Receipt
    exportHostelFeeReceiptResp: any;

    //Hostel Cheque Clearance
    exportHostelChequeClearanceResp: any;

    //Hostel Fee Reversal
    exportHostelFeeReversalResp: any;

    //Hostel ShortList
    exportHostelShortListResp: any;

    //Hostel Fee Refunds
    getHostelFeeRefundsListResp: any;
    exportHostelFeeRefundsResp : any;

    //Hostel Fee fine
    getHostelFeeFinesListResp: any;
    getHostelFeeNamesResp: any;
    addHostelFeeFinesResp: any;
    deleteHostelFeeFinesResp: any;
    updateHostelFeeFinesResp: any;

    //error state

    hostelStuLedgerErrResp: any;
}