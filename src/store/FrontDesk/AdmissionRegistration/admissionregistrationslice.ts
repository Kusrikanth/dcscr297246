import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    IAdmissionRegistrationReducerState
} from "./admissionregistrationactiontypes";
import { IResponseErrorModel } from "../../types";

const initialState: IAdmissionRegistrationReducerState = {
    loggedInUserRegistrationInfoResp: undefined,
    studentRegistrationResp: undefined,
    viewRegistrationDocumentResp: undefined,
    cancelAdmissionResp: undefined,
    printRegistrationFormResp: undefined,
    consolidatedViewRegistrationFormResp: undefined,


    admissionCategoryResp: undefined,
    contributeStakeHolderResp: undefined,
    uploadActivityCertificateResp: undefined,
    registerStudentResp: undefined,
    updateRegisterStudentResp: undefined,
    registerStudentByIdResp: undefined,
    coCurriculumActivityByIdResp: undefined,
    siblingDetailsByIdResp: undefined,
    documentDetailsByIdResp: undefined,
    communicationDetailsByIdResp: undefined,
    addCocurrilurActivityResp: undefined,
    updateSiblingDetailsResp: undefined,
    updateParentDetailsResp: undefined,
    parentDetailsByRegNoResp: undefined,
    updateCommunicationDetailsResp: undefined,
    uploadRegDocumentResp: undefined,
    addAcademicResultResp: undefined,
    academicResultByRegnoResp: undefined,
    registrationLinkActivateResp: undefined,
    uploadRegPhotosResp: undefined,
    generateRegistrationOtpResp: undefined,
    verifyRegistrationOtpResp: undefined,
    submitRegistrationResp: undefined,
    siblingsForRegistrationResp: undefined,

    registrationSecondLangResp: undefined,
    registrationThirdLangResp: undefined,
    registrationPdfResp: undefined,
    getRegistrationSubmissionResp: undefined,

    studentPreadmissionByRegNoResp: undefined,
    registrationInCompleteFormResp:undefined,

    jodoRegistrationResp: undefined,
    admissionRegistrationErrorResp: undefined
};

