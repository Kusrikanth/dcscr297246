import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { ExaminationSettingsConstants } from "./examinationsettingsconstants";
export {
    setCbseExaminationSubjectsListAct, setIgseTermNameListAct,
    setSubjectsListAct, setCoscholasticSubjectsListAct, setCbseExaminationListAct, resetSubjectListAct, resetIgseTermNameListAct
} from "./examinationsettingsslice"

//Cbse Settings

//Examination-Tab
export const getCbseExaminationListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_LIST);
export const getExaminationTermListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_EXAMINATION_TERM_LIST);
export const getCbseExaminationListByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_LIST_BY_ID);
export const editCbseExaminationListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.EDIT_CBSE_EXAMINATION_LIST);
export const saveCbseExaminationListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_LIST);
export const deleteCbseExaminationListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_CBSE_EXAMINATION_LIST);
export const changeDisplayOrderExamAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.CHANGE_DISPLAY_ORDER_EXAM);
export const getExamCategoryAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_EXAM_CATEGORY);

//Examination-Weightage
export const getCbseWeightageListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_WEIGHTAGE_LIST);
export const getCbseWeightageListByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_WEIGHTAGE_LIST_BY_ID);
export const editCbseWeightageListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.EDIT_CBSE_WEIGHTAGE_LIST);
export const saveCbseWeightageListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_CBSE_WEIGHTAGE_LIST);
export const deleteCbseWeightageListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_CBSE_WEIGHTAGE_LIST);

//Examination-Subjects
export const getCbseExaminationSubjectsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_SUBJECTS_LIST);
export const changeDisplayOrderExaminationSubjectsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.CHANGE_DISPLAY_ORDER_EXAMINATION_SUBJECTS_LIST);
export const getSubjectsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_SUBJECTS_LIST);
export const getCbseExaminationSubjectsListByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_SUBJECTS_LIST_BY_ID);
export const editCbseExaminationSubjectsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.EDIT_CBSE_EXAMINATION_SUBJECTS_LIST);
export const saveCbseExaminationSubjectsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_SUBJECTS_LIST);
export const deleteCbseExaminationSubjectsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_CBSE_EXAMINATION_SUBJECTS_LIST);

//Examination-Coscholastic-Grades
export const getCbseExaminationCoscholasticGradesListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_COSCHOLASTIC_GRADES_LIST);
export const getCoscholasticSubjectsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_COSCHOLASTIC_SUBJECTS_LIST);
export const getCbseExaminationCoscholasticGradesListByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_COSCHOLASTIC_GRADES_LIST_BY_ID);
export const editCbseExaminationCoscholasticGradesListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.EDIT_CBSE_EXAMINATION_COSCHOLASTIC_GRADES_LIST);
export const saveCbseExaminationCoscholasticGradesListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_COSCHOLASTIC_GRADES_LIST);
export const deleteCbseExaminationCoscholasticGradesListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_CBSE_EXAMINATION_COSCHOLASTIC_GRADES_LIST);
export const copyCbseExaminationCoscholasticGradesAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.COPY_CBSE_EXAMINATION_COSCHOLASTIC_GRADES);

// AddMultipleExam Marks
export const getCbseExaminationMultipleExamMarksAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_MULTIPLE_EXAM_MARKS);
export const getCbseExaminationMultipleExamMarksByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_MULTIPLE_EXAM_MARKS_BY_ID);
export const saveCbseExaminationMultipleExamMarksAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_MULTIPLE_EXAM_MARKS);
export const editCbseExaminationMultipleExamMarksByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.EDIT_CBSE_EXAMINATION_MULTIPLE_EXAM_MARKS_BY_ID);
export const deleteCbseExaminationMultipleExamMarksAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_CBSE_EXAMINATION_MULTIPLE_EXAM_MARKS_BY_ID);

