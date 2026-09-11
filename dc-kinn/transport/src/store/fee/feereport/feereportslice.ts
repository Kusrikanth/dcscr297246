import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IFeeReportReducerState } from "./feereporttypes";

const initialState: IFeeReportReducerState = {
    feeNameByTypeResp: undefined,
    feeTermByTypeResp: undefined,
    feeNameForFilterResp: undefined,
    feeCollectionResp: undefined,
    exportFeeCollectionResp: undefined,
    feeReportErrorResp: undefined,
    getUnpaidListStudentResp: undefined,
    getFeedbackByIdResp: undefined,
    exportUnpaidListResp: undefined,
    sendEmailSmsUnpaidListResp: undefined,
    getUnpaidFeedbackListResp: undefined,
    fullEmployeeConcessionResp: undefined,
    getCbseVerifyReportResp: undefined,
    downloadCbseVerifyListResp: undefined,
    exportCbseVerificationResp: undefined,
    fillFeedbackFormResp: undefined,

    getFeeDashboardStatsResp: undefined,
    getFeeDashboardJodoPaymentModeStatusStatsResp: undefined,
    getFeeDashboardTransactionSummaryResp : undefined,
    getFeeCollectionDashboardResp : undefined,
    getFeeDashboardCollectionStatsResp : undefined,
    getFeeRevenueDashboardResp : undefined,
    getFeeDashboardConcessionResp : undefined,
    getFeeDashboardPaymentModeResp : undefined,
    ccAvenueOrderStatsResp: undefined,

    // Super Admin Fee Dashboard

    getNetPaidFeeByBranchResp: undefined,
    getBranchWiseDueSummaryResp: undefined,
    getBranchWiseDueSummaryExportResp: undefined,
    getUnpaidStudentCountResp: undefined,
    getBranchWiseNetPaidByDateResp: undefined,
    exportBranchWiseNetPaidByDateResp: undefined,
    getBranchWiseNetAmountResp: undefined,
    getClassSectionWiseNetAmountResp: undefined,
    exportClassSectionWiseNetAmountResp: undefined,
    exportBranchWiseNetAmountResp: undefined,

    // Super Admin Transport Dashboard

    getVehicleTypeListDashboardResp : undefined,
    exportVehicleTypeListDashboardResp : undefined,
    getTransportFeeTermWiseResp : undefined,
    exportTransportFeeTermWiseResp : undefined,
    getActiveVehiclesListResp : undefined,
    getStuAvailingListResp : undefined,
    getTransportOptedListResp : undefined,
    getPendingReqListResp : undefined,
};

