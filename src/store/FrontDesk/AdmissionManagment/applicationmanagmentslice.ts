import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IApplicationSaleInitialState } from "./applicationmanagmenttypes";

const initialState: IApplicationSaleInitialState = {
    statasticResp: undefined,
    applicationSaleListResp: undefined,
    applicationSaleClassListResp: undefined,
    acceptAdmissionApprovalResp: undefined,
    subjectListForCBSEResp: undefined,
    subjectListForCambridgeResp: undefined,
    secoundLanguageResp: undefined,
    thirdLanguageResp: undefined,
    addApplicationSaleResp: undefined,
    createJodoOrderResp: undefined,
    jodoPaymentStatusResp: undefined,
    editApplicationSaleResp: undefined,
    applicationSaleByIdResp: undefined,
    applicationRemarksByIdResp: undefined,
    getApplicationRemarksStatusResp: undefined,
    saveApplicationRemarksByIdResp: undefined,
    applicationSaleByApplicationNo: undefined,
    applicationSaleBySearch: undefined,
    transportAvalabilityStatus: undefined,
    cancelApplicationSaleByIdResp: undefined,
    downloadApplicationSaleByIdResp: undefined,
    previewApplicationSaleByIdResp: undefined,
    sendPaymentLinkApplicationSaleStatusResp: undefined,
    sendEmailNotificationStatusResp: undefined,
    sendSMSNotificationStatusResp: undefined,
    generateFeeReceiptResp: undefined,
    registrationDetailsListResp: undefined,
    examMarksListWhileSaveResp: undefined,
    addRegistrationDetailsResp: undefined,
    preliminaryScrutinyList: undefined,
    preliminaryScrutinyDocumentList: undefined,
    updatePreliminaryScrutinyDocumentStatusResp: undefined,
    preliminaryScrutinyById: undefined,
    statusOfPreliminaryScrutiny: undefined,
    previewConsolidatedView: undefined,
    examinationMarksListResp: undefined,
    examinationScheduleListResp: undefined,
    deleteExaminationScheduleByIdResp: undefined,
    examinationScheduleByIdResp: undefined,
    enquiryListResp: undefined,
    exportEnquiryListResp: undefined,
    enquiryClassListResp: undefined,
    enquiryByIdResp: undefined,
    addNewEnquiry: undefined,
    updateEnquiry: undefined,
    updateEnquiryStatus: undefined,
    deleteEnquiry: undefined,
    enquirySourceListResp: undefined,
    applicationSaleError: undefined,
    saveEnquiryAppSaleError: undefined,
    getChangeStudentDetailListResp: undefined,
    getAllChangeStudentsListActResp: undefined,
    getChangeStudentListByIdResp: undefined,
    getSecondLanForChangeStudentResp: undefined,
    getThirdLanForChangeStudentResp: undefined,
    saveChangeStudentDetailsResp: undefined,
    getsiblingverificationlistResp: undefined,
    getSiblingVerificationListByIdResp: undefined,
    getSiblingVerificationListRecordsCountResp: undefined,
    editSiblingVerificationStatusByIdResp: undefined,
    generateAdmissionFormPdfResp: undefined,
    generateTokenForUserResp: undefined,
    verifyOtpForUserResp: undefined,
    generateAdmissionFormPdf2Resp: undefined,
    activeLinkAppSaleResp: undefined,
    exportAppSaleResp: undefined,
    exportRegistrationDataResp: undefined,
    saveExaminationMarksResp: undefined,
    cancelAdmissionInPreliminaryResp: undefined,
    getExamMarksByIdResp: undefined,
    exportScrutinyDataResp: undefined,
    editExamMarksResp: undefined,
    sendReminderDocResubmissionResp: undefined,
    exportExamMarksListResp: undefined,
    exportSiblingVerifyListResp: undefined,
    exportChangeStudentListResp: undefined,
    sendNotifiChangeStuDetailResp: undefined,
    getByIdExamAbsentStudentResp: undefined,
    editAbsentStudentExamResp: undefined,
    exportChangeTraReqListResp: undefined,
    updateStatusChangeTransferResp: undefined,
    getChangeTraReqListResp: undefined,
    getAmountForApplicationSaleResp: undefined,
    saveEnquiryAppSaleResp: undefined,
    generateOtpForUserResp: undefined,
    resendOtpForUserResp: undefined,

    // admission dashboard
    getClassWiseAnalysisResp: undefined,
    getSourceWiseAnalysisResp: undefined,
    getAdmissionSummaryResp: undefined,
    brchClassCurriculumResp: undefined,
    getAdmissionAnalysisResp: undefined,
    brchAdmissionCurriculumResp: undefined,
    getAdmissionSummaryReportResp: undefined,
    getAdmissionStatsResp: undefined,
    getGenderMasterResp: undefined,
    brchCardCurriculumResp: undefined,
    leadConversionStatusResp: undefined,
    classListResp: undefined,
    getAdmissionStatsHyperlinkResp: undefined,

    getEnquiryStatsResp: undefined,
    sendAppSaleFormLinkResp: undefined,
    getEnquiryDetailsByRefIdResp: undefined,

    validateStuTcRequestResp: undefined,
    verifyTcRequestOtpResp: undefined,
    verifyTcRequestOtpError: undefined,
    saveDownloadTcLogsResp: undefined,
};


