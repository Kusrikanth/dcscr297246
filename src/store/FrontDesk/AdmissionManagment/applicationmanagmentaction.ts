
import { createAction } from "@reduxjs/toolkit";
import { ApplicationSaleConstants } from "./applicationmanagmentconstants";
import { INewActionType } from "../../types";
export {
    resetByIdExamAbsentStudentAct, resetSubjectListForCBSEAct,setAmountForApplicationSaleAct,
    setTransportAvalabilityStatus,resetSecoundLanguageListAct,resetThirdLanForChangeStudentAct,
    setApplicationSaleByApplicationNoAct, resetPreliminaryScrutinyById, resetPreliminaryScrutinyList, resetApplicationSaleListAct, resetApplicationSaleClassListAct, resetExaminationMarksList, resetTransportAvalabilityStatus, resetExamMarksByIdAct, resetExamMarksListWhileSaveAct,resetBrchClassCurriculumAct,resetBrchAdmissionCurriculumAct, resetEnquirySourceList, resetEnquiryDetailsById
} from './applicationmanagmentslice';
export const getStatasticResp = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_STATASTIC);
export const getApplicationSaleActList = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_APPLICATION_SALE_LIST);
export const addApplicationSale = createAction<INewActionType | undefined>(ApplicationSaleConstants.ADD_APPLICATION_SALE);
export const editApplicationSale = createAction<INewActionType | undefined>(ApplicationSaleConstants.EDIT_APPLICATION_SALE);
export const getApplicationSaleById = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_APPLICATION_SALE_BY_ID);
export const getApplicationRemarksById = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_APPLICATION_REMARKS_BY_ID);
export const saveApplicationRemarksById = createAction<INewActionType | undefined>(ApplicationSaleConstants.SAVE_APPLICATION_REMARKS_BY_ID);
export const getApplicationRemarksStatusAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_APPLICATION_REMARKS_STATUS);
export const getApplicationSaleByApplicationNoAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_APPLICATION_SALE_BYAPPLICATION_NO);
export const getApplicationSaleBySearchAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_APPLICATION_SALE_BYSEARCH);

export const getApplicationSaleClassList = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_APPLICATION_SALE_CLASS_LIST);
export const getSubjectListForCBSEList = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_SUBJECT_LIST_CBSE);
export const getSubjectListForCambridgeList = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_SUBJECT_LIST_CAMBRIDGE);
export const getSecoundLanguagesList = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_SECOUND_LANGUAGE_LIST);
export const getThirdLanguagesListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_THIRD_LANGUAGE_LIST);

