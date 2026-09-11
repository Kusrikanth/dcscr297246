import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    deleteData,
    getData,
    postData,
    putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { ApplicationSaleConstants } from "./applicationmanagmentconstants";
import {
    addApplicationSaleAct, addRegistrationDetails,
    setCreateJodoOrderAct, setJodoPaymentStatusAct,
    setApplicationSaleBySearchAct,
    setApplicationSaleByApplicationNoAct,
    cancelApplicationSaleByIdAct, deleteExaminationScheduleById, downloadApplicationSaleByIdAct, editApplicationSaleAct, generateFeeReceiptAct, getEnquiryClassList, getEnquiryDetailsById, getEnquiryList, getExaminationScheduleById, previewApplicationSaleByIdAct, sendEmailNotificationStatusAct, sendPaymentLinkApplicationSaleStatusAct, sendSMSNotificationStatusAct, setAcceptAdmissionApprovalAct, setAddEnquiry, setAllChangeStudentsListAct, setApplicationSaleByIdAct, setApplicationSaleClassListAct, setApplicationSaleErrorAct, setApplicationSaleListAct, setChangeStudentDetailListAct, setChangeStudentListByIdAct, setDeleteEnquiry, setEditSiblingVerificationStatusByIdAct, setExaminationMarksList, setExaminationScheduleList, setGenerateAdmissionFormPdfAct, setPreliminaryScrutinyById, setPreliminaryScrutinyDocumentList, setPreliminaryScrutinyList, setPreviewConsolidatedView, setRegistrationDetailsList, setSaveChangeStudentDetailsAct, setSecondLanForChangeStudentAct, setSecoundLanguageListAct,
    setThirdLanguageListAct, setSiblingVerificationListAct, setSiblingVerificationListByIdAct, setSiblingVerificationListRecordsCountAct, setStatasticAct, setStatusOfPreliminaryScrutiny, setSubjectListForCBSEAct, setSubjectListForCambridgeAct, setThirdLanForChangeStudentAct, setUpdateEnquiry, setUpdateEnquiryStatus, updatePreliminaryScrutinyDocumentStatus, setGenerateAdmissionFormPdf2Act, setVerifyOtpForUserAct, setTransportAvalabilityStatus, setGenerateTokenForUserAct, setActiveLinkAppSaleAct, setExportAppSaleAct, setExportRegistrationDataAct, setSaveExaminationMarksAct, setExamMarksListWhileSaveAct, setExamMarksByIdAct, setEditExamMarksResp, setCancelAdmissionInPreliminaryAct, setExportScrutinyDataAct, setSendReminderDocResubmissionAct, setExportExamMarksListAct, setExportSiblingVerifyListAct, setExportChangeStudentListAct, setSendNotifiChangeStuDetailAct, setByIdExamAbsentStudentAct, setEditAbsentStudentExamAct, setChangeTraReqListAct, setExportChangeTraReqListAct, setUpdateStatusChangeTransferAct,
    setAmountForApplicationSaleAct,
    setSaveEnquiryAppSaleAct,
    setGenerateOtpForUserAct,
    setResendOtpForUserAct,
    setSaveEnquiryAppSaleErrorAct,
    setClassWiseAnalysisAct,
    setSourceWiseAnalysisAct,
    setAdmissionSummaryAct,
    setBrchClassCurriculumAct,
    setBrchAdmissionCurriculumAct,
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
    setExportEnquiryListAct,
    setValidateStuTcRequestAct,
    setVerifyTcRequestOtpAct,
    setVerifyTcRequestOtpErrorAct,
    setSaveDownloadTcLogsAct,
    setAdmissionStatsHyperlinkAct,
    setEnquirySourceList,
    setApplicationRemarksByIdAct,
    setSaveApplicationRemarksByIdAct,
    setApplicationRemarksStatusAct,
} from "./applicationmanagmentslice";

function* getStatasticGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setStatasticAct(response.data));
    }
}
function* getApplicationSalesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setApplicationSaleListAct(response.data));
    }
}
function* getApplicationSalesClassListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setApplicationSaleClassListAct(response.data));
    }
}
function* getSubjectListForCBSEGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSubjectListForCBSEAct(response.data));
    }
}
function* getSubjectListForCambridgeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSubjectListForCambridgeAct(response.data));
    }
}
function* getSecoundLanguageListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSecoundLanguageListAct(response.data));
    }
}

function* getThirdLanguageListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setThirdLanguageListAct(response.data));
    }
}

function* addApplicationSaleGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    // const response = { data: { "applicationId": 58191, "status": "Saved" }, error: "" };
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(addApplicationSaleAct(response.data));
    }
}

function* editApplicationSaleGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(editApplicationSaleAct(response.data));
    }
}
function* acceptAdmissionApprovalGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setAcceptAdmissionApprovalAct(response.data));
    }
}
function* getApplicationSaleByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setApplicationSaleByIdAct(response.data));
    }
}
function* getApplicationRemarksByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setApplicationRemarksByIdAct(response.data));
    }
}
function* getApplicationRemarksStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setApplicationRemarksStatusAct(response.data));
    }
}
function* saveApplicationRemarksByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSaveApplicationRemarksByIdAct(response.data));
    }
}
function* getTransportAvalabilityStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setTransportAvalabilityStatus(response.data));
    }
}

function* getApplicationSaleByApplicationNoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleByApplicationNoAct({}));
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setApplicationSaleByApplicationNoAct(response.data));
    }
}

function* getApplicationSaleBySearchGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setApplicationSaleBySearchAct(response.data));
    }
}

function* cancelApplicationSaleByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(cancelApplicationSaleByIdAct({ statusCode: response.status }));
    }
}
function* downloadApplicationSaleByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(downloadApplicationSaleByIdAct(response.data));
    }
}
function* previewApplicationSaleByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(previewApplicationSaleByIdAct(response.data));
    }
}
function* sendPaymentLinkApplicationSaleStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(sendPaymentLinkApplicationSaleStatusAct({ statusCode: response.status }));
    }
}
function* sendEmailNotificationStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(sendEmailNotificationStatusAct({ statusCode: response.status }));
    }
}
function* sendSMSNotificationStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(sendSMSNotificationStatusAct({ statusCode: response.status }));
    }
}
function* generateFeeReceiptGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(generateFeeReceiptAct({ statusCode: response.status }));
    }
}
function* getRegistrationDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setRegistrationDetailsList(response.data));
    }
}
function* addRegistrationDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(addRegistrationDetails(response.data));
    }
}
function* getExaminationMarksListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setExaminationMarksList(response.data));
    }
}
function* getPreliminaryScrutinyGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setPreliminaryScrutinyList(response.data));
    }
}
function* getExamMarksListWhileSaveGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setExamMarksListWhileSaveAct(response.data));
    }
}
function* getPreliminaryScrutinyDocumentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setPreliminaryScrutinyDocumentList(response.data));
    }
}
function* updatePreliminaryScrutinyDocumentStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(updatePreliminaryScrutinyDocumentStatus(response.data));
    }
}
function* getPreliminaryScrutinyByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setPreliminaryScrutinyById(response.data));
    }
}
function* setPreliminaryScrutinyGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setStatusOfPreliminaryScrutiny({ statusCode: response.status }));
    }
}
function* setPreviewConsolidatedFormGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setPreviewConsolidatedView(response.data));
    }
}
function* getExaminationScheduleListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setExaminationScheduleList(response.data));
    }
}
function* deleteExaminationScheduleByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(deleteExaminationScheduleById({ statusCode: response.status }));
    }
}
function* getExaminationScheduleByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(getExaminationScheduleById(response.data));
    }
}
function* getEnquiryListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(getEnquiryList(response.data));
    }
}
function* getExportEnquiryListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setExportEnquiryListAct(response.data));
    }
}
function* getEnquiryClassListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(getEnquiryClassList(response.data));
    }
}
function* getEnquiryDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(getEnquiryDetailsById(response.data));
    }
}
function* setAddEnquiryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setAddEnquiry({ statusCode: response.status }));
    }
}
function* setUpdateEnquiryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setUpdateEnquiry({ statusCode: response.status }));
    }
}
function* setUpdateEnquiryStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setUpdateEnquiryStatus({ statusCode: response.status }));
    }
}
function* setDeleteEnquiryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setDeleteEnquiry({ statusCode: response.status }));
    }
}
function* getChangeStudentDetailListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setChangeStudentDetailListAct(response.data));
    }
}
function* getAllChangeStudentsListActGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setAllChangeStudentsListAct(response.data));
    }
}
function* getChangeStudentListByIdActGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setChangeStudentListByIdAct(response.data));
    }
}

function* getSecondLanForChangeStudentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSecondLanForChangeStudentAct(response.data));
    }
}

function* getThirdLanForChangeStudentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setThirdLanForChangeStudentAct(response.data));
    }
}
function* setSaveChangeStudentDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSaveChangeStudentDetailsAct(response));
    }
}
function* getSiblingVerificationListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSiblingVerificationListAct(response.data));
    }
}
function* getSiblingVerificationListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSiblingVerificationListByIdAct(response.data));
    }
}
function* getSiblingVerificationListRecordsCountGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSiblingVerificationListRecordsCountAct(response.data));
    }
}
function* getGenerateAdmissionFormPdfGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setGenerateAdmissionFormPdfAct(response.data));
    }
}
function* generateTokenForUserGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setGenerateTokenForUserAct(response.data));
    }
}
function* verifyOtpForUserGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setVerifyOtpForUserAct({ statusCode: response.status }));
    }
}
function* getGenerateAdmissionFormPdf2Gen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setGenerateAdmissionFormPdf2Act(response.data));
    }
}
function* editSiblingVerificationStatusByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setEditSiblingVerificationStatusByIdAct(response));
    }
}
function* activeLinkAppSaleGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setActiveLinkAppSaleAct(response));
    }
}
function* getExportAppSaleDataGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setExportAppSaleAct(response.data));
    }
}
function* getExportRegistrationDataGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setExportRegistrationDataAct(response.data));
    }
}
function* saveExaminationMarksGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSaveExaminationMarksAct(response.data));
    }
}
function* editExamMarksGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setEditExamMarksResp(response.data));
    }
}
function* getExamMarksByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setExamMarksByIdAct(response.data));
    }
}
function* cancelAdmissionInPreliminaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setCancelAdmissionInPreliminaryAct(response));
    }
}
function* sendReminderDocResubmissionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSendReminderDocResubmissionAct(response));
    }
}
function* exportScrutinyDataGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setExportScrutinyDataAct(response.data));
    }
}
function* exportExamMarksListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setExportExamMarksListAct(response.data));
    }
}
function* exportSiblingVerifyListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setExportSiblingVerifyListAct(response.data));
    }
}
function* exportChangeStudentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setExportChangeStudentListAct(response.data));
    }
}
function* sendNotifiChangeStuDetailGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSendNotifiChangeStuDetailAct(response));
    }
}
function* getByIdExamAbsentStudentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setByIdExamAbsentStudentAct(response.data));
    }
}
function* editAbsentStudentExamGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setEditAbsentStudentExamAct({ statusCode: response.status }));
    }
}
function* getChangeTraReqListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setChangeTraReqListAct(response.data));
    }
}
function* exportChangeTraReqListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setExportChangeTraReqListAct(response.data));
    }
}
function* getAmountForApplicationSaleGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setAmountForApplicationSaleAct(response.data));
    }
}
function* updateStatusChangeTransferGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setUpdateStatusChangeTransferAct({ statusCode: response.status }));
    }
}
function* createJodoOrderGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    // const response = {
    //     data: {
    //         "status": "success",
    //         "data": {
    //             "order_id": "gAAAAAAAAAAAcy_NwaNloWi3ereDc2Fo8i7Zt-koFhbFHh8NnSp5hXVzKKfL9mhNyS8RWdMrEBvzQ7WDEvwVRKodPQQNRwFYUw==",
    //             "redirect_url": "https://pay.devtest1.jodopay.com/pages/djh4gAQHQJUF3rmS?order=gAAAAAAAAAAAcy_NwaNloWi3ereDc2Fo8i7Zt-koFhbFHh8NnSp5hXVzKKfL9mhNyS8RWdMrEBvzQ7WDEvwVRKodPQQNRwFYUw==&callback_url=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20="
    //         },
    //         "request_id": "M6EPRiHIBcwEMcg="
    //     },
    //     error: ""
    // }
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setCreateJodoOrderAct(response.data));
    }
}

function* jodoPaymentStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setJodoPaymentStatusAct(response.data));
    }
}

function* saveEnquiryAppSaleGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setSaveEnquiryAppSaleErrorAct(response.error));
    } else {
        yield put(setSaveEnquiryAppSaleAct(response.data));
    }
}

function* generateOtpForUserGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setGenerateOtpForUserAct(response.data));
    }
}

function* resendOtpForUserGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setResendOtpForUserAct(response.data));
    }
}

function* getClassWiseAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setClassWiseAnalysisAct(response.data));
    }
}

function* getSourceWiseAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSourceWiseAnalysisAct(response.data));
    }
}

function* getAdmissionSummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setAdmissionSummaryAct(response.data));
    }
}

function* getBranchClassCurriculumGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setBrchClassCurriculumAct(response.data));
    }
}

function* getBranchAdmissionCurriculumGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setBrchAdmissionCurriculumAct(response.data));
    }
}

function* getAdmissionAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setAdmissionAnalysisAct(response.data));
    }
}

function* getAdmissionSummaryReportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setAdmissionSummaryReportAct(response.data));
    }
}

function* getAdmissionStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setAdmissionStatsRespAct(response.data));
    }
}

function* getGenderMasterGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setGenderMasterAct(response.data));
    }
}

function* getBrchCardCurriculumGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setBrchCardCurriculumAct(response.data));
    }
}

function* getLeadConversionStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setLeadConversionStatusAct(response.data));
    }
}
function* getClassListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setClassListAct(response.data));
    }
}
function* getEnquiryStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setEnquiryStatsAct(response.data));
    }
}

function* sendAppSaleFormLinkGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setSendAppSaleFormLinkAct({ statusCode: response.status }));
    }
}

function* getEnquiryDetailsByRefIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setSaveEnquiryAppSaleErrorAct(response.error));
    } else {
        yield put(setEnquiryDetailsByRefIdAct(response.data));
    }
}

function* validateStuTcRequestGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setValidateStuTcRequestAct(response.data));
    }
}
function* getAdmissionStatsHyperlinkGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setAdmissionStatsHyperlinkAct(response.data));
    }
}

function* verifyTcRequestOtpGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setVerifyTcRequestOtpErrorAct(response.error));
    } else {
        yield put(setVerifyTcRequestOtpAct(response.data));
    }
}

function* saveDownloadTcLogsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setVerifyTcRequestOtpErrorAct(response.error));
    } else {
        yield put(setSaveDownloadTcLogsAct(response.data));
    }
}

function* getEnquirySourceListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setApplicationSaleErrorAct(response.error));
    } else {
        yield put(setEnquirySourceList(response.data));
    }
}