export const addmissionRegistrationSlice = createSlice({
    name: "addmissionRegistration",
    initialState,
    reducers: {
        setLoggedInUserRegistrationInfoAct: (state, action: PayloadAction<any>) => {
            state.loggedInUserRegistrationInfoResp = action.payload;
        },
        setStudentRegistrationAct: (state, action: PayloadAction<any>) => {
            state.studentRegistrationResp = action.payload;
        },
        setViewRegistrationDocumentAct: (state, action: PayloadAction<any>) => {
            state.viewRegistrationDocumentResp = action.payload;
        },
        setCancelAdmissionAct: (state, action: PayloadAction<any>) => {
            state.cancelAdmissionResp = action.payload;
        },
        setPrintRegistrationFormAct: (state, action: PayloadAction<any>) => {
            state.printRegistrationFormResp = action.payload;
        },
        setConsolidatedViewRegistrationFormAct: (state, action: PayloadAction<any>) => {
            state.consolidatedViewRegistrationFormResp = action.payload;
        },


        setAdmissionCategoryAct: (state, action: PayloadAction<any>) => {
            state.admissionCategoryResp = action.payload;
        },
        setContributeStakeHolderAct: (state, action: PayloadAction<any>) => {
            state.contributeStakeHolderResp = action.payload;
        },
        setUploadActivityCertificateAct: (state, action: PayloadAction<any>) => {
            state.uploadActivityCertificateResp = action.payload;
        },
        setRegisterStudentAct: (state, action: PayloadAction<any>) => {
            state.registerStudentResp = action.payload;
        },
        setUpdateRegisterStudentAct: (state, action: PayloadAction<any>) => {
            state.updateRegisterStudentResp = action.payload;
        },
        setRegisterStudentByIdAct: (state, action: PayloadAction<any>) => {
            state.registerStudentByIdResp = action.payload;
        },
        setCoCurriculumActivityByIdAct: (state, action: PayloadAction<any>) => {
            state.coCurriculumActivityByIdResp = action.payload;
        },
        setSiblingDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.siblingDetailsByIdResp = action.payload;
        },
        setDocumentDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.documentDetailsByIdResp = action.payload;
        },
        setCommunicationDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.communicationDetailsByIdResp = action.payload;
        },
        setAddCocurrilurActivityAct: (state, action: PayloadAction<any>) => {
            state.addCocurrilurActivityResp = action.payload;
        },
        setUpdateSiblingDetailsAct: (state, action: PayloadAction<any>) => {
            state.updateSiblingDetailsResp = action.payload;
        },
        setUpdateParentDetailsAct: (state, action: PayloadAction<any>) => {
            state.updateParentDetailsResp = action.payload;
        },
        setParentDetailsByRegnoAct: (state, action: PayloadAction<any>) => {
            state.parentDetailsByRegNoResp = action.payload;
        },
        setUpdateCommunicationDetailsAct: (state, action: PayloadAction<any>) => {
            state.updateCommunicationDetailsResp = action.payload;
        },
        setUploadRegDocumentAct: (state, action: PayloadAction<any>) => {
            state.uploadRegDocumentResp = action.payload;
        },
        setAddAcademicResultAct: (state, action: PayloadAction<any>) => {
            state.addAcademicResultResp = action.payload;
        },
        setAcademicResultByRegnoAct: (state, action: PayloadAction<any>) => {
            state.academicResultByRegnoResp = action.payload;
        },
        setUploadRegPhotosAct: (state, action: PayloadAction<any>) => {
            state.uploadRegPhotosResp = action.payload;
        },
        setGenerateRegistrationOtpAct: (state, action: PayloadAction<any>) => {
            state.generateRegistrationOtpResp = action.payload;
        },
        setVerifyRegistrationOtpAct: (state, action: PayloadAction<any>) => {
            state.verifyRegistrationOtpResp = action.payload;
        },
        setSubmitRegistrationAct: (state, action: PayloadAction<any>) => {
            state.submitRegistrationResp = action.payload;
        },
        setRegistrationLinkActivateAct: (state, action: PayloadAction<any>) => {
            state.registrationLinkActivateResp = action.payload;
        },

        setSiblingsForRegistrationAct: (state, action: PayloadAction<any>) => {
            state.siblingsForRegistrationResp = action.payload;
        },

        setRegistrationSecondLangAct: (state, action: PayloadAction<any>) => {
            state.registrationSecondLangResp = action.payload;
        },
        setRegistrationThirdLangAct: (state, action: PayloadAction<any>) => {
            state.registrationThirdLangResp = action.payload;
        },

        setRegistrationPdfAct: (state, action: PayloadAction<any>) => {
            state.registrationPdfResp = action.payload;
        },

        setGetRegistrationSubmissionAct: (state, action: PayloadAction<any>) => {
            state.getRegistrationSubmissionResp = action.payload;
        },

        setStudentPreadmissionByRegNoAct: (state, action: PayloadAction<any>) => {
            state.studentPreadmissionByRegNoResp = action.payload;
        },

        setJodoRegistrationAct: (state, action: PayloadAction<any>) => {
            state.jodoRegistrationResp = action.payload;
        },
        setRegistrationInCompleteFormAct: (state, action: PayloadAction<any>) => {
            state.registrationInCompleteFormResp = action.payload;
        },

        setAdmissionRegistractionErrorAct: (
            state,
            action: PayloadAction<IResponseErrorModel>
        ) => {
            state.admissionRegistrationErrorResp = action.payload;
        },
    },
});

export const {
    setLoggedInUserRegistrationInfoAct,
    setStudentRegistrationAct, setViewRegistrationDocumentAct, setCancelAdmissionAct,
    setPrintRegistrationFormAct,
    setConsolidatedViewRegistrationFormAct,

    setAdmissionCategoryAct, setContributeStakeHolderAct,
    setUploadActivityCertificateAct,
    setRegisterStudentAct, setUpdateRegisterStudentAct, setRegisterStudentByIdAct, setCoCurriculumActivityByIdAct, setSiblingDetailsByIdAct, setDocumentDetailsByIdAct, setCommunicationDetailsByIdAct, setAddCocurrilurActivityAct,
    setUpdateSiblingDetailsAct,
    setUpdateParentDetailsAct, setParentDetailsByRegnoAct, setUpdateCommunicationDetailsAct,
    setUploadRegDocumentAct, setAddAcademicResultAct,
    setAcademicResultByRegnoAct,
    setUploadRegPhotosAct,
    setRegistrationLinkActivateAct,
    setGenerateRegistrationOtpAct, setVerifyRegistrationOtpAct, setSubmitRegistrationAct,
    setSiblingsForRegistrationAct,
    setRegistrationSecondLangAct,
    setRegistrationThirdLangAct,
    setRegistrationPdfAct,
    setGetRegistrationSubmissionAct,
    setStudentPreadmissionByRegNoAct,
    setJodoRegistrationAct,
    setRegistrationInCompleteFormAct,
    setAdmissionRegistractionErrorAct
} = addmissionRegistrationSlice.actions;

export default addmissionRegistrationSlice.reducer;