export const cancelApplicationSaleById = createAction<INewActionType | undefined>(ApplicationSaleConstants.CANCEL_APPLICATION_SALE_BY_ID);
export const downloadApplicationSaleById = createAction<INewActionType | undefined>(ApplicationSaleConstants.DOWNLOAD_APPLICATION_SALE_BY_ID);
export const previewApplicationSaleById = createAction<INewActionType | undefined>(ApplicationSaleConstants.PREVIEW_APPLICATION_SALE_BY_ID);
export const sendPaymentLinkApplicationSaleStatus = createAction<INewActionType | undefined>(ApplicationSaleConstants.SEND_PAYMENT_LINK_STATUS_APPLICATION_SELL);
export const sendEmailNotificationStatus = createAction<INewActionType | undefined>(ApplicationSaleConstants.SEND_EMAIL_NOTIFICATION_STATUS_APPLICATION_SELL);
export const sendSMSNotificationStatus = createAction<INewActionType | undefined>(ApplicationSaleConstants.SEND_SMS_NOTIFICATION_STATUS_APPLICATION_SELL);
export const generateFeeReceipt = createAction<INewActionType | undefined>(ApplicationSaleConstants.GENERATE_FEE_RECEIPT);
export const getPreliminaryScrutiny = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_PRELIMINARY_SCRUTINY_LIST);
export const cancelAdmissionInPreliminaryAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.CANCEL_ADMISSION_IN_PRELIMINARY);
export const getPreliminaryScrutinyDocuments = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_PRELIMINARY_SCRUTINY_DOCUMENTS);
export const updatePreliminaryScrutinyDocumentStatus = createAction<INewActionType | undefined>(ApplicationSaleConstants.UPDATE_PRELIMINARY_SCRUTINY_DOCUMENT_STATUS);
export const getPreliminaryScrutinyById = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_PRELIMINARY_SCRUTINY_BY_ID);
export const setPreliminaryScrutiny = createAction<INewActionType | undefined>(ApplicationSaleConstants.SET_PRELIMINARY_SCRUTINY);
export const setPreviewConsolidatedForm = createAction<INewActionType | undefined>(ApplicationSaleConstants.PREVIEW_CONSOLIDATED_FORM);
export const getRegistrationDetailsListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_REGISTRATION_DETAILS_LIST);
export const addRegistrationDetailsAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.ADD_REGISTRATION_DETAILS);
export const getExaminationMarksListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_EXAMINATION_MARKS_LIST);
export const getExamMarksListWhileSaveAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_EXAM_MARKS_LIST_WHILE_SAVE);
export const getExamMarksByIdAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_EXAMINATION_MARKS_BY_ID);
export const editExamMarksAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.EDIT_EXAMINATION_MARKS);
export const saveExaminationMarksAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.SAVE_EXAMINATION_MARKS);
export const getExaminationScheduleAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_EXAMINATION_SCHEDULE_LIST)
export const deleteExaminationScheduleByIdAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.DELETE_EXAMINATION_SCHEDULE_BY_ID)
export const getExaminationScheduleByIdAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_EXAMINATION_SCHEDULE_BY_ID)
export const getEnquiryListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_ENQUIRY_LIST)
export const exportEnquiryListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.EXPORT_ENQUIRY_LIST)
export const getEnquiryClassListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_ENQUIRY_CLASS_LIST)
export const getEnquiryDetailsByIdAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_ENQUIRY_DETAILS_BY_ID)
export const setAddEnquiryAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.ADD_ENQUIRY)
export const getEnquirySourceListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_ENQUIRY_SOURCE_LIST)
export const setUpdateEnquiryAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.UPDATE_ENQUIRY)
export const setUpdateEnquiryStatusAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.UPDATE_ENQUIRY_STATUS)
export const deleteEnquiryAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.DELETE_ENQUIRY)
export const getChangeStudentDetailListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_CHANGE_STUDENT_DETAIL_LIST)
export const getAllChangeStudentsListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_ALL_CHANGE_STUDENTS_LIST)
export const getChangeStudentListByIdAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_CHANGE_STUDENT_LIST_BY_ID)
export const getSecondLanForChangeStudentAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.CHANGE_SECOND_LANGUAGE)
export const getThirdLanForChangeStudentAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.CHANGE_THIRD_LANGUAGE)
export const saveChangeStudentDetailsAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.SAVE_CHANGE_STUDENT_DETAILS)
export const getSiblingVerificationListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_SIBLING_VERIFICATION_LIST);
export const getSiblingVerificationListByIdAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_SIBLING_LIST_BY_ID);
export const getSiblingVerificationListRecordsCount = createAction<INewActionType | undefined>(ApplicationSaleConstants.COUNT_SIBLING_VERIFICATION_RECORDS);
export const editSiblingVerificationStatusByIdAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.EDIT_SIBLING_VERIFICATION_STATUS);
export const acceptAdmissionApproval = createAction<INewActionType | undefined>(ApplicationSaleConstants.ACCEPT_ADMISSION_APPROVAL);
export const generateAdmissionFormPdfAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GENERATE_ADMISSION_FORM_PDF);
export const generateAdmissionFormPdf2Act = createAction<INewActionType | undefined>(ApplicationSaleConstants.GENERATE_ADMISSION_FORM_PDF2);
export const getTransportAvalabilityStatus = createAction<INewActionType | undefined>(ApplicationSaleConstants.TRANSPORT_AVALABILITY_STATUS);
export const createJodoOrder = createAction<INewActionType | undefined>(ApplicationSaleConstants.JODO_ORDER_PAY);