export default function* applicationSaleSaga() {
    yield takeLatest(ApplicationSaleConstants.GET_STATASTIC, getStatasticGen);
    yield takeLatest(ApplicationSaleConstants.GET_APPLICATION_SALE_LIST, getApplicationSalesListGen);
    yield takeLatest(ApplicationSaleConstants.GET_APPLICATION_SALE_CLASS_LIST, getApplicationSalesClassListGen);
    yield takeLatest(ApplicationSaleConstants.GET_SUBJECT_LIST_CBSE, getSubjectListForCBSEGen);
    yield takeLatest(ApplicationSaleConstants.GET_SUBJECT_LIST_CAMBRIDGE, getSubjectListForCambridgeGen);
    yield takeLatest(ApplicationSaleConstants.GET_SECOUND_LANGUAGE_LIST, getSecoundLanguageListGen);
    yield takeLatest(ApplicationSaleConstants.GET_THIRD_LANGUAGE_LIST, getThirdLanguageListGen);
    yield takeLatest(ApplicationSaleConstants.ADD_APPLICATION_SALE, addApplicationSaleGen);
    yield takeLatest(ApplicationSaleConstants.EDIT_APPLICATION_SALE, editApplicationSaleGen);
    yield takeLatest(ApplicationSaleConstants.GET_APPLICATION_SALE_BY_ID, getApplicationSaleByIdGen);
    yield takeLatest(ApplicationSaleConstants.GET_APPLICATION_REMARKS_BY_ID, getApplicationRemarksByIdGen);
    yield takeLatest(ApplicationSaleConstants.GET_APPLICATION_REMARKS_STATUS, getApplicationRemarksStatusGen);
    yield takeLatest(ApplicationSaleConstants.SAVE_APPLICATION_REMARKS_BY_ID, saveApplicationRemarksByIdGen);
    yield takeLatest(ApplicationSaleConstants.GET_APPLICATION_SALE_BYAPPLICATION_NO, getApplicationSaleByApplicationNoGen);
    yield takeLatest(ApplicationSaleConstants.GET_APPLICATION_SALE_BYSEARCH, getApplicationSaleBySearchGen);
    yield takeLatest(ApplicationSaleConstants.CANCEL_APPLICATION_SALE_BY_ID, cancelApplicationSaleByIdGen);
    yield takeLatest(ApplicationSaleConstants.DOWNLOAD_APPLICATION_SALE_BY_ID, downloadApplicationSaleByIdGen);
    yield takeLatest(ApplicationSaleConstants.PREVIEW_APPLICATION_SALE_BY_ID, previewApplicationSaleByIdGen);
    yield takeLatest(ApplicationSaleConstants.SEND_PAYMENT_LINK_STATUS_APPLICATION_SELL, sendPaymentLinkApplicationSaleStatusGen);
    yield takeLatest(ApplicationSaleConstants.SEND_EMAIL_NOTIFICATION_STATUS_APPLICATION_SELL, sendEmailNotificationStatusGen);
    yield takeLatest(ApplicationSaleConstants.SEND_SMS_NOTIFICATION_STATUS_APPLICATION_SELL, sendSMSNotificationStatusGen);
    yield takeLatest(ApplicationSaleConstants.GENERATE_FEE_RECEIPT, generateFeeReceiptGen);
    yield takeLatest(ApplicationSaleConstants.GET_REGISTRATION_DETAILS_LIST, getRegistrationDetailsListGen);
    yield takeLatest(ApplicationSaleConstants.ADD_REGISTRATION_DETAILS, addRegistrationDetailsGen);
    yield takeLatest(ApplicationSaleConstants.GET_EXAMINATION_MARKS_LIST, getExaminationMarksListGen);
    yield takeLatest(ApplicationSaleConstants.GET_PRELIMINARY_SCRUTINY_LIST, getPreliminaryScrutinyGen);
    yield takeLatest(ApplicationSaleConstants.GET_PRELIMINARY_SCRUTINY_DOCUMENTS, getPreliminaryScrutinyDocumentGen);
    yield takeLatest(ApplicationSaleConstants.UPDATE_PRELIMINARY_SCRUTINY_DOCUMENT_STATUS, updatePreliminaryScrutinyDocumentStatusGen);
    yield takeLatest(ApplicationSaleConstants.GET_PRELIMINARY_SCRUTINY_BY_ID, getPreliminaryScrutinyByIdGen);
    yield takeLatest(ApplicationSaleConstants.SET_PRELIMINARY_SCRUTINY, setPreliminaryScrutinyGen);
    yield takeLatest(ApplicationSaleConstants.PREVIEW_CONSOLIDATED_FORM, setPreviewConsolidatedFormGen);
    yield takeLatest(ApplicationSaleConstants.GET_EXAMINATION_SCHEDULE_LIST, getExaminationScheduleListGen);
    yield takeLatest(ApplicationSaleConstants.DELETE_EXAMINATION_SCHEDULE_BY_ID, deleteExaminationScheduleByIdGen);
    yield takeLatest(ApplicationSaleConstants.GET_EXAMINATION_SCHEDULE_BY_ID, getExaminationScheduleByIdGen);
    yield takeLatest(ApplicationSaleConstants.GET_ENQUIRY_LIST, getEnquiryListGen);
    yield takeLatest(ApplicationSaleConstants.EXPORT_ENQUIRY_LIST, getExportEnquiryListGen);
    yield takeLatest(ApplicationSaleConstants.GET_ENQUIRY_CLASS_LIST, getEnquiryClassListGen);
    yield takeLatest(ApplicationSaleConstants.GET_ENQUIRY_DETAILS_BY_ID, getEnquiryDetailsByIdGen);
    yield takeLatest(ApplicationSaleConstants.ADD_ENQUIRY, setAddEnquiryGen);
    yield takeLatest(ApplicationSaleConstants.UPDATE_ENQUIRY, setUpdateEnquiryGen);
    yield takeLatest(ApplicationSaleConstants.UPDATE_ENQUIRY_STATUS, setUpdateEnquiryStatusGen);
    yield takeLatest(ApplicationSaleConstants.DELETE_ENQUIRY, setDeleteEnquiryGen);
    yield takeLatest(ApplicationSaleConstants.GET_ENQUIRY_SOURCE_LIST, getEnquirySourceListGen);
    yield takeLatest(ApplicationSaleConstants.GET_SIBLING_VERIFICATION_LIST, getSiblingVerificationListGen);
    yield takeLatest(ApplicationSaleConstants.GET_CHANGE_STUDENT_DETAIL_LIST, getChangeStudentDetailListGen);
    yield takeLatest(ApplicationSaleConstants.GET_ALL_CHANGE_STUDENTS_LIST, getAllChangeStudentsListActGen);
    yield takeLatest(ApplicationSaleConstants.GET_CHANGE_STUDENT_LIST_BY_ID, getChangeStudentListByIdActGen);
    yield takeLatest(ApplicationSaleConstants.CHANGE_SECOND_LANGUAGE, getSecondLanForChangeStudentGen);
    yield takeLatest(ApplicationSaleConstants.CHANGE_THIRD_LANGUAGE, getThirdLanForChangeStudentGen);
    yield takeLatest(ApplicationSaleConstants.SAVE_CHANGE_STUDENT_DETAILS, setSaveChangeStudentDetailsGen);
    yield takeLatest(ApplicationSaleConstants.GET_SIBLING_LIST_BY_ID, getSiblingVerificationListByIdGen);
    yield takeLatest(ApplicationSaleConstants.COUNT_SIBLING_VERIFICATION_RECORDS, getSiblingVerificationListRecordsCountGen);
    yield takeLatest(ApplicationSaleConstants.EDIT_SIBLING_VERIFICATION_STATUS, editSiblingVerificationStatusByIdGen);
    yield takeLatest(ApplicationSaleConstants.ACCEPT_ADMISSION_APPROVAL, acceptAdmissionApprovalGen);
    yield takeLatest(ApplicationSaleConstants.GENERATE_ADMISSION_FORM_PDF, getGenerateAdmissionFormPdfGen);
    yield takeLatest(ApplicationSaleConstants.GENERATE_ADMISSION_FORM_PDF2, getGenerateAdmissionFormPdf2Gen);
    yield takeLatest(ApplicationSaleConstants.TRANSPORT_AVALABILITY_STATUS, getTransportAvalabilityStatusGen);
    yield takeLatest(ApplicationSaleConstants.JODO_ORDER_PAY, createJodoOrderGen);
    yield takeLatest(ApplicationSaleConstants.JODO_PAYMENT_STATUS_REQUEST, jodoPaymentStatusGen);
    yield takeLatest(ApplicationSaleConstants.GENERATE_TOKEN_FOR_USER, generateTokenForUserGen);
    yield takeLatest(ApplicationSaleConstants.VERIFY_OTP_FOR_USER, verifyOtpForUserGen);
    yield takeLatest(ApplicationSaleConstants.ACTIVATION_LINK_APPLICATION_SALE, activeLinkAppSaleGen);
    yield takeLatest(ApplicationSaleConstants.EXPORT_APP_SALE_DATA, getExportAppSaleDataGen);
    yield takeLatest(ApplicationSaleConstants.EXPORT_REGISTRATION_DATA, getExportRegistrationDataGen);
    yield takeLatest(ApplicationSaleConstants.SAVE_EXAMINATION_MARKS, saveExaminationMarksGen);
    yield takeLatest(ApplicationSaleConstants.GET_EXAM_MARKS_LIST_WHILE_SAVE, getExamMarksListWhileSaveGen);
    yield takeLatest(ApplicationSaleConstants.GET_EXAMINATION_MARKS_BY_ID, getExamMarksByIdGen);
    yield takeLatest(ApplicationSaleConstants.EDIT_EXAMINATION_MARKS, editExamMarksGen);
    yield takeLatest(ApplicationSaleConstants.CANCEL_ADMISSION_IN_PRELIMINARY, cancelAdmissionInPreliminaryGen);
    yield takeLatest(ApplicationSaleConstants.EXPORT_SCRUTINY_DATA, exportScrutinyDataGen);
    yield takeLatest(ApplicationSaleConstants.SEND_REMINDER_FOR_SCRUTINY, sendReminderDocResubmissionGen);
    yield takeLatest(ApplicationSaleConstants.EXPORT_EXAM_MARKS, exportExamMarksListGen);
    yield takeLatest(ApplicationSaleConstants.EXPORT_SIBLING_VERIFY_DATA, exportSiblingVerifyListGen);
    yield takeLatest(ApplicationSaleConstants.EXPORT_CHANGE_STUDENT_LIST, exportChangeStudentListGen);
    yield takeLatest(ApplicationSaleConstants.SEND_NOTIFI_CHANGE_STU_DETAIL, sendNotifiChangeStuDetailGen);
    yield takeLatest(ApplicationSaleConstants.GET_BY_ID_ABSENT_STUDENT_EXAM, getByIdExamAbsentStudentGen);
    yield takeLatest(ApplicationSaleConstants.EDIT_ABSENT_STUDENT_EXAM, editAbsentStudentExamGen);
    yield takeLatest(ApplicationSaleConstants.GET_CHANGE_TRANSFER_REQUEST, getChangeTraReqListGen);
    yield takeLatest(ApplicationSaleConstants.EXPORT_CHANGE_TRANSFER_REQUEST, exportChangeTraReqListGen);
    yield takeLatest(ApplicationSaleConstants.UPDATE_STATUS_CHANGE_TRANSFER, updateStatusChangeTransferGen);
    yield takeLatest(ApplicationSaleConstants.GET_AMOUNT_FOR_APPLICATION_SALE, getAmountForApplicationSaleGen);
    yield takeLatest(ApplicationSaleConstants.SAVE_ENQUIRY_APP_SALE, saveEnquiryAppSaleGen);
    yield takeLatest(ApplicationSaleConstants.GENERATE_OTP_FOR_USER, generateOtpForUserGen);
    yield takeLatest(ApplicationSaleConstants.RESEND_OTP_FOR_USER, resendOtpForUserGen);
    yield takeLatest(ApplicationSaleConstants.GET_CLASS_WISE_ANALYSIS, getClassWiseAnalysisGen);
    yield takeLatest(ApplicationSaleConstants.GET_SOURCE_WISE_ANALYSIS, getSourceWiseAnalysisGen);
    yield takeLatest(ApplicationSaleConstants.GET_ADMISSION_SUMMARY, getAdmissionSummaryGen);
    yield takeLatest(ApplicationSaleConstants.GET_BRANCH_CLASS_REQUEST_DASHBOARD, getBranchClassCurriculumGen);
    yield takeLatest(ApplicationSaleConstants.GET_ADMISSION_ANALYSIS, getAdmissionAnalysisGen);
    yield takeLatest(ApplicationSaleConstants.GET_BRANCH_ADMISSION_ANALYSIS, getBranchAdmissionCurriculumGen)
    yield takeLatest(ApplicationSaleConstants.GET_ADMISSION_SUMMARY_REPORT, getAdmissionSummaryReportGen);
    yield takeLatest(ApplicationSaleConstants.GET_ADMISSION_STATS, getAdmissionStatsGen);
    yield takeLatest(ApplicationSaleConstants.GET_GENDER_MASTER, getGenderMasterGen);
    yield takeLatest(ApplicationSaleConstants.GET_BRANCH_CARD_CURRICULUM, getBrchCardCurriculumGen);
    yield takeLatest(ApplicationSaleConstants.GET_LEAD_CONVERSION_STATUS, getLeadConversionStatusGen);
    yield takeLatest(ApplicationSaleConstants.GET_CLASS_LIST, getClassListGen);
    yield takeLatest(ApplicationSaleConstants.GET_ENQUIRY_STATS, getEnquiryStatsGen);
    yield takeLatest(ApplicationSaleConstants.SEND_APP_SALE_FORM_LINK, sendAppSaleFormLinkGen);
    yield takeLatest(ApplicationSaleConstants.GET_ENQUIRY_DETAILS_BY_REF_ID, getEnquiryDetailsByRefIdGen);
    yield takeLatest(ApplicationSaleConstants.VALIDATE_STU_TC_REQUEST, validateStuTcRequestGen);
    yield takeLatest(ApplicationSaleConstants.VERIFY_TC_REQUEST_OTP, verifyTcRequestOtpGen);
    yield takeLatest(ApplicationSaleConstants.SAVE_DOWNLOAD_TC_LOGS, saveDownloadTcLogsGen);
    yield takeLatest(ApplicationSaleConstants.GET_ADMISSION_STATS_HYPERLINK, getAdmissionStatsHyperlinkGen);

}