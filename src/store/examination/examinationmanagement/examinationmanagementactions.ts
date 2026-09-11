import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { ExaminationManagementConstants } from "./examinationmanagementconstancts";

export { setPreviewProgressCard, setStudentRemarksAct, setAdmitCardDetailsAct, resetAoInsideSubjectsAct , setAoGradeEntryListAct , setEyGradeEntryAct , setAoTermSubjectsAct, resetAoGradeEntryListAct, resetAoTermSubjectsAct, resetsetDownloadAdmitCardAct, resetSaveGeneralInformationAct, resetSaveGeneralStudentPhotoAct, resetGeneralInformationByIdAct,setUploadStudentSurroundingPhotoAct,setUploadFamilySurroundingPhotoAct, setLogActivityStatusAct, setSaveSurroundingAct } from "./examinationmanagementslice"

// Admit Card

export const getAdmitCardDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_ADMIT_CARD_DETAILS);
export const generateAdmitCardAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GENERATE_ADMIT_CARD);
export const downloadAdmitCardAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.DOWNLOAD_ADMIT_CARD);

// Admit card - Fetch Exam Details For Parent
export const getAdmitCardExamDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_ADMIT_CARD_EXAM_DETAILS);

//Change Student Subjects
export const getChangeStudentSubjectsDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_CHANGE_STUDENT_SUBJECTS_DETAILS);
export const saveChangeStudentSubjectsDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_CHANGE_STUDENT_SUBJECTS_DETAILS);
export const getChangeStudentSubjectsByIdDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_CHANGE_STUDENT_SUBJECTS_DETAILS_BY_ID);
export const updateChangeStudentSubjectsDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.UPDATE_CHANGE_STUDENT_SUBJECTS_DETAILS);
export const deleteChangeStudentSubjectsDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.DELETE_CHANGE_STUDENT_SUBJECTS_DETAILS);
export const deleteChangeStudentSubjectsDetailsByIdAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.DELETE_CHANGE_STUDENT_SUBJECTS_DETAILS_BY_ID);


//mark entry

export const getStudentDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_STUDENT_DETAILS);
export const getExaminationClassesAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_EXAMINATION_CLASSES);
export const getExaminationClassSubjectAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_EXAMINATION_CLASS_SUBJECTS);
export const saveEntryMarksAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_ENTRY_MARKS);
export const getCoscholasticGradesListAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_COSCHOLASTIC_GRADES_LIST);
export const downloadMarksEntryAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.DOWNLOAD_MARKS_ENTRY); 
export const uploadMarksEntryAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.UPLOAD_MARKS_ENTRY); 

//student-remarks
export const getStudentRemarksDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_STUDENT_REMARKS_DETAILS);
export const getExaminationInstituteTermsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_EXAMINATION_INSTITUTE_TERMS);
export const getStudentRemarksDescriptionAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_STUDENT_REMARKS_DESCRIPTION);
export const getStudentRemarksDetailsByIdAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_STUDENT_REMARKS_DETAILS_BY_ID);
export const editStudentRemarksDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.EDIT_STUDENT_REMARKS_DETAILS);
export const saveStudentRemarksDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_STUDENT_REMARKS_DETAILS);
export const deleteStudentRemarksDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.DELETE_STUDENT_REMARKS_DETAILS);


//Ao Selection
export const getAoTermSubjectsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_AO_TERM_SUBJECTS);
export const getAoInsideSubjectsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_AO_INSIDE_SUBJECTS);
export const saveAoTermSubjectsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_AO_TERM_SUBJECTS);
export const getAoTermSubjectsByIdAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_AO_TERM_SUBJECTS_BY_ID);
export const deleteAoTermSubjectsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.DELETE_AO_TERM_SUBJECTS);
export const updateAoTermSubjectsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.UPDATE_AO_TERM_SUBJECTS);

//Ao Grade Entry
export const getAoGradeEntryListAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_AO_GRADE_ENTRY_LIST);
export const saveAoGradeEntryListAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_AO_GRADE_ENTRY_LIST);
export const examinationSubjectsListAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.EXAMINATION_SUBJECTS_LIST);

//Ey Grade Entry
export const getEyGradeEntryDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_EY_GRADE_ENTRY_DETAILS);
export const getEntryLearnerSkillDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_ENTRY_LEARNER_SKILL_DETAILS);
export const saveEyGradeEntryListAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_EY_GRADE_ENTRY_LIST);

