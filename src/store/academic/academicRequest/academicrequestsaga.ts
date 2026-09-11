import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setChangeCampusListAct, setCampusChangeStudentListAct, setAddChangeCampusAct,
    setUpdateChangeCampusAct, setDelChangeCampusAct, setApprRejChangeCampusAct, setOldCampusFeeLedgerAct,
    setNewCampusFeeLedgerAct, setSubmitOldCampusLedgersAct,
    setSubmitNewCampusLedgersRespAct,
    setChangeCampusCurriculumAct,
    setAlamanacListAct,
    setAddAlamanacAct, setDelAlamanacAct,
    setAcademicRequestErrorAct,
    setUploadDocumentsAct,
    setDeleteUploadDocumentsAct,
    setWorkTypesListAct,
    setSectionByMultipleClassesAct,
    setAddWorkTypesListAct,
    setAddUploadDocumentsAct,
    setBranchDashboardStatsAct,
    setSectionAnalysisAct,
    setSchoolStrengthAct,
    setMasterSectionAct,
    setAttendanceTrackerReportAct,
    setBirthdayAnniversaryAct,
    setStudentBirthdayAct,
    setEventsListAct,
    seetFeedsListAct,
    setAppUsageStatsAct,
    setQuickLinkAct,
    saveQuickLinkAct,
    exportAdmissionDashboardAct,
    exportAttendanceTrackerReportAct,
    setSectionWiseLanguageAct,
    setThirdLangListAct,
    setSecondLangListAct,
    setExportSectionWiseLanguageAct,
    setExportChangeCampusAct,
    setUrlDownloadFileAct,
    setUploadDocumentPreviewAct,
    exportUploadDocumentListAct,
    setUpdateWorkTypeAct,
    setGetWorkTypeByIdAct,
    setDeleteWorkTypeAct,
    setClassWiseGenderAnalysisAct,
    setAddChangeCampusDpsAct,
    setExportStudentBirthdayReportAct
} from "./academicrequestslice";
import { AcademicRequestConstants } from "./academicrequestconstants";
import {
    deleteData,
    getData,
    postData,
    putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getChangeCampusListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setChangeCampusListAct(response.data));
    }
}
function* getChangeTransferRequestGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setChangeCampusListAct(response.data));
    }
}

function* campusChangeStudentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setCampusChangeStudentListAct(response.data));
    }
}


function* addChangeCampusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setAddChangeCampusAct({ statusCode: response.status }));
    }
}

function* addChangeCampusDpsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setAddChangeCampusDpsAct({ statusCode: response.status }));
    }
}

function* updateChangeCampusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setUpdateChangeCampusAct(response.data));
    }
}

function* deleteChangeCampusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setDelChangeCampusAct(response?.data));
    }
}

function* apprRejChangeCampusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setApprRejChangeCampusAct(response?.data));
    }
}

function* oldCampusFeeLedgerGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setOldCampusFeeLedgerAct(response?.data));
    }
}

function* newCampusFeeLedgerGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setNewCampusFeeLedgerAct(response?.data));
    }
}

function* submitOldCampusLedgersGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setSubmitOldCampusLedgersAct(response?.data));
    }
}

function* submitNewCampusLedgersGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setSubmitNewCampusLedgersRespAct({ statusCode: response.status }));
    }
}


function* getChangeCampusCurriculumGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setChangeCampusCurriculumAct(response.data));
    }
}

// ,
//     , setDelAlamanacAct,

function* getAlamanacListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setAlamanacListAct(response.data));
    }
}

function* addAlamanacGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setAddAlamanacAct(response.data));
    }
}

function* delAlamanacGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setDelAlamanacAct({ statusCode: response.status }));
    }
}

function* getUploadDocumentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setUploadDocumentsAct(response.data));
    }
}

function* deleteUploadDocumentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setDeleteUploadDocumentsAct({ statusCode: response.status }));
    }
}
function* getWorkTypesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setWorkTypesListAct(response.data));
    }
}

function* updateWorkTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setUpdateWorkTypeAct({ statusCode: response.status }));
    }
}

function* getWorkTypeByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setGetWorkTypeByIdAct(response.data));
    }
}

function* deleteWorkTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setDeleteWorkTypeAct({ statusCode: response.status }));
    }
}

function* getSectionByMultipleClassesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setSectionByMultipleClassesAct(response.data));
    }
}
function* getUploadDocumentPreviewGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setUploadDocumentPreviewAct(response.data));
    }
}
function* exportUploadDocumentListGen(action: ICreatedActionType): any {    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(exportUploadDocumentListAct(response.data));
    }
}
function* addWorkTypesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setAddWorkTypesListAct({ statusCode: response.status }));
    }
}
function* addUploadDocumentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setAddUploadDocumentsAct({ statusCode: response.status }));
    }
}


function* getBranchDashboardStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setBranchDashboardStatsAct(response.data));
    }
}

function* getSectionAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setSectionAnalysisAct(response.data));
    }
}

function* getSchoolStrengthGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setSchoolStrengthAct(response.data));
    }
}

function* getMasterSectionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setMasterSectionAct(response.data));
    }
}

function* getAttendanceTrackerReportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setAttendanceTrackerReportAct(response.data));
    }
}

function* getBirthdayAnniversaryGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setBirthdayAnniversaryAct(response.data));
    }
}

function* getStudentBirthdayGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setStudentBirthdayAct(response.data));
    }
}

function* exportStudentBirthdayReportGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setExportStudentBirthdayReportAct(response.data));
    }
}

function* getEventsListGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setEventsListAct(response.data));
    }
}
function* getFeedsListGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(seetFeedsListAct(response.data));
    }
}
function* getAppUsageStatsGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setAppUsageStatsAct(response.data));
    }
}
function* getQuickLinkGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setQuickLinkAct(response.data));
    }
}

function* saveQuickLinkGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(saveQuickLinkAct({ statusCode: response.status }));
    }
}
function* exportAdmissionDashboardGen(action: ICreatedActionType): any {
    const { payload } = action;
    const newPayload = {
        endpoint : payload.endpoint,
        payload: {...payload.payload},
        optionalConfig: {...payload.optionalConfig}
    }
    delete newPayload.payload.name
    const response = yield call(getData, newPayload.endpoint, newPayload.payload, newPayload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(exportAdmissionDashboardAct({data:response.data, name: payload.payload.name}));
    }
}


function* exportAttendanceTrackerReportGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(exportAttendanceTrackerReportAct(response.data));
    }
}

function* getSectionWiseLanguageGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setSectionWiseLanguageAct(response.data));
    }
}

function* getThirdLangListGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setThirdLangListAct(response.data));
    }
}

function* getSecondLangListGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setSecondLangListAct(response.data));
    }
}

function* exportSectionWiseLanguageGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setExportSectionWiseLanguageAct(response.data));
    }
}
function* exportChangeCampusGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setExportChangeCampusAct(response.data));
    }
}

function* getUrlDownloadFileGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setUrlDownloadFileAct(response.data));
    }
}
function* getClassWiseGenderAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicRequestErrorAct(response.error));
    } else {
        yield put(setClassWiseGenderAnalysisAct(response.data));
    }
}