export const feeReportSlice = createSlice({
    name: "feereport",
    initialState,
    reducers: {
        setFeeNameByTypeAct: (state, action: PayloadAction<any>) => {
            state.feeNameByTypeResp = action.payload;
        },
        setfeeTermByTypeAct: (state, action: PayloadAction<any>) => {
            state.feeTermByTypeResp = action.payload;
        },
        setFeeNameForFilterAct: (state, action: PayloadAction<any>) => {
            state.feeNameForFilterResp = action.payload;
        },
        setFeeCollectionReportAct: (state, action: PayloadAction<any>) => {
            state.feeCollectionResp = action.payload;
        },
        setExportFeeCollectionAct: (state, action: PayloadAction<any>) => {
            state.exportFeeCollectionResp = action.payload;
        },
        setUnpaidListAct: (state, action: PayloadAction<any>) => {
            state.getUnpaidListStudentResp = action.payload;
        },
        resetUnpaidListAct: (state, action: PayloadAction<any>) => {
            state.getUnpaidListStudentResp = action.payload;
        },
        resetUnpaidFeedbackListAct: (state, action: PayloadAction<any>) => {
            state.getUnpaidFeedbackListResp = action.payload;
        },
        setUnpaidFeedbackListAct: (state, action: PayloadAction<any>) => {
            state.getUnpaidFeedbackListResp = action.payload;
        },
        setSendEmailSmsUnpaidListAct: (state, action: PayloadAction<any>) => {
            state.sendEmailSmsUnpaidListResp = action.payload;
        },
        setFeedbackByIdAct: (state, action: PayloadAction<any>) => {
            state.getFeedbackByIdResp = action.payload;
        },
        setFillFeedbackFormAct: (state, action: PayloadAction<any>) => {
            state.fillFeedbackFormResp = action.payload;
        },
        setExportUnpaidListAct: (state, action: PayloadAction<any>) => {
            state.exportUnpaidListResp = action.payload;
        },
        setFullEmployeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.fullEmployeeConcessionResp = action.payload;
        },
        setCbseVerifyReportAct: (state, action: PayloadAction<any>) => {
            state.getCbseVerifyReportResp = action.payload;
        },
        setDownloadCbseVerifyListAct: (state, action: PayloadAction<any>) => {
            state.downloadCbseVerifyListResp = action.payload;
        },
        setExportCbseVerificationAct: (state, action: PayloadAction<any>) => {
            state.exportCbseVerificationResp = action.payload;
        },

        // Fee Dashboard
        setFeeDashboardStatsAct: (state, action: PayloadAction<any>) => {
            state.getFeeDashboardStatsResp = action.payload;
        },
        setFeeDashboardJodoPaymentModeStatusStatsAct: (state, action: PayloadAction<any>) => {
            state.getFeeDashboardJodoPaymentModeStatusStatsResp = action.payload;
        },
        setFeeDashboardTransactionSummaryAct: (state, action: PayloadAction<any>) => {
            state.getFeeDashboardTransactionSummaryResp = action.payload;
        },
        setFeeCollectionDashboardAct: (state, action: PayloadAction<any>) => {
            state.getFeeCollectionDashboardResp = action.payload;
        },
        setFeeDashboardCollectionStatsAct: (state, action: PayloadAction<any>) => {
            state.getFeeDashboardCollectionStatsResp = action.payload;
        },
        setFeeRevenueDashboardAct: (state, action: PayloadAction<any>) => {
            state.getFeeRevenueDashboardResp = action.payload;
        },
        setFeeDashboardConcessionAct: (state, action: PayloadAction<any>) => {
            state.getFeeDashboardConcessionResp = action.payload;
        },
        setFeeDashboardPaymentModeAct: (state, action: PayloadAction<any>) => {
            state.getFeeDashboardPaymentModeResp = action.payload;
        },

        setFeeReportErrorAct: (state, action: PayloadAction<any>) => {
            state.feeReportErrorResp = action.payload;
        },
        setccAvenueOrderStatsAct: (state, action: PayloadAction<any>) => {
            state.ccAvenueOrderStatsResp = action.payload
        },
        
        // Super Admin Fee Dashboard

        setNetPaidFeeByBranchAct: (state, action: PayloadAction<any>) => {
            state.getNetPaidFeeByBranchResp = action.payload
        },
        setBranchWiseDueSummaryAct: (state, action: PayloadAction<any>) => {
            state.getBranchWiseDueSummaryResp = action.payload
        },
        setBranchWiseDueSummaryExportAct: (state, action: PayloadAction<any>) => {
            state.getBranchWiseDueSummaryExportResp = action.payload
        },
        setUnpaidStudentCountAct: (state, action: PayloadAction<any>) => {
            state.getUnpaidStudentCountResp = action.payload
        },
        setBranchWiseNetPaidByDateAct: (state, action: PayloadAction<any>) => {
            state.getBranchWiseNetPaidByDateResp = action.payload
        },
        setExportBranchWiseNetPaidByDateAct: (state, action: PayloadAction<any>) => {
            state.exportBranchWiseNetPaidByDateResp = action.payload
        },
        setBranchWiseNetAmountAct: (state, action: PayloadAction<any>) => {
            state.getBranchWiseNetAmountResp = action.payload
        },
        setClassSectionWiseNetAmountAct: (state, action: PayloadAction<any>) => {
            state.getClassSectionWiseNetAmountResp = action.payload
        },
        setExportClassSectionWiseNetAmountAct: (state, action: PayloadAction<any>) => {
            state.exportClassSectionWiseNetAmountResp = action.payload
        },
        setExportBranchWiseNetAmountAct: (state, action: PayloadAction<any>) => {
            state.exportBranchWiseNetAmountResp = action.payload
        },
        
        // Super Admin Transport Dashboard

        setVehicleTypeListDashboardAct: (state, action: PayloadAction<any>) => {
            state.getVehicleTypeListDashboardResp = action.payload
        },
        setExportVehicleTypeListDashboardAct: (state, action: PayloadAction<any>) => {
            state.exportVehicleTypeListDashboardResp = action.payload
        },
        setTransportFeeTermWiseAct: (state, action: PayloadAction<any>) => {
            state.getTransportFeeTermWiseResp = action.payload
        },
        setExportTransportFeeTermWiseAct: (state, action: PayloadAction<any>) => {
            state.exportTransportFeeTermWiseResp = action.payload
        },
        setActiveVehiclesListAct: (state, action: PayloadAction<any>) => {
            state.getActiveVehiclesListResp = action.payload
        },
        setStuAvailingListAct: (state, action: PayloadAction<any>) => {
            state.getStuAvailingListResp = action.payload
        },
        setTransportOptedListAct: (state, action: PayloadAction<any>) => {
            state.getTransportOptedListResp = action.payload
        },
        setPendingReqListAct: (state, action: PayloadAction<any>) => {
            state.getPendingReqListResp = action.payload
        },

    }
})
export const {
    setFeeNameByTypeAct, setfeeTermByTypeAct,
    setFeeNameForFilterAct, setFeeCollectionReportAct, setUnpaidFeedbackListAct, setFullEmployeeConcessionAct,
    setExportFeeCollectionAct, setFeeReportErrorAct, setUnpaidListAct, resetUnpaidListAct, resetUnpaidFeedbackListAct, setSendEmailSmsUnpaidListAct, setFeedbackByIdAct, setFillFeedbackFormAct, setExportUnpaidListAct, setCbseVerifyReportAct,
    setDownloadCbseVerifyListAct, setExportCbseVerificationAct,setFeeDashboardStatsAct, setFeeDashboardJodoPaymentModeStatusStatsAct, setFeeDashboardTransactionSummaryAct,setFeeCollectionDashboardAct,setFeeDashboardCollectionStatsAct,setFeeRevenueDashboardAct,setFeeDashboardConcessionAct,setccAvenueOrderStatsAct,setFeeDashboardPaymentModeAct,setNetPaidFeeByBranchAct,setBranchWiseDueSummaryAct,setUnpaidStudentCountAct,setBranchWiseNetPaidByDateAct,setBranchWiseNetAmountAct,setClassSectionWiseNetAmountAct,setExportClassSectionWiseNetAmountAct,setVehicleTypeListDashboardAct,setTransportFeeTermWiseAct,setActiveVehiclesListAct,setStuAvailingListAct,setTransportOptedListAct,setPendingReqListAct,setBranchWiseDueSummaryExportAct,setExportBranchWiseNetPaidByDateAct,setExportBranchWiseNetAmountAct,setExportTransportFeeTermWiseAct,setExportVehicleTypeListDashboardAct,
} = feeReportSlice.actions;

export default feeReportSlice.reducer;