//OverAllGrades
export const getCbseExaminationOverAllGradesAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_OVER_ALL_GRADES);
export const getCbseExaminationOverAllGradesByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_OVER_ALL_GRADES_BY_ID);
export const saveCbseExaminationOverAllGradesAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_OVER_ALL_GRADES);
export const editCbseExaminationOverAllGradesByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.EDIT_CBSE_EXAMINATION_OVER_ALL_GRADES_BY_ID);
export const deleteCbseExaminationOverAllGradesByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_CBSE_EXAMINATION_OVER_ALL_GRADES_BY_ID);
export const copyCbseExaminationOverAllGradesAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.COPY_CBSE_EXAMINATION_OVER_ALL_GRADES);
export const getOverallGradeColorListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_OVERALL_GRADE_COLOR_LIST);
export const saveOverallGradeColorAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_OVERALL_GRADE_COLOR);

//Examination-Marks
export const getCbseExaminationMarksListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_MARKS_LIST);
export const getCbseExaminationMarksByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_MARKS_BY_ID);
export const editCbseExaminationMarksAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.EDIT_CBSE_EXAMINATION_MARKS);
export const saveCbseExaminationMarksAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_MARKS);
export const deleteCbseExaminationMarksAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_CBSE_EXAMINATION_MARKS);

//Skill Entry
export const getSkillEntryListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_SKILL_ENTRY_LIST);
export const saveSkillEntryAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_SKILL_ENTRY);
export const deleteSkillEntryAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_SKILL_ENTRY);
export const getSkillEntryByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_SKILL_ENTRY_BY_ID);
export const updateSkillEntryAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_SKILL_ENTRY);

// Ao Mapping
export const getSubjectListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_SUBJECT_LIST);
export const getModelSubjectListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_MODEL_SUBJECT_LIST);
export const getAoMappingSubjectAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_AO_MAPPING_SUBJECTS);
export const saveAoMappingSubjectAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_AO_MAPPING_SUBJECTS);
export const deleteAoMappingSubjectAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_AO_MAPPING_SUBJECTS);
export const updateAoMappingSubjectAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_AO_MAPPING_SUBJECTS);
export const getAoMappingSubjectByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_AO_MAPPING_SUBJECTS_BY_ID);

//signature
export const getSignatureListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_SIGNATURE_LIST);
export const saveSignatureAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_SIGNATURE);
export const updateSignatureAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_SIGNATURE);
export const deleteSignatureAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_SIGNATURE);

// IGSE Settings
//Term Name 
export const getIgseTermNameListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_IGSE_TERM_NAME_LIST);
export const getCopyIgseTermNameListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_COPY_IGSE_TERM_NAME_LIST);
export const saveIgseTermNameAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_IGSE_TERM_NAME);
export const getIgseTermNameByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_IGSE_TERM_NAME_BY_ID);
export const updateIgseTermNameAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_IGSE_TERM_NAME);
export const deleteIgseTermNameAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_IGSE_TERM_NAME);

//Term Details
export const getIgseTermDetailsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_IGSE_TERM_DETAILS_LIST);
export const getIgseTermDetailsByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_IGSE_TERM_DETAILS_BY_ID);
export const updateIgseTermDetailsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_IGSE_TERM_DETAILS);
export const saveIgseTermDetailsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_IGSE_TERM_DETAILS);
export const deleteIgseTermDetailsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_IGSE_TERM_DETAILS);

//Internal Subjects Grades
export const getCbseInternalSubjectsGradesListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_INTERNAL_SUBJECTS_GRADES_LIST);
export const saveCbseInternalSubjectsGradesAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_CBSE_INTERNAL_SUBJECTS_GRADES);
export const editCbseInternalSubjectsGradesAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.EDIT_CBSE_INTERNAL_SUBJECTS_GRADES);
export const deleteCbseInternalSubjectsGradesAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_CBSE_INTERNAL_SUBJECTS_GRADES);
export const getCbseInternalSubjectsGradesByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_INTERNAL_SUBJECTS_GRADES_BY_ID);
export const copyCbseInternalSubjectsGradesAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.COPY_CBSE_INTERNAL_SUBJECTS_GRADES);
export const getCbseExaminationSubjectOrderAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_SUBJECTS_ORDER);
export const getCBSEAllSubjectsOrderAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CBSE_ALL_SUBJECTS_ORDER);
export const saveCbseExaminationSubjectOrderAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_SUBJECT_ORDER);
export const updateCbseExaminationSubjectOrderAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_CBSE_EXAMINATION_SUBJECT_ORDER);

