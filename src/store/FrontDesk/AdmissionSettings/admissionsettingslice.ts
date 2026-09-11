import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    IAdmissionSettingReducerState
} from "./admissionsettingactiontypes";
import { IResponseErrorModel } from "../../types";

const initialState: IAdmissionSettingReducerState = {
    admissionAvailabilityListResp: undefined,
    proposedadmissionListResp: undefined,
    editProposedAdmissionResp: undefined,
    getAdmissionWithdrawalResp: undefined,
    admissionWithdrawalByIdResp: undefined,
    createAdmissionWithdrawalResp: undefined,
    searchStudentAdmissionWithdrawalResp: undefined,
    updateAdmissionWithdrawalResp: undefined,
    deletAdmissionWithdrawalResp: undefined,
    createFeeAdmissionWithdrawalResp: undefined,
    getAdmissionWithdrawalApprovedResp: undefined,
    admissionSettingErrorResp: undefined,
    getBranchClassLanguageResp: undefined,
    saveBranchClassLanguageResp: undefined,
    updateBranchClassLanguageResp: undefined,
    deleteBranchClassLanguageResp: undefined,
};

export const admissionSettingRequest = createSlice({
    name: "admissionSettingrequest",
    initialState,
    reducers: {
        setAdmissionAvailablityListAct: (state, action: PayloadAction<any>) => {
            state.admissionAvailabilityListResp = action.payload;
        },

        setProposedAdmissionListAct: (state, action: PayloadAction<any>) => {
            state.proposedadmissionListResp = action.payload;
        },
        setEditProposedAdmissionAct: (state, action: PayloadAction<any>) => {
            state.editProposedAdmissionResp = action.payload;
        },
        setGetAdmissionWithdrawalAct: (state, action: PayloadAction<any>) => {
            state.getAdmissionWithdrawalResp = action.payload;
        },
        setAdmissionWithdrawaByidAct: (state, action: PayloadAction<any>) => {
            state.admissionWithdrawalByIdResp = action.payload;
        },
        setCreateAdmissionWithdrawalAct: (state, action: PayloadAction<any>) => {
            state.createAdmissionWithdrawalResp = action.payload;
        },
        setSearchStudentAdmissionWithdrawalAct: (state, action: PayloadAction<any>) => {
            state.searchStudentAdmissionWithdrawalResp = action.payload;
        },
        setUpdateAdmissionWithdrawalAct: (state, action: PayloadAction<any>) => {
            state.updateAdmissionWithdrawalResp = action.payload;
        },
        setDeleteAdmissionWithdrawalAct: (state, action: PayloadAction<any>) => {
            state.deletAdmissionWithdrawalResp = action.payload;
        },
        setCreateFeeAdmissionWithdrawalAct: (state, action: PayloadAction<any>) => {
            state.createFeeAdmissionWithdrawalResp = action.payload;
        },
        setGetAdmissionWithdrawalApprovedAct: (state, action: PayloadAction<any>) => {
            state.getAdmissionWithdrawalApprovedResp = action.payload;
        },
        setBranchClassLanguageAct: (state, action: PayloadAction<any>) => {
            state.getBranchClassLanguageResp = action.payload;
        },
        setSaveBranchClassLanguageAct: (state, action: PayloadAction<any>) => {
            state.saveBranchClassLanguageResp = action.payload;
        },
        setUpdateBranchClassLanguageAct: (state, action: PayloadAction<any>) => {
            state.updateBranchClassLanguageResp = action.payload;
        },
        setDeleteBranchClassLanguageAct: (state, action: PayloadAction<any>) => {
            state.deleteBranchClassLanguageResp = action.payload;
        },

        setAdmissionSettingErrorAct: (
            state,
            action: PayloadAction<IResponseErrorModel>
        ) => {
            state.admissionSettingErrorResp = action.payload;
        },
    },
});


export const {
    setAdmissionAvailablityListAct,
    setProposedAdmissionListAct,
    setAdmissionSettingErrorAct,
    setEditProposedAdmissionAct,
    setGetAdmissionWithdrawalAct,
    setAdmissionWithdrawaByidAct,
    setCreateAdmissionWithdrawalAct,
    setSearchStudentAdmissionWithdrawalAct,
    setUpdateAdmissionWithdrawalAct,
    setCreateFeeAdmissionWithdrawalAct,
    setGetAdmissionWithdrawalApprovedAct,
    setDeleteAdmissionWithdrawalAct,
    setBranchClassLanguageAct,
    setSaveBranchClassLanguageAct,
    setUpdateBranchClassLanguageAct,
    setDeleteBranchClassLanguageAct,
} = admissionSettingRequest.actions;

export default admissionSettingRequest.reducer;