export const applicationSale = createSlice({
    name: "applicationSale",
    initialState,
    reducers: {
        setStatasticAct: (state, action: PayloadAction<any>) => {
            state.statasticResp = action.payload;
        },
        resetApplicationSaleListAct: (state, action: PayloadAction<any>) => {
            state.applicationSaleListResp = action.payload;
        },
        setApplicationSaleListAct: (state, action: PayloadAction<any>) => {
            state.applicationSaleListResp = action.payload;
        },
        resetApplicationSaleClassListAct: (state, action: PayloadAction<any>) => {
            state.applicationSaleClassListResp = action.payload;
        },
        setApplicationSaleClassListAct: (state, action: PayloadAction<any>) => {
            state.applicationSaleClassListResp = action.payload;
        },
        setSubjectListForCBSEAct: (state, action: PayloadAction<any>) => {
            state.subjectListForCBSEResp = action.payload;
        },
        resetSubjectListForCBSEAct: (state, action: PayloadAction<any>) => {
            state.subjectListForCBSEResp = action.payload;
        },
        setSubjectListForCambridgeAct: (state, action: PayloadAction<any>) => {
            state.subjectListForCambridgeResp = action.payload;
        },
        setSecoundLanguageListAct: (state, action: PayloadAction<any>) => {
            state.secoundLanguageResp = action.payload;
        },
        setThirdLanguageListAct: (state, action: PayloadAction<any>) => {
            state.thirdLanguageResp = action.payload;
        },
        resetSecoundLanguageListAct: (state, action: PayloadAction<any>) => {
            state.secoundLanguageResp = action.payload;
        },
        addApplicationSaleAct: (state, action: PayloadAction<any>) => {
            state.addApplicationSaleResp = action.payload;
        },
        editApplicationSaleAct: (state, action: PayloadAction<any>) => {
            state.editApplicationSaleResp = action.payload;
        },
        setApplicationSaleByIdAct: (state, action: PayloadAction<any>) => {
            state.applicationSaleByIdResp = action.payload;
        },
        setApplicationRemarksByIdAct: (state, action: PayloadAction<any>) => {
            state.applicationRemarksByIdResp = action.payload;
        },
        setApplicationRemarksStatusAct: (state, action: PayloadAction<any>) => {
            state.getApplicationRemarksStatusResp = action.payload;
        },
        setSaveApplicationRemarksByIdAct: (state, action: PayloadAction<any>) => {
            state.saveApplicationRemarksByIdResp = action.payload;
        },
        resetTransportAvalabilityStatus: (state, action: PayloadAction<any>) => {
            state.transportAvalabilityStatus = action.payload;
        },
        setTransportAvalabilityStatus: (state, action: PayloadAction<any>) => {
            state.transportAvalabilityStatus = action.payload;
        },
        setApplicationSaleByApplicationNoAct: (state, action: PayloadAction<any>) => {
            state.applicationSaleByApplicationNo = action.payload;
        },
        setApplicationSaleBySearchAct: (state, action: PayloadAction<any>) => {
            state.applicationSaleBySearch = action.payload;
        },
        cancelApplicationSaleByIdAct: (state, action: PayloadAction<any>) => {
            state.cancelApplicationSaleByIdResp = action.payload;
        },
        downloadApplicationSaleByIdAct: (state, action: PayloadAction<any>) => {
            state.downloadApplicationSaleByIdResp = action.payload;
        },
        previewApplicationSaleByIdAct: (state, action: PayloadAction<any>) => {
            state.previewApplicationSaleByIdResp = action.payload;
        },
        sendPaymentLinkApplicationSaleStatusAct: (state, action: PayloadAction<any>) => {
            state.sendPaymentLinkApplicationSaleStatusResp = action.payload;
        },
        sendEmailNotificationStatusAct: (state, action: PayloadAction<any>) => {
            state.sendEmailNotificationStatusResp = action.payload;
        },
        sendSMSNotificationStatusAct: (state, action: PayloadAction<any>) => {
            state.sendSMSNotificationStatusResp = action.payload;
        },
        generateFeeReceiptAct: (state, action: PayloadAction<any>) => {
            state.generateFeeReceiptResp = action.payload;
        },
        setRegistrationDetailsList: (state, action: PayloadAction<any>) => {
            state.registrationDetailsListResp = action.payload;
        },
        addRegistrationDetails: (state, action: PayloadAction<any>) => {
            state.addRegistrationDetailsResp = action.payload;
        },
        setExaminationMarksList: (state, action: PayloadAction<any>) => {
            state.examinationMarksListResp = action.payload;
        },
        resetExaminationMarksList: (state, action: PayloadAction<any>) => {
            state.examinationMarksListResp = action.payload;
        },
        setPreliminaryScrutinyList: (state, action: PayloadAction<any>) => {
            state.preliminaryScrutinyList = action.payload;
        },
        resetPreliminaryScrutinyList: (state, action: PayloadAction<any>) => {
            state.preliminaryScrutinyList = action.payload;
        },
        setPreliminaryScrutinyDocumentList: (state, action: PayloadAction<any>) => {
            state.preliminaryScrutinyDocumentList = action.payload;
        },
        updatePreliminaryScrutinyDocumentStatus: (state, action: PayloadAction<any>) => {
            state.updatePreliminaryScrutinyDocumentStatusResp = action.payload;
        },
        setPreliminaryScrutinyById: (state, action: PayloadAction<any>) => {
            state.preliminaryScrutinyById = action.payload;
        },
        resetPreliminaryScrutinyById: (state, action: PayloadAction<any>) => {
            state.preliminaryScrutinyById = action.payload;
        },
        setStatusOfPreliminaryScrutiny: (state, action: PayloadAction<any>) => {
            state.statusOfPreliminaryScrutiny = action.payload;
        },
        setPreviewConsolidatedView: (state, action: PayloadAction<any>) => {
            state.previewConsolidatedView = action.payload;
        },
        setExaminationScheduleList: (state, action: PayloadAction<any>) => {
            state.examinationScheduleListResp = action.payload
        },
        deleteExaminationScheduleById: (state, action: PayloadAction<any>) => {
            state.deleteExaminationScheduleByIdResp = action.payload
        },
        getExaminationScheduleById: (state, action: PayloadAction<any>) => {
            state.examinationScheduleByIdResp = action.payload
        },
        getEnquiryList: (state, action: PayloadAction<any>) => {
            state.enquiryListResp = action.payload
        },
        setExportEnquiryListAct: (state, action: PayloadAction<any>) => {
            state.exportEnquiryListResp = action.payload
        },
        getEnquiryClassList: (state, action: PayloadAction<any>) => {
            state.enquiryClassListResp = action.payload
        },
        getEnquiryDetailsById: (state, action: PayloadAction<any>) => {
            state.enquiryByIdResp = action.payload
        },
        resetEnquiryDetailsById: (state, action: PayloadAction<any>) => {
            state.enquiryByIdResp = action.payload
        },
        setAddEnquiry: (state, action: PayloadAction<any>) => {
            state.addNewEnquiry = action.payload
        },
        setUpdateEnquiry: (state, action: PayloadAction<any>) => {
            state.updateEnquiry = action.payload
        },
        setUpdateEnquiryStatus: (state, action: PayloadAction<any>) => {
            state.updateEnquiryStatus = action.payload
        },
        setDeleteEnquiry: (state, action: PayloadAction<any>) => {
            state.deleteEnquiry = action.payload
        },
        setEnquirySourceList: (state, action: PayloadAction<any>) => {
            state.enquirySourceListResp = action.payload
        },
        resetEnquirySourceList: (state, action: PayloadAction<any>) => {
            state.enquirySourceListResp = action.payload
        },
        setChangeStudentDetailListAct: (state, action: PayloadAction<any>) => {
            state.getChangeStudentDetailListResp = action.payload;
        },
        setAllChangeStudentsListAct: (state, action: PayloadAction<any>) => {
            state.getAllChangeStudentsListActResp = action.payload;
        },
        setChangeStudentListByIdAct: (state, action: PayloadAction<any>) => {
            state.getChangeStudentListByIdResp = action.payload;
        },
        setSecondLanForChangeStudentAct: (state, action: PayloadAction<any>) => {
            state.getSecondLanForChangeStudentResp = action.payload;
        },
        setThirdLanForChangeStudentAct: (state, action: PayloadAction<any>) => {
            state.getThirdLanForChangeStudentResp = action.payload;
        },
        resetThirdLanForChangeStudentAct: (state, action: PayloadAction<any>) => {
            state.getThirdLanForChangeStudentResp = action.payload;
        },
        setSaveChangeStudentDetailsAct: (state, action: PayloadAction<any>) => {
            state.saveChangeStudentDetailsResp = action.payload;
        },
        setSiblingVerificationListAct: (state, action: PayloadAction<any>) => {
            state.getsiblingverificationlistResp = action.payload;
        },
        setSiblingVerificationListByIdAct: (state, action: PayloadAction<any>) => {
            state.getSiblingVerificationListByIdResp = action.payload;
        },
        setSiblingVerificationListRecordsCountAct: (state, action: PayloadAction<any>) => {
            state.getSiblingVerificationListRecordsCountResp = action.payload;
        },
        setEditSiblingVerificationStatusByIdAct: (state, action: PayloadAction<any>) => {
            state.editSiblingVerificationStatusByIdResp = action.payload;
        },
        setAcceptAdmissionApprovalAct: (state, action: PayloadAction<any>) => {
            state.acceptAdmissionApprovalResp = action.payload;
        },
        setGenerateAdmissionFormPdfAct: (state, action: PayloadAction<any>) => {
            state.generateAdmissionFormPdfResp = action.payload;
        },
        setGenerateAdmissionFormPdf2Act: (state, action: PayloadAction<any>) => {
            state.generateAdmissionFormPdf2Resp = action.payload;
        },
        setCreateJodoOrderAct: (state, action: PayloadAction<any>) => {
            state.createJodoOrderResp = action.payload;
        },
        setJodoPaymentStatusAct: (state, action: PayloadAction<any>) => {
            state.jodoPaymentStatusResp = action.payload;
        },
        setGenerateTokenForUserAct: (state, action: PayloadAction<any>) => {
            state.generateTokenForUserResp = action.payload;
        },
        setVerifyOtpForUserAct: (state, action: PayloadAction<any>) => {
            state.verifyOtpForUserResp = action.payload;
        },
        setActiveLinkAppSaleAct: (state, action: PayloadAction<any>) => {
            state.activeLinkAppSaleResp = action.payload;
        },
        setExportAppSaleAct: (state, action: PayloadAction<any>) => {
            state.exportAppSaleResp = action.payload;
        },
        setExportRegistrationDataAct: (state, action: PayloadAction<any>) => {
            state.exportRegistrationDataResp = action.payload;
        },
        setSaveExaminationMarksAct: (state, action: PayloadAction<any>) => {
            state.saveExaminationMarksResp = action.payload;
        },
        setExamMarksListWhileSaveAct: (state, action: PayloadAction<any>) => {
            state.examMarksListWhileSaveResp = action.payload;
        },
        resetExamMarksListWhileSaveAct: (state, action: PayloadAction<any>) => {
            state.examMarksListWhileSaveResp = action.payload;
        },
        setExamMarksByIdAct: (state, action: PayloadAction<any>) => {
            state.getExamMarksByIdResp = action.payload;
        },
        resetExamMarksByIdAct: (state, action: PayloadAction<any>) => {
            state.getExamMarksByIdResp = action.payload;
        },
        setEditExamMarksResp: (state, action: PayloadAction<any>) => {
            state.editExamMarksResp = action.payload;
        },
        setCancelAdmissionInPreliminaryAct: (state, action: PayloadAction<any>) => {
            state.cancelAdmissionInPreliminaryResp = action.payload;
        },
        setExportScrutinyDataAct: (state, action: PayloadAction<any>) => {
            state.exportScrutinyDataResp = action.payload;
        },
        setSendReminderDocResubmissionAct: (state, action: PayloadAction<any>) => {
            state.sendReminderDocResubmissionResp = action.payload;
        },
        setExportExamMarksListAct: (state, action: PayloadAction<any>) => {
            state.exportExamMarksListResp = action.payload;
        },
        setExportSiblingVerifyListAct: (state, action: PayloadAction<any>) => {
            state.exportSiblingVerifyListResp = action.payload;
        },
        setExportChangeStudentListAct: (state, action: PayloadAction<any>) => {
            state.exportChangeStudentListResp = action.payload;
        },
        setSendNotifiChangeStuDetailAct: (state, action: PayloadAction<any>) => {
            state.sendNotifiChangeStuDetailResp = action.payload;
        },
        setByIdExamAbsentStudentAct: (state, action: PayloadAction<any>) => {
            state.getByIdExamAbsentStudentResp = action.payload;
        },
        resetByIdExamAbsentStudentAct: (state, action: PayloadAction<any>) => {
            state.getByIdExamAbsentStudentResp = action.payload;
        },
        setEditAbsentStudentExamAct: (state, action: PayloadAction<any>) => {
            state.editAbsentStudentExamResp = action.payload;
        },
        setChangeTraReqListAct: (state, action: PayloadAction<any>) => {
            state.getChangeTraReqListResp = action.payload;
        },
        setExportChangeTraReqListAct: (state, action: PayloadAction<any>) => {
            state.exportChangeTraReqListResp = action.payload;
        },
        setUpdateStatusChangeTransferAct: (state, action: PayloadAction<any>) => {
            state.updateStatusChangeTransferResp = action.payload;
        },
        setAmountForApplicationSaleAct: (state, action: PayloadAction<any>) => {
            state.getAmountForApplicationSaleResp = action.payload;
        },
        setSaveEnquiryAppSaleAct: (state, action: PayloadAction<any>) => {
            state.saveEnquiryAppSaleResp = action.payload;
        },
        setGenerateOtpForUserAct: (state, action: PayloadAction<any>) => {
            state.generateOtpForUserResp = action.payload;
        },
        setResendOtpForUserAct: (state, action: PayloadAction<any>) => {
            state.resendOtpForUserResp = action.payload;
        },
        setApplicationSaleErrorAct: (state, action: PayloadAction<any>) => {
            state.applicationSaleError = action.payload;
        },
        setSaveEnquiryAppSaleErrorAct: (state, action: PayloadAction<any>) => {
            state.saveEnquiryAppSaleError = action.payload;
        },
        setClassWiseAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getClassWiseAnalysisResp = action.payload
        },
        setSourceWiseAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getSourceWiseAnalysisResp = action.payload
        },
        setAdmissionSummaryAct: (state, action: PayloadAction<any>) => {
            state.getAdmissionSummaryResp = action.payload
        },
        setBrchClassCurriculumAct: (state, action: PayloadAction<any>) => {
            state.brchClassCurriculumResp = action.payload
        },
        resetBrchClassCurriculumAct: (state, action: PayloadAction<any>) => {
            state.brchClassCurriculumResp = action.payload
        },
        setBrchAdmissionCurriculumAct: (state, action: PayloadAction<any>) => {
            state.brchAdmissionCurriculumResp = action.payload
        },
        resetBrchAdmissionCurriculumAct: (state, action: PayloadAction<any>) => {
            state.brchAdmissionCurriculumResp = action.payload
        },
        setAdmissionAnalysisAct: (state, action: PayloadAction<any>) => {
            state.getAdmissionAnalysisResp = action.payload
        },
        setAdmissionSummaryReportAct: (state, action: PayloadAction<any>) => {
            state.getAdmissionSummaryReportResp = action.payload
        },
        setAdmissionStatsRespAct: (state, action: PayloadAction<any>) => {
            state.getAdmissionStatsResp = action.payload
        },
        setGenderMasterAct: (state, action: PayloadAction<any>) => {
            state.getGenderMasterResp = action.payload
        },
        setBrchCardCurriculumAct: (state, action: PayloadAction<any>) => {
            state.brchCardCurriculumResp = action.payload
        },
        setLeadConversionStatusAct: (state, action: PayloadAction<any>) => {
            state.leadConversionStatusResp = action.payload
        },
        setClassListAct: (state, action: PayloadAction<any>) => {
            state.classListResp = action.payload
        },
        setEnquiryStatsAct: (state, action: PayloadAction<any>) => {
            state.getEnquiryStatsResp = action.payload
        },
        setSendAppSaleFormLinkAct: (state, action: PayloadAction<any>) => {
            state.sendAppSaleFormLinkResp = action.payload
        },
        setEnquiryDetailsByRefIdAct: (state, action: PayloadAction<any>) => {
            state.getEnquiryDetailsByRefIdResp = action.payload
        },
        setValidateStuTcRequestAct: (state, action: PayloadAction<any>) => {
            state.validateStuTcRequestResp = action.payload
        },
        setVerifyTcRequestOtpAct: (state, action: PayloadAction<any>) => {
            state.verifyTcRequestOtpResp = action.payload
        },
        setVerifyTcRequestOtpErrorAct: (state, action: PayloadAction<any>) => {
            state.verifyTcRequestOtpError = action.payload
        },
        setSaveDownloadTcLogsAct: (state, action: PayloadAction<any>) => {
            state.saveDownloadTcLogsResp = action.payload
        },
        setAdmissionStatsHyperlinkAct: (state, action: PayloadAction<any>) => {
            state.getAdmissionStatsHyperlinkResp = action.payload
        },

    },
});


