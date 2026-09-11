import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    IFeeCollectionsReducerState
} from "./feecollectionstypes";
import { IResponseErrorModel } from "../../types";
import { IModelWithPagination } from "../../types";


const initialState: IFeeCollectionsReducerState = {
    feeReceiptsResp: undefined,
    addFeeReceiptResp: undefined,
    getFeeReceiptsFeeNamesResp: undefined,
    getSplFeeReceiptsFeeNamesResp: undefined,
    feeReceiptNoResp: undefined,
    updateFeeReceiptResp: undefined,
    previewFeeReceiptResp: undefined,
    downloadFeeReceiptResp: undefined,
    deleteFeeReceiptResp: undefined,
    exportFeeReceiptResp: undefined,
    sendEmailFeeReceiptResp: undefined,
    createCredentialsResp: undefined,
    notifyDueFeePaymentResp: undefined,
    exportNotifyDueFeePaymentResp: undefined,
    exportFeeFollowUpRemarksResp: undefined,
    getPayFeeDetailsResp: undefined,
    processCcavenueDummyPaymentResp: undefined,
    getSpecialFeePayDetailsResp: undefined,
    specialFeeLedgersResp: undefined,
    specialFeeReceiptsResp: undefined,

    createFeeReversalResp: undefined,
    feeReversalsResp: undefined,
    exportFeeReversalResp: undefined,

    studentLedgersResp: undefined,

    feeRefundsResp: undefined,
    addFeeRefundResp: undefined,
    updateFeeRefundResp: undefined,
    deleteFeeRefundResp: undefined,
    studentRefundLedgerResp: undefined,
    exportFeeRefundResp: undefined,

    feeSummaryList: undefined,
    feeSummaryDetails: undefined,
    ledgerDetails: undefined,
    feeDetails: undefined,
    scheduleDetails: undefined,
    getStudentConcessionForFee: undefined,
    exportFeeSummaryResp: undefined,
    downloadDueAmountStudentListResp: undefined,
    getLedgerForFeeAdjustResp: undefined,
    getStudentLedgersForFeeAdjustExcessAmountResp: undefined,
    getCampusTransferStudentRefundAmountResp: undefined,
    saveProcessStudentRefundAmountResp: undefined,
    previousYearBalanceLedgersResp: undefined,
    printStudentLedgerDetailsResp: undefined,
    getByIdFeeDueFollowUpRemarksResp: undefined,
    saveFeeDueFollowUpRemarksResp: undefined,
    getChronicParentTypesListResp: undefined,
    addChronicParentTypesResp: undefined,
    getChronicParentTypeByIdResp: undefined,
    updateChronicParentTypeResp: undefined,
    deleteChronicParentTypeResp: undefined,

    feeRefundDetails: undefined,

    updateJodoToErpPaymentResp: undefined,
    updateJodoDiscountResp: undefined,
    createJodoIdResp: undefined,
    updateErpToJodoReceiptResp: undefined,

    tutionFeeConcessionList: undefined,
    feePaymentResp: undefined,
    paymentOrderStatusResp: undefined,
    getStuForFeeAdjustResp: undefined,
    classListForAdvanceFilter: undefined,
    deleteLedgerDetailResp: undefined,
    feeLedgersConcessionResp: undefined,
    paymentActiveDetailsResp: undefined,
    paymentActiveDetailsByIdResp: undefined,
    exportActivePaymentDetailsResp: undefined,
    feeCollectionErrorResp: undefined,
    webhookLogsResp: undefined,
    updateStatusResp: undefined,
    webhookLogsCategoryDetailsResp: undefined,

    getPaymentReconciliationResp: undefined,
    getPaymentReconciliationDetailsByIdResp: undefined,
};


