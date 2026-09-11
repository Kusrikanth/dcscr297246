import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IHostelStuLedgerReducerState } from "./hostelrequesttypes";

const initialState: IHostelStuLedgerReducerState = {
    hostelNotOptedStudentsResp: undefined,
    hostelOptedStudentsResp: undefined,
    saveHostelOptedStudentsResp: undefined,
    deleteHostelOptedStudentResp: undefined,
    exportHostelShortlistStuListResp: undefined,
    reActiveHostelShortlistByIdResp: undefined,

    // promote students 

    getHostelPromoteStuListResp: undefined,
    getSaveHostelPromoteStuListResp: undefined,
    saveHostelPromoteStuResp: undefined,

    //eligiblity student
    higherClassEligibilityStudResp: undefined,
    hostelEligibleClassesResp: undefined,
    eligibleStudForPromoteResp: undefined,
    saveEligibleStudForPromoteResp: undefined,
    revertRemoveHostelPromotionResp: undefined,

    // Hostel Bed Allocation
    getHostelBedAllocationListResp : undefined,
    deallocateHostelBedResp : undefined,
    getStuListForAllocateBedResp : undefined,
    getNotAllocateBedListResp : undefined,
    addHostelBedAllocationResp : undefined,
    exportHostelBedAllocationResp: undefined,

    // Hostel Termination
    getHostelTerminationListResp: undefined,
    getTerminationStuLedgersResp: undefined,
    saveHostelTerminationResp: undefined,
    revertHostelTerminationbyIdResp: undefined,

    //Hostel Transfer Request
    hostelTransferRequestResp: undefined,
    updateHostelTransferStatusResp: undefined,

    //error state
    hostelRequestErrorResp: undefined,
}
export const hostelRequestSlice = createSlice({
    name: "hostelRequest",
    initialState,
    reducers: {
        setHostelNotOptedStudentsAct: (state, action: PayloadAction<any>) => {
            state.hostelNotOptedStudentsResp = action.payload;
        },
        setHostelOptedStudentsAct: (state, action: PayloadAction<any>) => {
            state.hostelOptedStudentsResp = action.payload;
        },
        setSaveHostelOptedStudentsAct: (state, action: PayloadAction<any>) => {
            state.saveHostelOptedStudentsResp = action.payload;
        },
        setDeleteHostelOptedStudentAct: (state, action: PayloadAction<any>) => {
            state.deleteHostelOptedStudentResp = action.payload;
        },
        setExportHostelShortlistStuListAct: (state, action: PayloadAction<any>) => {
            state.exportHostelShortlistStuListResp = action.payload;
        },
        setReActiveHostelShortlistByIdAct: (state,action:PayloadAction<any>) => {
            state.reActiveHostelShortlistByIdResp = action.payload
        },

        //promote students 

        setHostelPromoteStuListAct: (state, action: PayloadAction<any>) => {
            state.getHostelPromoteStuListResp = action.payload;
        },
        setSaveHostelPromoteStuListAct: (state, action: PayloadAction<any>) => {
            state.getSaveHostelPromoteStuListResp = action.payload;
        },
        setSaveHostelPromoteStuAct: (state, action: PayloadAction<any>) => {
            state.saveHostelPromoteStuResp = action.payload;
        },

        //higher class eligibility
        setHigherClassEligibilityStudAct: (state, action: PayloadAction<any>) => {
            state.higherClassEligibilityStudResp = action.payload;
        },
        setHostelEligibleClassesAct: (state, action: PayloadAction<any>) => {
            state.hostelEligibleClassesResp = action.payload;
        },
        setEligibleStudForPromoteAct: (state, action: PayloadAction<any>) => {
            state.eligibleStudForPromoteResp = action.payload;
        },
        setSaveEligibleStudForPromoteAct: (state, action: PayloadAction<any>) => {
            state.saveEligibleStudForPromoteResp = action.payload;
        },
        setRevertRemoveHostelPromotionAct: (state, action: PayloadAction<any>) => {
            state.revertRemoveHostelPromotionResp = action.payload;
        },

        // Hostel Bed Allocation
        setHostelBedAllocationListAct: (state, action: PayloadAction<any>) => {
            state.getHostelBedAllocationListResp = action.payload;
        },
        setDeallocateHostelBedAct: (state, action: PayloadAction<any>) => {
            state.deallocateHostelBedResp = action.payload;
        },
        setStuListForAllocateBedAct: (state, action: PayloadAction<any>) => {
            state.getStuListForAllocateBedResp = action.payload;
        },
        setNotAllocateBedListAct: (state, action: PayloadAction<any>) => {
            state.getNotAllocateBedListResp = action.payload;
        },
        setAddHostelBedAllocationAct: (state, action: PayloadAction<any>) => {
            state.addHostelBedAllocationResp = action.payload;
        },
        setExportHostelBedAllocationAct: (state, action: PayloadAction<any>) => {
            state.exportHostelBedAllocationResp = action.payload;
        },

        // Hostel Termination
        setHostelTerminationListAct: (state, action: PayloadAction<any>) => {
            state.getHostelTerminationListResp = action.payload;
        },
        setTerminationStuLedgersAct: (state, action: PayloadAction<any>) => {
            state.getTerminationStuLedgersResp = action.payload;
        },
        setSaveHostelTerminationAct: (state, action: PayloadAction<any>) => {
            state.saveHostelTerminationResp = action.payload;
        },
        setRevertHostelTerminationByIdAct: (state,action:PayloadAction<any>)=>{
            state.revertHostelTerminationbyIdResp = action.payload
        },

        // Hostel Transfer Request
        setUpdateHostelTransferStatusAct: (state, action: PayloadAction<any>) => {
            state.updateHostelTransferStatusResp = action.payload;
        },

        setHostelTransferRequestAct: (state, action: PayloadAction<any>) => {
            state.hostelTransferRequestResp = action.payload;
        },

        //error state

        setHostelRequestErrorAct: (state, action: PayloadAction<any>) => {
            state.hostelRequestErrorResp = action.payload;
        },

    }
})
export const {
    setHostelNotOptedStudentsAct, setHostelOptedStudentsAct,
    setSaveHostelOptedStudentsAct, setDeleteHostelOptedStudentAct, setExportHostelShortlistStuListAct,
    setHostelPromoteStuListAct, setSaveHostelPromoteStuListAct, setSaveHostelPromoteStuAct,
    setReActiveHostelShortlistByIdAct,

    setHigherClassEligibilityStudAct, setHostelEligibleClassesAct,
    setEligibleStudForPromoteAct, setSaveEligibleStudForPromoteAct, setRevertRemoveHostelPromotionAct,

    setHostelBedAllocationListAct,setDeallocateHostelBedAct,setStuListForAllocateBedAct,setNotAllocateBedListAct,setAddHostelBedAllocationAct, setExportHostelBedAllocationAct,

    setHostelTerminationListAct, setTerminationStuLedgersAct, setSaveHostelTerminationAct,
    setRevertHostelTerminationByIdAct,

    setHostelTransferRequestAct, setUpdateHostelTransferStatusAct,
    setHostelRequestErrorAct
} = hostelRequestSlice.actions;
export default hostelRequestSlice.reducer;