export const getExaminationListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_EXAMINATION_LIST);
export const getPercentageSlabsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_PERCENTAGE_SLAB);
export const savePercentageSlabsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_PERCENTAGE_SLAB);
export const editPercentageSlabsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.EDIT_PERCENTAGE_SLAB);
export const deletePercentageSlabsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_PERCENTAGE_SLAB);

//Area Strength Focus
export const getAreaofStrengthFocusListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_AREA_OF_STRENGTH_FOCUS_LIST);
export const saveAreaofStrengthFocusAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_AREA_OF_STRENGTH_FOCUS);
export const getAreaofStrengthFocusByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_AREA_OF_STRENGTH_FOCUS_BY_ID);
export const updateAreaofStrengthFocusAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_AREA_OF_STRENGTH_FOCUS);

//Holistic Domain
export const getHolisticDomainAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_HOLISTIC_DOMAIN_LIST);
export const getHolisticDomainModelAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_HOLISTIC_DOMAIN_MODEL_LIST);
export const saveHolisticDomainAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_HOLISTIC_DOMAIN);
export const updateHolisticDomainAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_HOLISTIC_DOMAIN);
export const saveDomainOrderAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_DOMAIN_ORDER);
export const deleteHolisticDomainAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_DOMAIN_ORDER);

//Holistic Activity
export const getHolisticActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_HOLISTIC_ACTIVITY_LIST);
export const saveHolisticActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_HOLISTIC_ACTIVITY);
export const updateHolisticActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_HOLISTIC_ACTIVITY);
export const deleteHolisticActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_HOLISTIC_ACTIVITY);
export const getClassInstituteIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CLASS_INSTITUTE_ID);
export const getActivityBranchAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_ACTIVITY_BRANCH);
export const getActivityClassAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_ACTIVITY_CLASS);
export const getActivityByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_ACTIVITY_BY_ID);
export const getInstituteClassAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_INSTITUTE_CLASS);
export const getClassesByStageAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_CLASSES_BY_STAGE);
export const getCopyClassesByStageAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_COPY_CLASSES_BY_STAGE);
export const copyHolisticActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.COPY_HOLISTIC_ACTIVITY);

//Holistic Domain Activity
export const getHolisticDomainActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_HOLISTIC_DOMAIN_ACTIVITY_LIST);
export const saveDomainActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_HOLISTIC_DOMAIN_ACTIVITY);
export const deleteHolisticDomainActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_HOLISTIC_DOMAIN_ACTIVITY);

//holistic Curriculum Goals
export const getHolisticCurriculumGoalsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_HOLISTIC_CURRICULUM_GOALS_LIST);
export const saveHolisticCurriculumGoalsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_HOLISTIC_CURRICULUM_GOALS);
export const updateHolisticCurriculumGoalsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_HOLISTIC_CURRICULUM_GOALS);


//Report Card Settings
export const getReportCardSettingsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_REPORT_CARD_SETTINGS);
export const getReportCardConfigAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_REPORT_CARD_CONFIG);
export const saveReportCardSettingsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_REPORT_CARD_SETTINGS);
export const deleteReportCardSettingsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_REPORT_CARD_SETTINGS);

// -----Preparatory-----

