import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { AdmissionRegistrationConstants } from "./admissionregistrationconstant";
import {
    deleteData,
    getData,
    postData,
    putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import {

    setLoggedInUserRegistrationInfoAct,
    setStudentRegistrationAct,
    setViewRegistrationDocumentAct, setCancelAdmissionAct,
    setPrintRegistrationFormAct,
    setConsolidatedViewRegistrationFormAct,

    setAdmissionCategoryAct,
    setContributeStakeHolderAct,
    setUploadActivityCertificateAct,
    setRegisterStudentAct, setUpdateRegisterStudentAct, setRegisterStudentByIdAct,
    setAddCocurrilurActivityAct,
    setUpdateSiblingDetailsAct,
    setUpdateParentDetailsAct, setParentDetailsByRegnoAct, setUpdateCommunicationDetailsAct,
    setUploadRegDocumentAct, setAddAcademicResultAct,
    setAcademicResultByRegnoAct,
    setUploadRegPhotosAct,
    setAdmissionRegistractionErrorAct,
    setCoCurriculumActivityByIdAct,
    setSiblingDetailsByIdAct,
    setCommunicationDetailsByIdAct,
    setGenerateRegistrationOtpAct, setVerifyRegistrationOtpAct, setSubmitRegistrationAct,
    setDocumentDetailsByIdAct,
    setSiblingsForRegistrationAct,
    setRegistrationLinkActivateAct,
    setRegistrationSecondLangAct,
    setRegistrationThirdLangAct,
    setGetRegistrationSubmissionAct,
    setRegistrationPdfAct,
    setStudentPreadmissionByRegNoAct,
    setJodoRegistrationAct,
    setRegistrationInCompleteFormAct
} from "./admissionregistrationslice";


function* getLoggedInUserRegistrationInfoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setLoggedInUserRegistrationInfoAct(response.data));
    }
}

function* studentRegistrationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setStudentRegistrationAct(response.data));
    }
}

function* cancelAdmissionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setCancelAdmissionAct({ statusCode: response.status }));
    }
}



function* printRegistrationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setPrintRegistrationFormAct(response.data));
    }
}


function* consolidatedViewGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setConsolidatedViewRegistrationFormAct(response.data));
    }
}


function* getAdmissionCategoryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setAdmissionCategoryAct(response.data));
    }
}

function* getContributeStakeHolderGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setContributeStakeHolderAct(response.data));
    }
}


function* uploadActivityCertificateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        const { optionalConfig } = payload,
            { uploadFileId } = optionalConfig,
            updatedUplodedResp = response.data;
        Object.assign(updatedUplodedResp, { uploadFileId });
        yield put(setUploadActivityCertificateAct(updatedUplodedResp));
    }
}

function* addRegisterStudentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    // const response: any = {
    //     data: { "registrationId": 36159, "regNo": "R1232341" }, error: null
    // };

    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setRegisterStudentAct(response.data));
    }
}

function* updateStudentRegistrationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setUpdateRegisterStudentAct(response.data));
    }
}

function* getRegisterStudentByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setRegisterStudentByIdAct(response.data));
    }
}
function* getCoCurriculumActivityByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setCoCurriculumActivityByIdAct(response.data));
    }
}
function* getSiblingDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setSiblingDetailsByIdAct(response.data));
    }
}
function* getCommunicationDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setCommunicationDetailsByIdAct(response.data));
    }
}
function* getDocumentDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setDocumentDetailsByIdAct(response.data));
    }
}

function* addCocurriculurActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setAddCocurrilurActivityAct(response.data));
    }
}


function* updateSiblingDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setUpdateSiblingDetailsAct(response.data));
    }
}

function* updateParentDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setUpdateParentDetailsAct(response.data));
    }
}

function* getParentDetailsByRegNoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setParentDetailsByRegnoAct(response.data));
    }
}

function* addCommunicationDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setUpdateCommunicationDetailsAct(response.data));
    }
}


function* uploadRegDocumentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        const { optionalConfig } = payload,
            { uploadFileId } = optionalConfig,
            updatedUplodedResp = response.data;
        Object.assign(updatedUplodedResp, { uploadFileId });
        yield put(setUploadRegDocumentAct(updatedUplodedResp));
    }
}

function* addAcademicResultsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setAddAcademicResultAct(response.data));
    }
}


function* getAcademicResultsByRegNoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setAcademicResultByRegnoAct(response.data));
    }
}

function* registrationLinkActivateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setRegistrationLinkActivateAct(response));
    }
}

function* uploadRegPhotosGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setUploadRegPhotosAct(response.data));
    }
}


function* generateRegistrationOtpGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setGenerateRegistrationOtpAct({ status: response.status }));
    }
}

function* verifyRegistrationOtpGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setVerifyRegistrationOtpAct(response.data));
    }
}



function* getSiblingForRegistrationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setSiblingsForRegistrationAct(response.data));
    }
}


function* submitRegistrationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setSubmitRegistrationAct(response.data));
    }
}


function* getRegistrationSecondLangGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setRegistrationSecondLangAct(response.data));
    }
}

function* getRegistrationThirdLangGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setRegistrationThirdLangAct(response.data));
    }
}

function* generateRegistrationPdfGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setRegistrationPdfAct(response.data));
    }
}


function* getRegistrationSubmissionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setGetRegistrationSubmissionAct(response.data));
    }
}


function* getStudentPreadmissionByRegnoAct(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setStudentPreadmissionByRegNoAct(response.data));
    }
}

function* jogoRegistrationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setJodoRegistrationAct({ statusCode: response.status }));
    }
}
function* registrationInCompleteFormGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAdmissionRegistractionErrorAct(response.error));
    } else {
        yield put(setRegistrationInCompleteFormAct({ statusCode: response.status }));
    }
}

