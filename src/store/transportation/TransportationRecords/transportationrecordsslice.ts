import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRouteListReducerState } from "./transportationrecordstypes";

const initialState: IRouteListReducerState = {

    //all students 

    getAllStudentsTransRecListResp: undefined,
    exportAllNewRequestResp: undefined,

    // new request

    getNewRequestListResp: undefined,
    requestNoForTransportResp: undefined,
    approveTransportResp: undefined,
    transportRequestByIdResp: undefined,
    approveSubmittedTransportResp: undefined,
    deleteTransportReqResp: undefined,
    exportTransportNewReqResp: undefined,

    // change request
    getChangeRequestListResp :undefined,
    getAllocationDetailsResp : undefined,

    // termination
    getTerminationListResp :undefined,
    addTerminationReqResp :undefined,
    getTermsForTerminationReqResp :undefined,
    rejectTerminationReqResp :undefined,

    // student records

    getStuTransportationRecordsResp : undefined,
    exportStuTransportationRecordsResp : undefined,

    // employee records

    getEmpTransportationRecordsResp : undefined,
    exportEmpTransportationRecordsResp : undefined,

    // error 
    termsTransportBySlabIdResp: undefined,
    transportationRecordsErrorResp: undefined,

}

export const transportRequest = createSlice({
    name: "transportrecords",
    initialState,
    reducers: {
        // All Students

        setAllStudentsTransRecListAct: (state, action: PayloadAction<any>) => {
            state.getAllStudentsTransRecListResp = action.payload;
        },
        setExportAllNewRequestAct: (state, action: PayloadAction<any>) => {
            state.exportAllNewRequestResp = action.payload;
        },

        // New Requests

        setNewRequestListAct: (state, action: PayloadAction<any>) => {
            state.getNewRequestListResp = action.payload;
        },
        setRequestNoForTransportAct: (state, action: PayloadAction<any>) => {
            state.requestNoForTransportResp = action.payload;
        },
        setApproveTransportAct: (state, action: PayloadAction<any>) => {
            state.approveTransportResp = action.payload;
        },
        setTermsTransportBySlabIdAct: (state, action: PayloadAction<any>) => {
            state.termsTransportBySlabIdResp = action.payload;
        },
        setTransportRequestByIdAct: (state, action: PayloadAction<any>) => {
            state.transportRequestByIdResp = action.payload;
        },
        setApproveSubmittedTransportAct: (state, action: PayloadAction<any>) => {
            state.approveSubmittedTransportResp = action.payload;
        },
        setDeleteTransportReqAct: (state, action: PayloadAction<any>) => {
            state.deleteTransportReqResp = action.payload;
        },
        setExportTransportNewReqAct: (state, action: PayloadAction<any>) => {
            state.exportTransportNewReqResp = action.payload;
        },

        // change request

        setChangeRequestListAct: (state, action: PayloadAction<any>) => {
            state.getChangeRequestListResp = action.payload;
        },
        setAllocationDetailsAct: (state, action: PayloadAction<any>) => {
            state.getAllocationDetailsResp = action.payload;
        },
        resetAllocationDetailsAct: (state, action: PayloadAction<any>) => {
            state.getAllocationDetailsResp = action.payload;
        },


        // termination

        setTerminationListAct: (state, action: PayloadAction<any>) => {
            state.getTerminationListResp = action.payload;
        },
        setAddTerminationReqAct: (state, action: PayloadAction<any>) => {
            state.addTerminationReqResp = action.payload;
        },
        setTermsForTerminationReqAct: (state, action: PayloadAction<any>) => {
            state.getTermsForTerminationReqResp = action.payload;
        },
        resetTermsForTerminationReqAct: (state, action: PayloadAction<any>) => {
            state.getTermsForTerminationReqResp = action.payload;
        },
        setRejectTerminationReqResp: (state, action: PayloadAction<any>) => {
            state.rejectTerminationReqResp = action.payload;
        },

        // student records

        setStuTransportationRecordsAct: (state, action: PayloadAction<any>) => {
            state.getStuTransportationRecordsResp = action.payload;
        },
        setExportStuTransportationRecordsAct: (state, action: PayloadAction<any>) => {
            state.exportStuTransportationRecordsResp = action.payload;
        },

        // employee records

        setEmpTransportationRecordsAct: (state, action: PayloadAction<any>) => {
            state.getEmpTransportationRecordsResp = action.payload;
        },
        setExportEmpTransportationRecordsAct: (state, action: PayloadAction<any>) => {
            state.exportEmpTransportationRecordsResp = action.payload;
        },

        // Error

        setTransportationRecordsErrorAct: (state, action: PayloadAction<any>) => {
            state.transportationRecordsErrorResp = action.payload;
        }

    }
})

export const {
    //All Students
    setAllStudentsTransRecListAct,
    setExportAllNewRequestAct,
    setTransportationRecordsErrorAct,
    setApproveTransportAct,
    setRequestNoForTransportAct,
    setTermsTransportBySlabIdAct,
    setTransportRequestByIdAct,
    setApproveSubmittedTransportAct,
    // New Requests
    setNewRequestListAct,
    setDeleteTransportReqAct,
    setExportTransportNewReqAct,

    // Change Request
    setChangeRequestListAct,
    setAllocationDetailsAct,
    resetAllocationDetailsAct,

    // Termination
    setTerminationListAct,
    setAddTerminationReqAct,
    setTermsForTerminationReqAct,
    setRejectTerminationReqResp,
    resetTermsForTerminationReqAct,

    // student records

    setStuTransportationRecordsAct,
    setExportStuTransportationRecordsAct,

    // employee records

    setEmpTransportationRecordsAct,
    setExportEmpTransportationRecordsAct,

} = transportRequest.actions;

export default transportRequest.reducer;