export default function* masterFeeSettingsSaga() {
    yield takeLatest(AcademicRequestConstants.CHANGE_CAMPUS_LIST_REQUEST, getChangeCampusListGen);
    yield takeLatest(AcademicRequestConstants.CHANGE_TRANSFER_REQUEST, getChangeTransferRequestGen);

    yield takeLatest(AcademicRequestConstants.CAMPUS_CHANGE_STUDENTLIST_REQUEST, campusChangeStudentListGen);

    yield takeLatest(AcademicRequestConstants.ADD_CHANGE_CAMPUS_REQUEST, addChangeCampusGen);
    yield takeLatest(AcademicRequestConstants.ADD_CHANGE_CAMPUS_REQUEST_DPS, addChangeCampusDpsGen);
    yield takeLatest(AcademicRequestConstants.UPDATE_CHANGE_CAMPUS_REQUEST, updateChangeCampusGen);
    yield takeLatest(AcademicRequestConstants.DELETE_CHANGE_CAMPUS_REQUEST, deleteChangeCampusGen);
    yield takeLatest(AcademicRequestConstants.APPROVE_REJECT_CHANGECAMPUS_REQUEST, apprRejChangeCampusGen);
    yield takeLatest(AcademicRequestConstants.OLDCAMPUS_FEE_LEDGERS_RQUEST, oldCampusFeeLedgerGen);
    yield takeLatest(AcademicRequestConstants.NEWCAMPUS_FEE_LEDGERS_RQUEST, newCampusFeeLedgerGen);


    yield takeLatest(AcademicRequestConstants.SUBMIT_OLDCAMPUS_FEELEDGERS_REQUEST, submitOldCampusLedgersGen);
    yield takeLatest(AcademicRequestConstants.SUBMIT_NEWCAMPUS_FEELEDGERS_REQUEST, submitNewCampusLedgersGen);


    yield takeLatest(AcademicRequestConstants.CHAGE_CAMPUS_CURRICULUM_REQUEST, getChangeCampusCurriculumGen);

    yield takeLatest(AcademicRequestConstants.GET_ALAMANAC_LIST_REQUEST, getAlamanacListGen);
    yield takeLatest(AcademicRequestConstants.ADD_ALAMANAC_REQUEST, addAlamanacGen);
    yield takeLatest(AcademicRequestConstants.DELETE_ALAMANAC_REQUEST, delAlamanacGen);

    yield takeLatest(AcademicRequestConstants.GET_UPLOAD_DOCUMENTS_REQ, getUploadDocumentsGen);
    yield takeLatest(AcademicRequestConstants.DELETE_UPLOAD_DOCUMENTS_REQ, deleteUploadDocumentsGen);
    yield takeLatest(AcademicRequestConstants.ADD_UPLOAD_DOCUMENTS_REQ, addUploadDocumentsGen);
    yield takeLatest(AcademicRequestConstants.GET_SECTION_BY_MULTIPLE_CLASSSES, getSectionByMultipleClassesGen);
    yield takeLatest(AcademicRequestConstants.GET_UPLOAD_DOCUMENT_PREVIEW, getUploadDocumentPreviewGen);
    yield takeLatest(AcademicRequestConstants.EXPORT_UPLOAD_DOCUMENT_LIST, exportUploadDocumentListGen);

    yield takeLatest(AcademicRequestConstants.GET_URL_DOWNLOAD_FILE, getUrlDownloadFileGen);

    yield takeLatest(AcademicRequestConstants.GET_WORK_TYPES_LIST, getWorkTypesListGen);
    yield takeLatest(AcademicRequestConstants.ADD_WORK_TYPES_LIST, addWorkTypesListGen);
    yield takeLatest(AcademicRequestConstants.UPDATE_WORK_TYPE, updateWorkTypeGen);
    yield takeLatest(AcademicRequestConstants.GET_WORK_TYPE_BY_ID, getWorkTypeByIdGen);
    yield takeLatest(AcademicRequestConstants.DELETE_WORK_TYPE, deleteWorkTypeGen);

    yield takeLatest(AcademicRequestConstants.GET_BRANCH_DASHBOARD_STATS, getBranchDashboardStatsGen);
    yield takeLatest(AcademicRequestConstants.GET_SECTION_ANALYSIS, getSectionAnalysisGen);
    yield takeLatest(AcademicRequestConstants.GET_SCHOOL_STRENGTH, getSchoolStrengthGen);
    yield takeLatest(AcademicRequestConstants.GET_MASTER_SECTION, getMasterSectionGen);
    yield takeLatest(AcademicRequestConstants.GET_ATTENDANCE_TRACKER_REPORT, getAttendanceTrackerReportGen);
    yield takeLatest(AcademicRequestConstants.GET_BIRTHDAY_ANNIVERSARY, getBirthdayAnniversaryGen);
    yield takeLatest(AcademicRequestConstants.GET_STUDENT_BIRTHDAY, getStudentBirthdayGen);
    yield takeLatest(AcademicRequestConstants.EXPORT_STUDENT_BIRTHDAY_REPORT, exportStudentBirthdayReportGen);
    yield takeLatest(AcademicRequestConstants.GET_EVENTS_LIST, getEventsListGen);
    yield takeLatest(AcademicRequestConstants.GET_FEEDS_LIST, getFeedsListGen);
    yield takeLatest(AcademicRequestConstants.GET_APP_USAGE_STATS, getAppUsageStatsGen);
    yield takeLatest(AcademicRequestConstants.GET_QUICK_LINK, getQuickLinkGen);
    yield takeLatest(AcademicRequestConstants.SAVE_QUICK_LINK, saveQuickLinkGen);
    yield takeLatest(AcademicRequestConstants.EXPORT_ADMISSION_DASHBOARD, exportAdmissionDashboardGen);
    yield takeLatest(AcademicRequestConstants.EXPORT_ATTENDANCE_TRACKER, exportAttendanceTrackerReportGen);
    yield takeLatest(AcademicRequestConstants.SECTION_WISE_LANGUAGE, getSectionWiseLanguageGen);
    yield takeLatest(AcademicRequestConstants.EXPORT_SECTION_WISE_LANGUAGE, exportSectionWiseLanguageGen);
    yield takeLatest(AcademicRequestConstants.GET_SECOND_LANG, getSecondLangListGen);
    yield takeLatest(AcademicRequestConstants.GET_THIRD_LANG, getThirdLangListGen);
    yield takeLatest(AcademicRequestConstants.EXPORT_CHANGE_CAMPUS, exportChangeCampusGen);
    yield takeLatest(AcademicRequestConstants.GET_CLASS_WISE_GENDER_ANALYSIS, getClassWiseGenderAnalysisGen);
}