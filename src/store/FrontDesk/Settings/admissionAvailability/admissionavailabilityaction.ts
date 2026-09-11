import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../../types";
import { AdmissionAvailabilityConstants } from "./admissionavailabilityconstant";


export {
    resetPanelEmployeesListAct, setExamSubjectsByClassAct,setClassWiseDocumentsListByIdAct,setStuListAppTrackerAct,
    setExamSubjectsListById , setAdmissionAvailablityClassListAct,setUnassignClassWiseDocumentsListAct,setRegistrationInstructionAct, resetApplicationBannerAct,
} from "./admissionavailabilityslice"
// admission availability module
export const admissionAvailabilityListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.ADMISSION_LIST_REQUEST);
export const admissionAvailabilityClassListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.ADMISSION_CLASS_LIST_REQUEST);
export const addAdmissionAvailability = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.ADD_ADMISSION_AVAILABILTY);
export const getAdmissionAvailablityByIdAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.ADMISSION_AVAILABILTY_BY_ID);
export const editAdmissionAvailability = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EDIT_ADMISSION_AVAILABILTY);

// age criteria module
export const ageCriteriaListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.AGE_CRITERIA_LIST_REQUEST);
export const ageCriteriaByIdAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.AGE_CRITERIA_BY_ID_REQUEST);
export const generateAgeCriteria = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GENERATE_AGE_CRITERIA);
export const editAgeCriteriaByIdAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EDIT_AGE_CRITERIA);

// exam subjects module
export const examSubjectsListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EXAM_SUBJECTS_LIST);
export const addExamSubjectsListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.ADD_EXAM_SUBJECT);
export const editExamSubjectsListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EDIT_EXAM_SUBJECT);
export const getExamSubjectsByIdAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EXAM_SUBJECTS_BY_ID_REQUEST);
export const getExamSubjectStreamListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EXAM_SUBJECT_STREAM_LIST);
export const getAllSubjectsByClassAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EXAM_SUBJECT_ALL_SUBJECTS_BY_CLASS);

// panel member module
export const panelMembersListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.PANEL_MEMBERS_LIST);
export const getPanelEmployeesListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.PANEL_EMPLOYEES_LIST);
export const addPanelMemberAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.ADD_PANEL_MEMBER);
export const getPanelMemberByIdAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.PANEL_MEMBER_BY_ID_REQUEST);
export const editPanelMemberAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EDIT_PANEL_MEMBER);
export const exportPanelMemberListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EXPORT_PANEL_MEMBER_LIST);

// evaluation process module
export const getEvaluationProcessList = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EVALUATION_PROCESS_LIST);
export const getInstituteEvaluationList = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.INSTITUTE_EVALUATION_LIST);
export const getClassesForEvaluation = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.CLASSES_FOR_EVALUATION_LIST);
export const addEvaluationProcessAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.ADD_EVALUATION_PROCESS);
export const classesForAddEvaluationAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.CLASSES_FOR_ADD_EVALUATION);
export const getEvaluationProcessListByIdAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EVALUATION_PROCESS_LIST_BY_ID);
export const editEvaluationProcessAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EDIT_EVALUATION_PROCESS);

//Master-Documents
export const getMasterDocumentsListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_MASTER_DOCUMENTS_LIST);
export const getMasterDocumentsListByIdAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_MASTER_DOCUMENTS_BY_ID);
export const editMasterDocumentsListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EDIT_MASTER_DOCUMENTS);
export const saveMasterDocumentsListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.SAVE_MASTER_DOCUMENTS);
export const deleteMasterDocumentsListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.DELETE_MASTER_DOCUMENTS);

//Master-Documents
export const getClassWiseDocumentsListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_CLASS_WISE_DOCUMENTS_LIST);
export const getClassWiseDocumentsListByIdAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_CLASS_WISE_DOCUMENTS_LIST_BY_ID);
export const getUnassignClassWiseDocumentsListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_UNASSIGN_CLASS_WISE_DOCUMENTS_LIST);
export const editClassWiseListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EDIT_CLASS_WISE_DOCUMENTS);
export const getClassWiseDocumentsListByDocumentAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_CLASS_WISE_DOCUMENTS_BY_ID);
export const saveClassWiseDocumentsListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.SAVE_CLASS_WISE_DOCUMENTS);
export const deleteClassWiseDocumentsListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.DELETE_CLASS_WISE_DOCUMENTS);

// Admission Facility
export const getAdmissionFacilitysListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_ADMISSION_FACILITY_LIST);
export const getAdmissionFacilitysListByIdAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_ADMISSION_FACILITY_LIST_BY_ID);
export const editAdmissionFacilitysListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EDIT_ADMISSION_FACILITY);
export const saveAdmissionFacilitysListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.SAVE_ADMISSION_FACILITY);
export const deleteAdmissionFacilitysListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.DELETE_ADMISSION_FACILITY);

//application-sale
export const getRegistrationInstructionAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_REGISTRATION_INSTRUCTION);
export const getRegistrationInstructionSecondAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_REGISTRATION_INSTRUCTION_SECOND);
export const getApplicationDetailsByCurriculumAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_APPLICATION_DETAILS_BY_CURRICULUM);

export const getStuAppTrackerListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.STU_APP_TRACKER_LIST);
export const getStuListAppTrackerAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_STU_LIST_APP_TRACKER);

export const getOtpSettingKeyAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_OTP_SETTING_KEY);

// OptionalSubjects
export const getOptionalSubjectsListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_OPTIONAL_SUBJECTS_LIST)
export const getOptionalSubjectItemByIdAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_OPTIONAL_SUBJECTS_ITEM_BY_ID)
export const saveOptionalSubjectItemsAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.SAVE_OPTIONAL_SUBJECTS_ITEM)
export const editOptionalSubjectItemAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.EDIT_OPTIONAL_SUBJECTS_ITEM)
export const delOptionalSubjectItemAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.DEL_OPTIONAL_SUBJECTS_ITEM)

//Application-Banner

export const getApplicationBannerAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_APPLICATION_BANNER);
export const saveApplicationBannerAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.SAVE_APPLICATION_BANNER);

//signature
export const getAdmissionSignatureListAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_ADMISSION_SIGNATURE_LIST);
export const saveAdmissionSignatureAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.SAVE_ADMISSION_SIGNATURE);
export const updateAdmissionSignatureAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.UPDATE_ADMISSION_SIGNATURE);
export const getAdmissionSignatureByIdAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.GET_ADMISSION_SIGNATURE_BY_ID);
export const deleteAdmissionSignatureAct = createAction<INewActionType | undefined>(AdmissionAvailabilityConstants.DELETE_ADMISSION_SIGNATURE);
