import { createAction } from "@reduxjs/toolkit";
import { ClassroomManagmentConstants } from "./classroommanagmentconstants";
import { INewActionType } from "../../types";

export {
  setTcRequestAct, resetTcRequestByIdAct, setPromotedClassList,
  setStudentLedgerTcAct, setSectionListAct, getStudentListForTcReqAct,
  getBonafideCertificateByIdAct, resetClassroomManagement, resetNonEligibleHigherClassStudentList, resetRollNoList, resetGenerateIdStatus, resetCurriculumStudentList, resetPromotedStudentList, resetStreamChangeStudentList, resetNotDetentionedPromotionedStudentList, resetLedgersOfDetainedOrPromotedAct, resetClassListForStreamChangeAct, resetDetainedOrPromotedClassList, resetSectionListAct
} from './classroommanagmentslice'

export const getBranchCurriculumList = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.GET_BRANCH_CURRICULUM_LIST
);
export const getAcademicClassList = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.GET_ACADEMIC_CLASS_LIST
);
export const getSectionList = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.GET_SECTION_LIST
);
export const getStreamClassList = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.GET_STREAM_CLASS_LIST
);
export const getHigherClassStudentList = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.GET_HIGHER_CLASS_STUDENT_LIST
);
export const getNonEligibleHigherClassStudentList = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.GET_NON_ELIGIBLE_HIGHER_CLASS_STUDENT_LIST
);
export const setHigherClassStudentList = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.SET_HIGHER_CLASS_STUDENT_LIST
);
export const removePromotionAct = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.REMOVE_PROMOTION_REQUEST
);
export const deletePromotionAct = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.DELETE_PROMOTION_REQUEST
);
export const getSectionDetailsById = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.GET_SECTION_DETAILS_BY_ID
);
export const updateClassroom = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.UPDATE_CLASSROOM
);
export const updateClassroomTeacher = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.UPDATE_CLASSROOM_TEACHER
);
export const updateSectionStudents = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.UPDATE_SECTION_STUDENTS
);
export const getClassroomList = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.GET_CLASSROOM_LIST
);
export const getUnassignedStudentList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_UNASSIGNED_STUDENT_LIST);
export const getStudentListBySection = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.GET_STUDENT_LIST_BY_SECTION
);
export const getTeacherList = createAction<INewActionType | undefined>(
  ClassroomManagmentConstants.GET_TEACHER_LIST
);
export const setAssignStudentToSection = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.ASSIGN_STUDENT_TO_SECTION);
export const setRemoveStudentToSection = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.REMOVE_STUDENT_TO_SECTION);

export const getGenerateRollNo = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_GENERATE_ROLL_NO);

export const updateStuRollNoAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.UPDATE_STU_ROLL_NO);

export const generateIdStatus = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_GENERATE_ID_STATUS);

export const getRollNoList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_ROLL_NO_LIST);

export const assignRollNo = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.ASSIGN_ROLL_NO);

export const getStreamChangeRequestList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_STREAM_CHANGE_REQUEST_LIST);

export const getClassListForChangeStream = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_CLASS_LIST_CHANGE_STREAM);

export const getStreamChangeStudentList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_STREAM_CHANGE_STUDENT_LIST);
export const setStreamChangeRequest = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.SET_STREAM_CHANGE_REQUEST);
export const approveRejectStreamChangeReq = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.APPROVE_REJECT_STREAM_CHANGE_REQUEST);
export const getChangeCurriculumList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_CHANGE_CURRICULUM_LIST);
export const getCurriculumStudentListResp = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_CURRICULUM_STUDENT_LIST);
export const RaiseChangeCurriculumReq = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.SET_CHANGE_CURRICULUM_REQ);
export const approveRejectCurriculumChangeReq = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.APPROVE_REJECT_CURRICULUM_CHANGE_REQUEST);
export const getPromotedStudentList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.PROMOTED_STUDENT_LIST);
export const getHigherClassStudentForPromotion = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.HIGHER_CLASS_STUDENT_FOR_PROMOTION);
export const promoteHigherClassStudent = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.PROMOTE_HIGHER_CLASS_STUDENT);
export const getCurriculumList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.CURRICULUM_LIST);
export const getClassList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.CLASS_LIST);
export const getSectionSubjectList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.SECTION_SUBJECT_LIST);
export const getPromotedClassList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.PROMOTED_CLASS_LIST);
export const getDetentionPromotionStudentList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.DETENTION_PROMOTION_STUDENT_LIST);
export const getNotDetentionedPromotionedStudentList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.NOT_DETENTIONED_PROMOTIONED_STUDENT_LIST);
export const getPromotedOrDetainedClassList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.PROMOTED_OR_DETAINED_CLASS_LIST);
export const getLedgersOfDetainedOrPromotedAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.LEDGER_OF_PROMOTED_DETAINED_STUDENT_REQUEST);

