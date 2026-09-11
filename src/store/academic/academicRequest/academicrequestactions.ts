import { createAction } from "@reduxjs/toolkit";
import { AcademicRequestConstants } from "./academicrequestconstants";
import { INewActionType } from "../../types";

export { setChangeCampusCurriculumAct, setCampusChangeStudentListAct, resetMasterSectionAct,resetSectionAnalysisAct,resetBirthdayAnniversaryAct, resetEventsListAct, resetUrlDownloadFileAct, resetUploadDocumentPreviewAct } from "./academicrequestslice";
export const changeCampusListAct = createAction<INewActionType | undefined>(AcademicRequestConstants.CHANGE_CAMPUS_LIST_REQUEST);
export const exportChangeCampusAct = createAction<INewActionType | undefined>(AcademicRequestConstants.EXPORT_CHANGE_CAMPUS);

export const changeTransferRequestAct = createAction<INewActionType | undefined>(AcademicRequestConstants.CHANGE_TRANSFER_REQUEST);

export const campusChangeStudentListAct = createAction<INewActionType | undefined>(AcademicRequestConstants.CAMPUS_CHANGE_STUDENTLIST_REQUEST);

export const addChangeCampusAct = createAction<INewActionType | undefined>(AcademicRequestConstants.ADD_CHANGE_CAMPUS_REQUEST);
export const addChangeCampusDpsAct = createAction<INewActionType | undefined>(AcademicRequestConstants.ADD_CHANGE_CAMPUS_REQUEST_DPS);

export const updateChangeCampusAct = createAction<INewActionType | undefined>(AcademicRequestConstants.UPDATE_CHANGE_CAMPUS_REQUEST);

export const deleteChangeCampusAct = createAction<INewActionType | undefined>(AcademicRequestConstants.DELETE_CHANGE_CAMPUS_REQUEST);

export const changeCampusCurriculumAct = createAction<INewActionType | undefined>(AcademicRequestConstants.CHAGE_CAMPUS_CURRICULUM_REQUEST);
export const apprRejChangeCampusAct = createAction<INewActionType | undefined>(AcademicRequestConstants.APPROVE_REJECT_CHANGECAMPUS_REQUEST);
export const oldCampusFeeLedgerAct = createAction<INewActionType | undefined>(AcademicRequestConstants.OLDCAMPUS_FEE_LEDGERS_RQUEST);
export const newCampusFeeLedgerAct = createAction<INewActionType | undefined>(AcademicRequestConstants.NEWCAMPUS_FEE_LEDGERS_RQUEST);

export const submitOldCampusLedgersAct = createAction<INewActionType | undefined>(AcademicRequestConstants.SUBMIT_OLDCAMPUS_FEELEDGERS_REQUEST);
export const submitNewCampusLedgersAct = createAction<INewActionType | undefined>(AcademicRequestConstants.SUBMIT_NEWCAMPUS_FEELEDGERS_REQUEST);


export const getAlamanacList = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_ALAMANAC_LIST_REQUEST);
export const addAlamanacAct = createAction<INewActionType | undefined>(AcademicRequestConstants.ADD_ALAMANAC_REQUEST);
export const delAlamanacAct = createAction<INewActionType | undefined>(AcademicRequestConstants.DELETE_ALAMANAC_REQUEST);

export const getUploadDocumentsAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_UPLOAD_DOCUMENTS_REQ);
export const deleteUploadDocumentsAct = createAction<INewActionType | undefined>(AcademicRequestConstants.DELETE_UPLOAD_DOCUMENTS_REQ);
export const addUploadDocumentsAct = createAction<INewActionType | undefined>(AcademicRequestConstants.ADD_UPLOAD_DOCUMENTS_REQ);
export const getSectionByMultipleClassesAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_SECTION_BY_MULTIPLE_CLASSSES);
export const getUploadDocumentPreviewAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_UPLOAD_DOCUMENT_PREVIEW);
export const exportUploadDocumentListAct = createAction<INewActionType | undefined>(AcademicRequestConstants.EXPORT_UPLOAD_DOCUMENT_LIST);

export const getUrlDownloadFileAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_URL_DOWNLOAD_FILE);

export const getWorkTypesListAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_WORK_TYPES_LIST);
export const addWorkTypesListAct = createAction<INewActionType | undefined>(AcademicRequestConstants.ADD_WORK_TYPES_LIST);
export const updateWorkTypeAct = createAction<INewActionType | undefined>(AcademicRequestConstants.UPDATE_WORK_TYPE);
export const getWorkTypeByIdAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_WORK_TYPE_BY_ID);
export const deleteWorkTypeAct = createAction<INewActionType | undefined>(AcademicRequestConstants.DELETE_WORK_TYPE);

//branch dashboard
export const getBranchDashboardStatsAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_BRANCH_DASHBOARD_STATS);
export const getSectionAnalysisAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_SECTION_ANALYSIS);
export const getSchoolStrengthAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_SCHOOL_STRENGTH);
export const getMasterSectionAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_MASTER_SECTION);
export const getAttendanceTrackerReportAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_ATTENDANCE_TRACKER_REPORT);
export const getBirthdayAnniversaryAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_BIRTHDAY_ANNIVERSARY);
export const getStudentBirthdayAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_STUDENT_BIRTHDAY);
export const exportAStudentBirthdayReportAct = createAction<INewActionType | undefined>(AcademicRequestConstants.EXPORT_STUDENT_BIRTHDAY_REPORT);
export const getEventsListAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_EVENTS_LIST);
export const getFeedsListAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_FEEDS_LIST);
export const getAppUsageStatsAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_APP_USAGE_STATS);
export const getQuickLinkAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_QUICK_LINK);
export const saveQuickLinkAct = createAction<INewActionType | undefined>(AcademicRequestConstants.SAVE_QUICK_LINK);
export const getExportAdmissionDashboardAct = createAction<INewActionType | undefined>(AcademicRequestConstants.EXPORT_ADMISSION_DASHBOARD);
export const getExportAttendanceTrackerReportAct = createAction<INewActionType | undefined>(AcademicRequestConstants.EXPORT_ATTENDANCE_TRACKER);
export const getSectionWiseLanguageAct = createAction<INewActionType | undefined>(AcademicRequestConstants.SECTION_WISE_LANGUAGE);
export const exportSectionWiseLanguageAct = createAction<INewActionType | undefined>(AcademicRequestConstants.EXPORT_SECTION_WISE_LANGUAGE);
export const getSecondLangListAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_SECOND_LANG);
export const getThirdLangListAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_THIRD_LANG);
export const getClassWiseGenderAnalysisAct = createAction<INewActionType | undefined>(AcademicRequestConstants.GET_CLASS_WISE_GENDER_ANALYSIS);