//Preparatory domain
export const getPreparatoryDomainAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_PREPARATORY_DOMAIN_LIST)
export const getPreparatoryDomainModelAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_PREPARATORY_DOMAIN_MODAL)
export const savePreparatoryDomainAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_PREPARATORY_DOMAIN)
export const updatePreparatoryDomainAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_PREPARATORY_DOMAIN)
export const savePreparatoryDomainOrderAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_PREPARATORY_ORDER)
export const deletePreparatoryDomainAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_PREPARATORY_ORDER)

//preparatory Curriculum Goals
export const getPreparatoryCurriculumGoalsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_PREPARATORY_CURRICULUM_GOAL)
export const savePreparatoryCurriculumGoalsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_PREPARATORY_CURRICULUM_GOAL)
export const updatePreparatoryCurriculumGoalsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_PREPARATORY_CURRICULUM_GOAL)

//preparatory garde entry
export const getPreparatoryGradeEntryListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_PREPARATORY_GRADE_ENTRY_LIST)
export const savePreparatoryGradeEntryListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_PREPARATORY_GRADE_ENTRY_LIST)
export const getPreparatoryGradeEntryListByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_PREPARATORY_GRADE_ENTRY_LIST_BY_ID)
export const updatePreparatoryGradeEntryListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_PREPARATORY_GRADE_ENTRY_LIST)
export const copyPreparatoryGradeEntryStudentDetailsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.COPY_PREPARATORY_GRADE_ENTRY_STUDENT_DETAILS);

//preparatory grade entry
export const savePreparatoryStudentSurroundingAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_PREPARATORY_STUDENT_SURROUNDING)
export const savePreparatoryStudentFeedbackAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_PREPARATORY_STUDENT_FEEDBACK)
export const savePreparatoryParentFeedbackAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_PREPARATORY_PARENT_FEEDBACK)

//preparatory activity
export const getPreparatoryActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_PREPARATORY_ACTIVITY)
export const savePreparatoryActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_PREPARATORY_ACTIVITY)
export const updatePreparatoryActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_PREPARATORY_ACTIVITY)
export const deletePreparatoryActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_PREPARATORY_ACTIVITY)
export const getPreparatoryActivityByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_PREPARATORY_ACTIVITY_BY_ID)
export const copyPreparatoryActivityAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.COPY_PREPARATORY_ACTIVITY)

//preparatory domain assessment
export const getPreparatoryDomainStudentsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_PREPARATORY_DOMAIN_STUDENTS)
export const savePreparatoryDomainStudentsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_PREPARATORY_DOMAIN_STUDENTS)
export const updatePreparatoryDomainStudentsAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_PREPARATORY_DOMAIN_STUDENTS)
export const getPreparatorySummaryByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_PREPARATORY_SUMMARY_BY_ID)
export const savePreparatorySummaryAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_PREPARATORY_SUMMARY)

export const getPreparatoryStatusAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_PREPARATORY_STATUS)
export const savePrepartoryParentCollectionAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_PREPARATORY_PARENT_COLLECTED_STATUS)
export const exportPreparatoryGradeEntryListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.EXPORT_PREPARATORY_GRADE_ENTRY_LIST)

// IGSE Skill Attribute Settings
export const getSkillAttributeSettingsListAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_SKILL_ATTRIBUTE_SETTINGS_LIST);
export const getSkillAttributeSettingsItemByIdAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.GET_SKILL_ATTRIBUTE_SETTINGS_ITEM_BY_ID);
export const saveSkillAttributeSettingsItemAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_SKILL_ATTRIBUTE_SETTINGS_ITEM);
export const updateSkillAttributeSettingsItemAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.UPDATE_SKILL_ATTRIBUTE_SETTINGS_ITEM);
export const deleteSkillAttributeSettingsItemAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.DELETE_SKILL_ATTRIBUTE_SETTINGS_ITEM);
export const saveSetSkillOrderAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_SET_SKILL_ORDER);
export const saveSetSkillAttributeOrderAct = createAction<INewActionType | undefined>(ExaminationSettingsConstants.SAVE_SET_SKILL_ATTRIBUTE_ORDER);