//Progress Card
export const getProgressCardListAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_PROGRESS_CARD_LIST);
export const generateProgressCardAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GENERATE_PROGRESS_CARD);
// EY
export const downloadProgressCardAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.DOWNLOAD_PROGRESS_CARD);
export const previewProgressCardAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.PREVIEW_PROGRESS_CARD);
export const downloadAllProgressCardsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.DOWNLOAD_ALL_PROGRESS_CARDS);
//cbse
export const downloadCbseProgressCardsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.DOWNLOAD_CBSE_PROGRESS_CARDS);
export const getFilterListForCbseAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_FILTER_LIST_FOR_CBSE);
export const getCbseProgressCardStudentAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_CBSE_PROGRESSCARD_STUDENT);

//Internal Subjects Marks Entry
export const getInternalSubjectsMarksListAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_INTERNAL_SUBJECTS_MARKS_LIST);
export const saveInternalSubjectsMarksListAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_INTERNAL_SUBJECTS_MARKS_LIST);
export const getSubjectsForInternalMarksEntryAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_SUBJECTS_FOR_INTERNAL_MARKS_ENTRY);

//student_grade_book
export const getStudentGradeReportBookAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_STUDENT_GRADE_REPORT_BOOK);
export const exportStudentGradeReportBookAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.EXPORT_STUDENT_GRADE_REPORT_BOOK);

//marks entry report
export const getMarksEntryReportListAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_MARKS_ENTRY_REPORT_LIST);
export const exportMarksEntryReportAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.EXPORT_MARKS_ENTRY_REPORT);

//dashboard
export const getExaminationDashboardDataAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_EXAMINATION_DASHBOARD_DATA);
export const getBranchWiseMarksRangeAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_BRANCH_WISE_MARKS_RANGE);
export const getMarksRangeListAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_MARKS_RANGE);
export const getSubjectAndGradeWiseAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_SUBJECT_GRADE_WISE);
export const getSubjectListForDashboardAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_SUBJECT_LIST_OF_DASHBOARD);
export const getSubjectGradeWiseAnalysisAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_SUBJECT_GRADE_WISE_ANALYSIS);
export const getClassGradeWiseAnalysisAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_CLASS_GRADE_WISE_ANALYSIS);

export const exportSectionWiseAnalysisAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.EXPORT_SECTION_WISE_ANALYSIS);

export const getClassTeacherListAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_CLASS_TEACHER_LIST);

// holistic reports
export const getFoundationStudentsProfilesListAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_FOUNDATION_STUDENTS_PROFILES_LIST)
export const saveGeneralInformationAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_GENERAL_INFORMATION);
export const saveGeneralStudentPhotoAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_GENERAL_STUDENT_PHOTO);
export const getGeneralInformationByIdAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_GENERAL_INFORMATION_BY_ID);
export const updateGeneralInformationAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.UPDATE_GENERAL_INFORMATION);
export const uploadStudentSurroundingPhotoAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.UPLOAD_STUDENT_SURROUNDING_PHOTO);
export const uploadFamilySurroundingPhotoAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.UPLOAD_FAMILY_SURROUNDING_PHOTO);
export const saveSurroundingAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_SURROUNDING);
export const updateSurroundingAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.UPDATE_SURROUNDING);
export const getDomainDetailsStudentAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_DOMAIN_DETAILS_STUDENT);
export const saveDomainStudentDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_STUDENT_DOMAIN_DETAILS);
export const updateDomainDetailsStudentAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.UPDATE_STUDENT_DOMAIN_DETAILS);
export const saveDomainSummaryAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_DOMAIN_SUMMARY);
export const getLogActivityStatusAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_LOG_ACTIVITY_STATUS);
export const saveParentCollectedStatusAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_PARENT_COLLECTED_STATUS);
export const getStudentSummaryByIdAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_STUDENT_SUMMARY_BY_ID);
export const setExportFondationStageGradeEntryAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.EXPORT_FOUNDATION_STAGE_GRADE_ENTRY);
export const copyFoundationStageGradeEntryStudentDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.COPY_FOUNDATION_STAGE_GRADE_ENTRY_STUDENT_DETAILS);


//holistic progress card
export const getHolisticProgressCardAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_HOLISTIC_PROGRESS_CARD);

export const getIgcseStudentSkillsAttributesDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_IGCSE_STUDENT_SKILLS_ATTRIBUTES_DETAILS);
export const saveIgcseStudentSkillsAttributesDetailsAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.SAVE_IGCSE_STUDENT_SKILLS_ATTRIBUTES_DETAILS);
export const getClassAnalysisReportAct = createAction<INewActionType | undefined>(ExaminationManagementConstants.GET_CLASS_ANALYSIS_REPORT);