export const {
    setStatasticAct,
    setApplicationSaleListAct,
    resetApplicationSaleListAct,
    setGenerateAdmissionFormPdfAct,
    setGenerateAdmissionFormPdf2Act,
    setApplicationSaleClassListAct,
    resetApplicationSaleClassListAct,
    setSubjectListForCBSEAct,
    resetSubjectListForCBSEAct,
    setSubjectListForCambridgeAct,
    setSecoundLanguageListAct,
    setThirdLanguageListAct,
    resetSecoundLanguageListAct,
    setTransportAvalabilityStatus,
    resetTransportAvalabilityStatus,
    addApplicationSaleAct,
    editApplicationSaleAct,
    setAcceptAdmissionApprovalAct,
    setApplicationSaleByIdAct,
    setApplicationRemarksByIdAct,
    setApplicationRemarksStatusAct,
    setSaveApplicationRemarksByIdAct,
    setApplicationSaleByApplicationNoAct,
    setApplicationSaleBySearchAct,
    setSaveExaminationMarksAct,
    cancelApplicationSaleByIdAct,
    downloadApplicationSaleByIdAct,
    previewApplicationSaleByIdAct,
    sendPaymentLinkApplicationSaleStatusAct,
    sendEmailNotificationStatusAct,
    sendSMSNotificationStatusAct,
    generateFeeReceiptAct,
    setRegistrationDetailsList,
    addRegistrationDetails,
    setExaminationMarksList,
    setPreliminaryScrutinyList,
    resetPreliminaryScrutinyList,
    setPreliminaryScrutinyDocumentList,
    updatePreliminaryScrutinyDocumentStatus,
    setPreliminaryScrutinyById,
    resetPreliminaryScrutinyById,
    setStatusOfPreliminaryScrutiny,
    setPreviewConsolidatedView,
    setExaminationScheduleList,
    deleteExaminationScheduleById,
    getExaminationScheduleById,
    getEnquiryList,
    setExportEnquiryListAct,
    getEnquiryClassList,
    getEnquiryDetailsById,
    resetEnquiryDetailsById,
    setAddEnquiry,
    setCreateJodoOrderAct,
    setJodoPaymentStatusAct,
    setUpdateEnquiry,
    setUpdateEnquiryStatus,
    setDeleteEnquiry,
    setApplicationSaleErrorAct,
    setEnquirySourceList,
    resetEnquirySourceList,
    setChangeStudentDetailListAct,
    resetExaminationMarksList,
    setAllChangeStudentsListAct,
    setChangeStudentListByIdAct,
    setSecondLanForChangeStudentAct,
    setThirdLanForChangeStudentAct,
    resetThirdLanForChangeStudentAct,
    setSaveChangeStudentDetailsAct,
    setExportChangeStudentListAct,
    setSiblingVerificationListAct,
    setSiblingVerificationListByIdAct,
    setSiblingVerificationListRecordsCountAct,
    setEditSiblingVerificationStatusByIdAct,
    setGenerateTokenForUserAct,
    setVerifyOtpForUserAct,
    setExportSiblingVerifyListAct,
    setActiveLinkAppSaleAct,
    setExportExamMarksListAct,
    resetExamMarksByIdAct,
    setCancelAdmissionInPreliminaryAct,
    setExportAppSaleAct,
    setEditExamMarksResp,
    setExamMarksListWhileSaveAct,
    setExportRegistrationDataAct,
    setExportScrutinyDataAct,
    setSendReminderDocResubmissionAct,
    resetExamMarksListWhileSaveAct,
    setExamMarksByIdAct,
    setSendNotifiChangeStuDetailAct,
    setByIdExamAbsentStudentAct,
    resetByIdExamAbsentStudentAct,
    setUpdateStatusChangeTransferAct,
    setExportChangeTraReqListAct,
    setEditAbsentStudentExamAct,
    setAmountForApplicationSaleAct,
    setChangeTraReqListAct,
    setSaveEnquiryAppSaleAct,
    setGenerateOtpForUserAct,
    setResendOtpForUserAct,
    setSaveEnquiryAppSaleErrorAct,
    setClassWiseAnalysisAct,
    setSourceWiseAnalysisAct,
    setAdmissionSummaryAct,
    setBrchClassCurriculumAct,
    resetBrchClassCurriculumAct,
    setBrchAdmissionCurriculumAct,
    resetBrchAdmissionCurriculumAct,
    setAdmissionAnalysisAct,
    setAdmissionSummaryReportAct,
    setAdmissionStatsRespAct,
    setGenderMasterAct,
    setBrchCardCurriculumAct,
    setLeadConversionStatusAct,
    setClassListAct,
    setEnquiryStatsAct,
    setSendAppSaleFormLinkAct,
    setEnquiryDetailsByRefIdAct,
    setValidateStuTcRequestAct,
    setVerifyTcRequestOtpAct,
    setVerifyTcRequestOtpErrorAct,
    setSaveDownloadTcLogsAct,
    setAdmissionStatsHyperlinkAct,
} = applicationSale.actions;

export default applicationSale.reducer;