export default function* addmissionRegistrationSaga() {
    yield takeLatest(AdmissionRegistrationConstants.LOGGEDIN_USER_REGISTRATIONINFO_REQUEST, getLoggedInUserRegistrationInfoGen);
    yield takeLatest(AdmissionRegistrationConstants.STUDENT_REGISTRATIONS_REQUEST, studentRegistrationGen);

    yield takeLatest(AdmissionRegistrationConstants.CANCEL_ADMISSION_REQUEST, cancelAdmissionGen);
    yield takeLatest(AdmissionRegistrationConstants.PRINT_REGISTRATION_FORM_REQUEST, printRegistrationGen);

    yield takeLatest(AdmissionRegistrationConstants.CONSOLIDATED_VIEW_REGISTRATION_FORM_REQUEST, consolidatedViewGen);

    yield takeLatest(AdmissionRegistrationConstants.ADMISSION_CATEGORY_LIST_REQUEST, getAdmissionCategoryGen);
    yield takeLatest(AdmissionRegistrationConstants.CONTRIBUTE_STAKEHOLDER_REQUEST, getContributeStakeHolderGen);
    yield takeLatest(AdmissionRegistrationConstants.UPLOADED_ACTIVITY_CERTIFICATE_REQUEST, uploadActivityCertificateGen);
    yield takeLatest(AdmissionRegistrationConstants.REGISTER_STUDENT_REQUEST, addRegisterStudentGen);
    yield takeLatest(AdmissionRegistrationConstants.UPDATE_REGISTER_STUDENT_REQUEST, updateStudentRegistrationGen);

    yield takeLatest(AdmissionRegistrationConstants.GET_REGISTER_STUDENT_BYID_REQUEST, getRegisterStudentByIdGen);
    yield takeLatest(AdmissionRegistrationConstants.GET_CO_CURRICULUM_BYID_REQUEST, getCoCurriculumActivityByIdGen);
    yield takeLatest(AdmissionRegistrationConstants.GET_SIBLING_DETAILS_BYID_REQUEST, getSiblingDetailsByIdGen);
    yield takeLatest(AdmissionRegistrationConstants.GET_COMMUNICATION_DETAILS_BYID_REQUEST, getCommunicationDetailsByIdGen);
    yield takeLatest(AdmissionRegistrationConstants.GET_DOCUMENT_DETAILS_BYID_REQUEST, getDocumentDetailsByIdGen);
    yield takeLatest(AdmissionRegistrationConstants.ADD_COCURICULLUR_ACTIVITY_REQUEST, addCocurriculurActivityGen);

    yield takeLatest(AdmissionRegistrationConstants.UPDATE_SIBLING_DETAILS_REQUEST, updateSiblingDetailsGen);
    yield takeLatest(AdmissionRegistrationConstants.UPDATE_PARENT_DETAILS_REQUEST, updateParentDetailsGen);
    yield takeLatest(AdmissionRegistrationConstants.GET_PARENT_DETAILS_BYREGNO_REQUEST, getParentDetailsByRegNoGen);

    yield takeLatest(AdmissionRegistrationConstants.UPDATE_COMMUNICATION_DETAILS_REQUEST, addCommunicationDetailsGen);


    yield takeLatest(AdmissionRegistrationConstants.UPLOAD_REGISTRATION_DOCUMENT_REQUEST, uploadRegDocumentGen);
    yield takeLatest(AdmissionRegistrationConstants.ADD_ACADEMIC_RESULTS_REQUEST, addAcademicResultsGen);
    yield takeLatest(AdmissionRegistrationConstants.GET_ACADEMIC_RESULTS_BYREGNO_REQUEST, getAcademicResultsByRegNoGen);

    yield takeLatest(AdmissionRegistrationConstants.UPLOAD_REGISTRATION_PHOTOS_REQUEST, uploadRegPhotosGen);



    yield takeLatest(AdmissionRegistrationConstants.GENERATE_REGISTRATION_OTP_REQUEST, generateRegistrationOtpGen);
    yield takeLatest(AdmissionRegistrationConstants.VERIFY_REGISTRATION_OTP_REQUEST, verifyRegistrationOtpGen);
    yield takeLatest(AdmissionRegistrationConstants.SUBMIT_REGISTRATION_REQUEST, submitRegistrationGen);

    yield takeLatest(AdmissionRegistrationConstants.REGISTRATION_LINK_ACTIVATE, registrationLinkActivateGen);

    yield takeLatest(AdmissionRegistrationConstants.GET_SIBLINGS_FOR_REGISTRATION_REQUEST, getSiblingForRegistrationGen);


    yield takeLatest(AdmissionRegistrationConstants.GET_REGISTRATION_SECOND_LANG_REQUEST, getRegistrationSecondLangGen);
    yield takeLatest(AdmissionRegistrationConstants.GET_REGISTRATION_THIRD_LANG_REQUEST, getRegistrationThirdLangGen);
    yield takeLatest(AdmissionRegistrationConstants.GENERATE_REGISTRATION_PDF_REQUEST, generateRegistrationPdfGen);

    yield takeLatest(AdmissionRegistrationConstants.GET_REGISTRATION_SUBMISSION_REQUEST, getRegistrationSubmissionGen);

    yield takeLatest(AdmissionRegistrationConstants.STUDENT_PREADMISSION_BYREGNO_REQUEST, getStudentPreadmissionByRegnoAct);
    yield takeLatest(AdmissionRegistrationConstants.JODO_REGISTRATION_REQUEST, jogoRegistrationGen);
    yield takeLatest(AdmissionRegistrationConstants.SET_REGISTRATION_INCOMPLETE_FORM, registrationInCompleteFormGen);

}