export const jodoPaymentStatusAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.JODO_PAYMENT_STATUS_REQUEST);
export const generateTokenForUserAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GENERATE_TOKEN_FOR_USER);
export const generateOtpForUserAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GENERATE_OTP_FOR_USER);
export const resendOtpForUserAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.RESEND_OTP_FOR_USER);
export const verifyOtpForUserAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.VERIFY_OTP_FOR_USER);
export const activeLinkAppSaleAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.ACTIVATION_LINK_APPLICATION_SALE);
export const sendReminderDocResubmissionAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.SEND_REMINDER_FOR_SCRUTINY);

export const getAmountForApplicationSaleAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_AMOUNT_FOR_APPLICATION_SALE);
 
//export application sale data
export const exportAppSaleDataAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.EXPORT_APP_SALE_DATA);

// export registration data
export const exportRegistrationDataAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.EXPORT_REGISTRATION_DATA);

// export preliminary scrutiny data
export const exportScrutinyDataAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.EXPORT_SCRUTINY_DATA);

// export exam marks list 
export const exportExamMarksListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.EXPORT_EXAM_MARKS);

// export exam marks list 
export const exportSiblingVerifyListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.EXPORT_SIBLING_VERIFY_DATA);

//export change student details
export const exportChangeStudentListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.EXPORT_CHANGE_STUDENT_LIST);

//send notification to parent for change student detail
export const sendNotifiChangeStuDetailAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.SEND_NOTIFI_CHANGE_STU_DETAIL);

// APi's for edit absent student in examination
export const getByIdExamAbsentStudentAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_BY_ID_ABSENT_STUDENT_EXAM);
export const editAbsentStudentExamAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.EDIT_ABSENT_STUDENT_EXAM);

// Change Transfer Request API's
export const getChangeTraReqListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_CHANGE_TRANSFER_REQUEST);
export const exportChangeTraReqListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.EXPORT_CHANGE_TRANSFER_REQUEST);
export const updateStatusChangeTransferAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.UPDATE_STATUS_CHANGE_TRANSFER);

export const saveEnquiryAppSaleAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.SAVE_ENQUIRY_APP_SALE);


// admission dashbord
export const getClassWiseAnalysisAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_CLASS_WISE_ANALYSIS);
export const getSourceWiseAnalysisAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_SOURCE_WISE_ANALYSIS);
export const getAdmissionSummaryAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_ADMISSION_SUMMARY);
export const getBranchClassCurriculumAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_BRANCH_CLASS_REQUEST_DASHBOARD);
export const getAdmissionAnalysisAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_ADMISSION_ANALYSIS);
export const getBranchAdmissionAnalysisAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_BRANCH_ADMISSION_ANALYSIS);
export const getAdmissionSummaryReportAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_ADMISSION_SUMMARY_REPORT);
export const getAdmissionStatsAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_ADMISSION_STATS);
export const getGenderMasterAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_GENDER_MASTER);
export const getBranchCardAnalysisAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_BRANCH_CARD_CURRICULUM);
export const getLeadConversionStatusAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_LEAD_CONVERSION_STATUS);
export const getClassListAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_CLASS_LIST);
export const getEnquiryStatsAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_ENQUIRY_STATS);
export const sendAppSaleFormLinkAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.SEND_APP_SALE_FORM_LINK);
export const getEnquiryDetailsByRefIdAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_ENQUIRY_DETAILS_BY_REF_ID);
export const getAdmissionStatsHyperlinkAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.GET_ADMISSION_STATS_HYPERLINK);

export const validateStuTcRequestAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.VALIDATE_STU_TC_REQUEST);
export const verifyTcRequestOtpAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.VERIFY_TC_REQUEST_OTP);
export const saveDownloadTcLogsAct = createAction<INewActionType | undefined>(ApplicationSaleConstants.SAVE_DOWNLOAD_TC_LOGS);