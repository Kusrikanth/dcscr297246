export interface IHostelStuLedgerReducerState {
    hostelNotOptedStudentsResp: any;
    hostelOptedStudentsResp: any;
    saveHostelOptedStudentsResp: any;
    deleteHostelOptedStudentResp: any;
    exportHostelShortlistStuListResp: any;
    reActiveHostelShortlistByIdResp: any;

    //promote students

    getHostelPromoteStuListResp: any;
    getSaveHostelPromoteStuListResp: any;
    saveHostelPromoteStuResp: any;

    //higher class eligibility
    higherClassEligibilityStudResp: any;
    hostelEligibleClassesResp: any;
    eligibleStudForPromoteResp: any;
    saveEligibleStudForPromoteResp: any;
    revertRemoveHostelPromotionResp: any;

    // Hostel Bed Allocation
    getHostelBedAllocationListResp: any;
    deallocateHostelBedResp: any;
    getStuListForAllocateBedResp : any;
    getNotAllocateBedListResp : any;
    addHostelBedAllocationResp : any;
    exportHostelBedAllocationResp: any;

    // Hostel Termination
    getHostelTerminationListResp: any;
    getTerminationStuLedgersResp: any;
    saveHostelTerminationResp: any;
    revertHostelTerminationbyIdResp:any;

    //Hostel Transfer Request
    hostelTransferRequestResp: any,
    updateHostelTransferStatusResp: any,

    //error state
    hostelRequestErrorResp: any;
}