export const masterFeeSettings = createSlice({
    name: "feecollections",
    initialState,
    reducers: {
        setFeeReceiptsAct: (state, action: PayloadAction<any>) => {
            state.feeReceiptsResp = action.payload;
        },
        setAddFeeReceiptAct: (state, action: PayloadAction<any>) => {
            state.addFeeReceiptResp = action.payload;
        },
        setFeeReceiptsFeeNamesAct: (state, action: PayloadAction<any>) => {
            state.getFeeReceiptsFeeNamesResp = action.payload;
        },
        setSplFeeReceiptsFeeNamesAct: (state, action: PayloadAction<any>) => {
            state.getSplFeeReceiptsFeeNamesResp = action.payload;
        },
        resetSplFeeReceiptsFeeNamesAct: (state, action: PayloadAction<any>) => {
            state.getSplFeeReceiptsFeeNamesResp = action.payload;
        },
        setFeeReceiptNoAct: (state, action: PayloadAction<any>) => {
            state.feeReceiptNoResp = action.payload;
        },
        setUpdateFeeReceiptAct: (state, action: PayloadAction<any>) => {
            state.updateFeeReceiptResp = action.payload;
        },
        setPreviewFeeReceiptAct: (state, action: PayloadAction<any>) => {
            state.previewFeeReceiptResp = action.payload;
        },
        setDownloadFeeReceiptAct: (state, action: PayloadAction<any>) => {
            state.downloadFeeReceiptResp = action.payload;
        },
        setDeleteFeeReceiptAct: (state, action: PayloadAction<any>) => {
            state.deleteFeeReceiptResp = action.payload;
        },
        setExportFeeReceiptAct: (state, action: PayloadAction<any>) => {
            state.exportFeeReceiptResp = action.payload;
        },
        setStudentLedgersAct: (state, action: PayloadAction<any>) => {
            state.studentLedgersResp = action.payload;
        },
        setSendEmailFeeReceiptAct: (state, action: PayloadAction<any>) => {
            state.sendEmailFeeReceiptResp = action.payload;
        },
        setCreateCredentialsAct: (state, action: PayloadAction<any>) => {
            state.createCredentialsResp = action.payload;
        },
        setNotifyDueFeePaymentAct: (state, action: PayloadAction<any>) => {
            state.notifyDueFeePaymentResp = action.payload;
        },
        setExportNotifyDueFeePaymentAct: (state, action: PayloadAction<any>) => {
            state.exportNotifyDueFeePaymentResp = action.payload;
        },
        setExporFeeFollowUpRemarksAct: (state, action: PayloadAction<any>) => {
            state.exportFeeFollowUpRemarksResp = action.payload;
        },


        setPayFeeDetailsAct: (state, action: PayloadAction<any>) => {
            state.getPayFeeDetailsResp = action.payload;
        },
        setProcessCcavenueDummyPaymentAct: (state, action: PayloadAction<any>) => {
            state.processCcavenueDummyPaymentResp = action.payload;
        },

        setSpecialFeePayDetailsAct: (state, action: PayloadAction<any>) => {
            state.getSpecialFeePayDetailsResp = action.payload;
        },
        setSpecialFeeLedgersAct: (state, action: PayloadAction<any>) => {
            state.specialFeeLedgersResp = action.payload;
        },


        setSpecialFeeReceiptsAct: (state, action: PayloadAction<any>) => {
            state.specialFeeReceiptsResp = action.payload;
        },



        setCreateFeeReversalAct: (state, action: PayloadAction<any>) => {
            state.createFeeReversalResp = action.payload;
        },
        setFeeReversalsAct: (state, action: PayloadAction<any>) => {
            state.feeReversalsResp = action.payload;
        },
        setExportFeeReversalAct: (state, action: PayloadAction<any>) => {
            state.exportFeeReversalResp = action.payload;
        },


        setFeeRefundsAct: (state, action: PayloadAction<any>) => {
            state.feeRefundsResp = action.payload;
        },
        setAddFeeRefundAct: (state, action: PayloadAction<any>) => {
            state.addFeeRefundResp = action.payload;
        },
        setUpdateFeeRefundAct: (state, action: PayloadAction<any>) => {
            state.updateFeeRefundResp = action.payload;
        },
        setDeleteFeeRefundAct: (state, action: PayloadAction<any>) => {
            state.deleteFeeRefundResp = action.payload;
        },
        setStudentConcessionForFeeAct: (state, action: PayloadAction<any>) => {
            state.getStudentConcessionForFee = action.payload;
        },
        setStudentRefundLedgersAct: (state, action: PayloadAction<any>) => {
            state.studentRefundLedgerResp = action.payload;
        },
        setExportFeeRefundListAct: (state, action: PayloadAction<any>) => {
            state.exportFeeRefundResp = action.payload;
        },
        setFeeSummaryListAct: (state, action: PayloadAction<any>) => {
            state.feeSummaryList = action.payload;
        },
        resetFeeSummaryListAct: (state, action: PayloadAction<any>) => {
            state.feeSummaryList = action.payload;
        },
        setFeeSummaryDetailsAct: (state, action: PayloadAction<any>) => {
            state.feeSummaryDetails = action.payload;
        },
        setLedgerDetailsAct: (state, action: PayloadAction<any>) => {
            state.ledgerDetails = action.payload;
        },
        resetLedgerDetailsAct: (state, action: PayloadAction<any>) => {
            state.ledgerDetails = action.payload;
        },
        setFeeDetailsAct: (state, action: PayloadAction<any>) => {
            state.feeDetails = action.payload;
        },
        setScheduleDetailsAct: (state, action: PayloadAction<any>) => {
            state.scheduleDetails = action.payload;
        },
        setFeeRefundDetailsAct: (state, action: PayloadAction<any>) => {
            state.feeRefundDetails = action.payload;
        },

        setUpdateJodoToErpPaymentAct: (state, action: PayloadAction<any>) => {
            state.updateJodoToErpPaymentResp = action.payload;
        },
        setJodoDiscountDetailsAct: (state, action: PayloadAction<any>) => {
            state.updateJodoDiscountResp = action.payload;
        },
        resetJodoDiscountDetailsAct: (state, action: PayloadAction<any>) => {
            state.updateJodoDiscountResp = action.payload;
        },
        setCreateJodoIdAct: (state, action: PayloadAction<any>) => {
            state.createJodoIdResp = action.payload;
        },
        setUpdateErpToJodoReceiptAct: (state, action: PayloadAction<any>) => {
            state.updateErpToJodoReceiptResp = action.payload;
        },


        setTutionFeeConcessionAct: (state, action: PayloadAction<any>) => {
            state.tutionFeeConcessionList = action.payload;
        },
        setFeePaymentAct: (state, action: PayloadAction<any>) => {
            state.feePaymentResp = action.payload;
        },
        setPaymentOrderStatusAct: (state, action: PayloadAction<any>) => {
            state.paymentOrderStatusResp = action.payload;
        },
        setExportFeeSummaryAct: (state, action: PayloadAction<any>) => {
            state.exportFeeSummaryResp = action.payload;
        },
        setDownloadDueAmountStudentListAct: (state, action: PayloadAction<any>) => {
            state.downloadDueAmountStudentListResp = action.payload;
        },
        resetDownloadDueAmountStudentListAct: (state, action: PayloadAction<any>) => {
            state.downloadDueAmountStudentListResp = action.payload;
        },
        setStuForFeeAdjustAct: (state, action: PayloadAction<any>) => {
            state.getStuForFeeAdjustResp = action.payload;
        },

        setClassListForAdvanceFilterAct: (state, action: PayloadAction<any>) => {
            state.classListForAdvanceFilter = action.payload;
        },


        setLedgerForFeeAdjustAct: (state, action: PayloadAction<any>) => {
            state.getLedgerForFeeAdjustResp = action.payload;
        },
        setStudentLedgersForFeeAdjustExcessAmountAct: (state, action: PayloadAction<any>) => {
            state.getStudentLedgersForFeeAdjustExcessAmountResp = action.payload;
        },
        setCampusTransferStudentRefundAmountAct: (state, action: PayloadAction<any>) => {
            state.getCampusTransferStudentRefundAmountResp = action.payload;
        },
        setSaveProcessStudentRefundAmountAct: (state, action: PayloadAction<any>) => {
            state.saveProcessStudentRefundAmountResp = action.payload;
        },
        resetSaveProcessStudentRefundAmountAct: (state, action: PayloadAction<any>) => {
            state.saveProcessStudentRefundAmountResp = action.payload;
        },
        setPreviousYearBalanceLedgersAct: (state, action: PayloadAction<any>) => {
            state.previousYearBalanceLedgersResp = action.payload;
        },
        setPrintStudentLedgerDetailsAct: (state, action: PayloadAction<any>) => {
            state.printStudentLedgerDetailsResp = action.payload;
        },
        setGetByIdFeeDueFollowUpRemarksAct: (state, action: PayloadAction<any>) => {
            state.getByIdFeeDueFollowUpRemarksResp = action.payload;
        },
        setSaveFeeDueFollowUpRemarksAct: (state, action: PayloadAction<any>) => {
            state.saveFeeDueFollowUpRemarksResp = action.payload;
        },
        resetPrintStudentLedgerDetailsAct: (state, action: PayloadAction<any>) => {
            state.printStudentLedgerDetailsResp = action.payload;
        },

        resetClassListForAdvanceFilterAct: (state, action: PayloadAction<any>) => {
            state.classListForAdvanceFilter = action.payload;
        },
        setDeleteLedgerDetailAct: (state, action: PayloadAction<any>) => {
            state.deleteLedgerDetailResp = action.payload;
        },
        setFeeLedgersConcessionAct: (state, action: PayloadAction<any>) => {
            state.feeLedgersConcessionResp = action.payload;
        },
        setPaymentActiveDetailsAct: (state, action: PayloadAction<any>) => {
            state.paymentActiveDetailsResp = action.payload;
        },
        setPaymentActiveDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.paymentActiveDetailsByIdResp = action.payload;
        },

        setExportActivePaymentDetailsAct: (state, action: PayloadAction<any>) => {
            state.exportActivePaymentDetailsResp = action.payload
        },

        setChronicParentTypesListAct: (state, action: PayloadAction<any>) => {
            state.getChronicParentTypesListResp = action.payload
        },
        setAddChronicParentTypesAct: (state, action: PayloadAction<any>) => {
            state.addChronicParentTypesResp = action.payload
        },
        setChronicParentTypeByIdAct: (state, action: PayloadAction<any>) => {
            state.getChronicParentTypeByIdResp = action.payload
        },
        setUpdateChronicParentTypeAct: (state, action: PayloadAction<any>) => {
            state.updateChronicParentTypeResp = action.payload
        },
        setDeleteChronicParentTypeAct: (state, action: PayloadAction<any>) => {
            state.deleteChronicParentTypeResp = action.payload
        },

        setMasterFeeSettingsErrorAct: (
            state,
            action: PayloadAction<IResponseErrorModel>
        ) => {
            state.feeCollectionErrorResp = action.payload;
        },

        setWebhookLogsAct: (state, action: PayloadAction<any>) => {
            state.webhookLogsResp = action.payload
        },
        setUpdateStatusListAct: (state, action: PayloadAction<any>) => {
            state.updateStatusResp = action.payload
        },

        setWebhookLogsCategoryDetailsAct: (state, action: PayloadAction<any>) => {
            state.webhookLogsCategoryDetailsResp = action.payload
        },
        setPaymentReconciliationAct: (state, action: PayloadAction<any>) => {
            state.getPaymentReconciliationResp = action.payload
        },
        setPaymentReconciliationDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getPaymentReconciliationDetailsByIdResp = action.payload
        }
    },
});


