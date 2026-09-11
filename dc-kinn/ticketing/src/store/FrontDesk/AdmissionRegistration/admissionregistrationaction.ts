import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { AdmissionRegistrationConstants } from "./admissionregistrationconstant";


export const getLoggedInUserRegistrationInfoAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.LOGGEDIN_USER_REGISTRATIONINFO_REQUEST);

export const studentRegistrationsAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.STUDENT_REGISTRATIONS_REQUEST);

export const viewRegistrationDocumentAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.VIEW_REGISTRATION_DOCUMENT_REQUEST);
export const cancelAdmissionAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.CANCEL_ADMISSION_REQUEST);
export const printRegistrationFormAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.PRINT_REGISTRATION_FORM_REQUEST);
export const consolidatedViewRegistrationFormAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.CONSOLIDATED_VIEW_REGISTRATION_FORM_REQUEST);


export const admissionCategroyAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.ADMISSION_CATEGORY_LIST_REQUEST);
export const getContributeStakeholderAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.CONTRIBUTE_STAKEHOLDER_REQUEST);
export const uploadActivityCertificateAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.UPLOADED_ACTIVITY_CERTIFICATE_REQUEST);
export const registerStudentAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.REGISTER_STUDENT_REQUEST);
export const getRegisterStudentByIdAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GET_REGISTER_STUDENT_BYID_REQUEST);
export const getCoCurriculumActivityByIdAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GET_CO_CURRICULUM_BYID_REQUEST);
export const getSiblingDetailsByIdAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GET_SIBLING_DETAILS_BYID_REQUEST);
export const getCommunicationDetailsByIdAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GET_COMMUNICATION_DETAILS_BYID_REQUEST);
export const getDocumentDetailsByIdAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GET_DOCUMENT_DETAILS_BYID_REQUEST);
export const updateRegisterStudentAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.UPDATE_REGISTER_STUDENT_REQUEST);
export const updateSiblingDetailsAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.UPDATE_SIBLING_DETAILS_REQUEST);
export const addCocurriculurActivityAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.ADD_COCURICULLUR_ACTIVITY_REQUEST);
export const updateParentDetailsAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.UPDATE_PARENT_DETAILS_REQUEST);
export const getParentDetailsByRegNoAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GET_PARENT_DETAILS_BYREGNO_REQUEST);

export const addCommunicationDetailsAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.UPDATE_COMMUNICATION_DETAILS_REQUEST);


export const uploadRegDocumentAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.UPLOAD_REGISTRATION_DOCUMENT_REQUEST);

export const addAcademicResultsAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.ADD_ACADEMIC_RESULTS_REQUEST);
export const getAcademicResultsByRegNoAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GET_ACADEMIC_RESULTS_BYREGNO_REQUEST);

export const uploadRegPhotosAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.UPLOAD_REGISTRATION_PHOTOS_REQUEST);

export const generateRegistrationOtpAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GENERATE_REGISTRATION_OTP_REQUEST);
export const verifyRegistrationOtpAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.VERIFY_REGISTRATION_OTP_REQUEST);
export const submitRegistrationAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.SUBMIT_REGISTRATION_REQUEST);

export const rgistrationLinkActivateAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.REGISTRATION_LINK_ACTIVATE);


export const getSiblingForRegistrationAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GET_SIBLINGS_FOR_REGISTRATION_REQUEST);


export const getRegistrationSecondLangAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GET_REGISTRATION_SECOND_LANG_REQUEST);
export const getRegistrationThirdLangAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GET_REGISTRATION_THIRD_LANG_REQUEST);


export const generateRegistrationPdfAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GENERATE_REGISTRATION_PDF_REQUEST);

export const getRegistrationSubmissionAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.GET_REGISTRATION_SUBMISSION_REQUEST);


export const getStudentPreadmissionByRegnoAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.STUDENT_PREADMISSION_BYREGNO_REQUEST);


export const jodoRegistrationAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.JODO_REGISTRATION_REQUEST);
export const sendRegistrationInCompleteFormAct = createAction<INewActionType | undefined>(AdmissionRegistrationConstants.SET_REGISTRATION_INCOMPLETE_FORM);