export const setPromotionDetentionStudent = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.PROMOTE_DETAINE_STUDENT);
export const setApproveRejectPromotionDetentionReq = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.APPROVE_REJECT_PROMOTION_DETENTION_REQ);

export const getTcRequestList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_TC_REQUEST_LIST);
export const exportTcRequestListAct = createAction<INewActionType | undefined>(ClassroomManagmentConstants.EXPORT_TC_REQUEST_LIST);
export const getTcRequestById = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_TC_REQUEST_BY_ID);
export const getStudentListForTcReq = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_STUDENT_LIST_FOR_TC_REQ);
export const getStudentDetailsTcAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_STUDENT_DETAILS_TC_REQUEST);
export const getStudentLedgerTcAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_STUDENT_LEDGER_TC_REQUEST);
export const getTcConsolidatedListAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.TC_CONSOLIDATED_VIEW);

export const getStudentListForBonafideCertificate = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_STUDENT_LIST_FOR_BONAFIDE_CERTIFICATE);
export const setTcReqRes = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.ADD_TC_REQUEST);
export const setEditTcReqRes = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.EDIT_TC_REQUEST);
export const setBonafideCertificateRes = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.ADD_BONAFIDE_CERTIFICATE);
export const setBonafideCumStudyCertificateRes = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.BONAFIDE_CUM_STUDY_CERTIFICATE);
export const setTcRequestPreviewRes = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.PREVIEW_TC_REQUEST);
export const getTcReqLogRes = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_TC_REQUEST_LOG);
export const getInitialTcIssuance = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_INITIAL_TC_ISSUANCE);
export const getTcIssuanceByIdAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.TCISSUANCE_BYID_REQUEST);
export const updateTcIssuanceAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.UPDATE_TCISSUANCE_REQUEST);
export const setCertificateIssuance = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.SET_CERTIFICATE_ISSUANCE);
export const cancelTcRequestRes = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.CANCEL_TC_REQUEST);
export const getTcApprovalStatus = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.TC_APPROVAL_STATUS_LIST);
export const tcApproveRejectAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.TC_APPROVE_REJECT_REQUEST);
export const setIssueTcRequest = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.ISSUE_TC_REQUEST);
export const setSMSNotification = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.SMS_NOTIFICATION);
export const setEmailNotification = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.EMAIL_NOTIFICATION);
export const bonafideCerificateList = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.BONAFIDE_CERTIFICATE_LIST);
export const bonafideCertiSendEmailAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.BONAFIDE_SEND_EMAIL);
export const sendEmailNotification = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.SEND_EMAIL_NOTIFICATION);
export const parentCollectedStatus = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.PARENT_COLLECTED_STATUS);
export const bonafideCertificateDetailsById = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.BONAFIDE_CERTIFICATE_BY_ID);
export const updateBonafideCertificateDetails = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.UPDATE_BONAFIDE_CERTIFICATE_DETAILS);
export const issueBonafideCertificate = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.ISSUE_BONAFIDE_CERTIFICATE);
export const previewBonafideCertificate = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.PREVIEW_BONAFIDE_CERTIFICATE);
export const saveHealthFormAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.SAVE_HEALTH_FORM);
export const getHealthFormListAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.HEALTH_FORM_LIST);
export const updateHealthFormStatusAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.UPDATE_HEALTH_FORM_STATUS);
export const getStuHealthFormListAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.FETCH_STU_HEALTH_FORM);
export const downloadStaticHealthFormAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.DOWNLOAD_STATIC_FORM);
export const exportHigherClassEligiAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.EXPORT_HIGHER_CLASS_ELIGIBILITY);
export const exportDetentionPromotionAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.EXPORT_DETENTION_PROMOTION);
export const exportPromoteStudentsAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.EXPORT_PROMOTE_STUDENTS);
export const exportBonafiedListAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.EXPORT_BONAFIED_LIST);
export const exportTcListAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.EXPORT_TC_LIST);
export const sectionListFilterAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.SET_SECTION_LIST_FILTER);
export const deleteSectionListAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.DELETE_SECTION_LIST);
export const fetchStudentAcademicYearDataAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.FETCH_STUDENT_ACADEMIC_YEAR);
export const getCustomTcCertificateAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_CUSTOM_TC_CERTIFICATE);
export const getDepartMentApprovalAct = createAction<
  INewActionType | undefined
>(ClassroomManagmentConstants.GET_DEPARTMENT_APPROVAL);