export const {
    setFeeReceiptsAct, setAddFeeReceiptAct, setFeeReceiptsFeeNamesAct, setSplFeeReceiptsFeeNamesAct, resetSplFeeReceiptsFeeNamesAct, setFeeReceiptNoAct, setUpdateFeeReceiptAct,
    setPreviewFeeReceiptAct, setDownloadFeeReceiptAct,
    setDeleteFeeReceiptAct,
    setStudentLedgersAct, setExportFeeSummaryAct, setDownloadDueAmountStudentListAct, resetDownloadDueAmountStudentListAct,
    setFeeRefundsAct, setAddFeeRefundAct, setUpdateFeeRefundAct, setDeleteFeeRefundAct, setStudentRefundLedgersAct, setExportFeeRefundListAct,
    setFeeSummaryListAct, setLedgerDetailsAct, resetLedgerDetailsAct, setFeeDetailsAct, setScheduleDetailsAct, setFeeSummaryDetailsAct,
    setFeeRefundDetailsAct,
    setUpdateJodoToErpPaymentAct, setJodoDiscountDetailsAct, resetJodoDiscountDetailsAct, setCreateJodoIdAct, setUpdateErpToJodoReceiptAct,
    setTutionFeeConcessionAct, setLedgerForFeeAdjustAct, setStudentLedgersForFeeAdjustExcessAmountAct, setCampusTransferStudentRefundAmountAct, setSaveProcessStudentRefundAmountAct, resetSaveProcessStudentRefundAmountAct, setPreviousYearBalanceLedgersAct, setPrintStudentLedgerDetailsAct, setGetByIdFeeDueFollowUpRemarksAct, setSaveFeeDueFollowUpRemarksAct, resetPrintStudentLedgerDetailsAct, 
    setFeePaymentAct, setPaymentOrderStatusAct, setClassListForAdvanceFilterAct, resetClassListForAdvanceFilterAct,
    setCreateCredentialsAct, setNotifyDueFeePaymentAct, setExportNotifyDueFeePaymentAct, setExporFeeFollowUpRemarksAct,
    setMasterFeeSettingsErrorAct, setExportFeeReceiptAct,
    setStudentConcessionForFeeAct, setSendEmailFeeReceiptAct, setPayFeeDetailsAct,
    setProcessCcavenueDummyPaymentAct,
    setSpecialFeePayDetailsAct,
    setSpecialFeeLedgersAct,
    setCreateFeeReversalAct, setFeeReversalsAct, setExportFeeReversalAct, setDeleteLedgerDetailAct,
    setFeeLedgersConcessionAct, setPaymentActiveDetailsAct, setPaymentActiveDetailsByIdAct,
    setExportActivePaymentDetailsAct,
    setStuForFeeAdjustAct, setSpecialFeeReceiptsAct,
    setWebhookLogsAct,
    setUpdateStatusListAct, setPaymentReconciliationAct, setPaymentReconciliationDetailsByIdAct,
    setWebhookLogsCategoryDetailsAct,
    setChronicParentTypesListAct, setAddChronicParentTypesAct, setChronicParentTypeByIdAct,
    setUpdateChronicParentTypeAct, setDeleteChronicParentTypeAct
} = masterFeeSettings.actions;

export default masterFeeSettings.reducer;



