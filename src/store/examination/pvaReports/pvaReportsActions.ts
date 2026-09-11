import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { pvaReportsConstants } from "./pvaReportsConstants";
export { resetPvaSubjectAct, resetPvaSkillAreaAct, resetPvaSubjecttoClassMappingAct, resetPvaStudentGradeEntryListAct, } from "./pvaReportsSlice"

//Settings
export const getPvaSubjectsAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_PVA_SUBJECTS);
export const savePvaSubjectsAct = createAction<INewActionType | undefined>(pvaReportsConstants.SAVE_PVA_SUBJECTS);
export const updatePvaSubjectsAct = createAction<INewActionType | undefined>(pvaReportsConstants.UPDATE_PVA_SUBJECTS);
export const getPvaSubjectsByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_PVA_SUBJECTS_BY_ID);
export const deletePvaSubjectsAct = createAction<INewActionType | undefined>(pvaReportsConstants.DELETE_PVA_SUBJECTS);
export const getPvaGradeEntrySubjectAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_PVA_GRADE_ENTRY_SUBJECTS);

//PVA Skill Area
export const getPvaSkillAreaAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_PVA_SKILL_AREA);
export const savePvaSkillAreaAct = createAction<INewActionType | undefined>(pvaReportsConstants.SAVE_PVA_SKILL_AREA);
export const getPvaSkillAreaByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_PVA_SKILL_AREA_BY_ID);
export const deletePvaSkillAreaAct = createAction<INewActionType | undefined>(pvaReportsConstants.DELETE_PVA_SKILL_AREA);

//PVA Grades
export const getPvaGradesAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_PVA_GRADES);
export const savePvaGradesAct = createAction<INewActionType | undefined>(pvaReportsConstants.SAVE_PVA_GRADES);
export const updatePvaGradesAct = createAction<INewActionType | undefined>(pvaReportsConstants.UPDATE_PVA_GRADES);
export const getPvaGradesByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_PVA_GRADES_BY_ID);
export const deletePvaGradesAct = createAction<INewActionType | undefined>(pvaReportsConstants.DELETE_PVA_GRADES);

//PVA Subject to Class Mapping
export const getPvaSubjectsClassesMappingAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_PVA_SUBJECTS_CLASSES_MAPPING);
export const savePvaSubjectsClassesMappingAct = createAction<INewActionType | undefined>(pvaReportsConstants.SAVE_PVA_SUBJECTS_CLASSES_MAPPING);
export const updatePvaSubjectsClassesMappingAct = createAction<INewActionType | undefined>(pvaReportsConstants.UPDATE_PVA_SUBJECTS_CLASSES_MAPPING);
export const getPvaSubjectsClassesMappingByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_PVA_SUBJECTS_CLASSES_MAPPING_BY_ID);
export const deletePvaSubjectsClassesMappingAct = createAction<INewActionType | undefined>(pvaReportsConstants.DELETE_PVA_SUBJECTS_CLASSES_MAPPING);

//Management

//Grade Entry
export const getPvaStudentGradeEntryListAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_PVA_STUDENT_GRADE_ENTRY_LIST);
export const savePvaGradeEntryListAct = createAction<INewActionType | undefined>(pvaReportsConstants.SAVE_PVA_GRADE_ENTRY_LIST);

// Green Report Card grade config
export const getGreenReportCardGradeConfigAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_GREEN_REPORT_CARD_GRADE_CONFIG);
export const getGreenReportCardGradeConfigByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_GREEN_REPORT_CARD_GRADE_CONFIG_BY_ID);
export const saveGreenReportCardGradeConfigAct = createAction<INewActionType | undefined>(pvaReportsConstants.SAVE_GREEN_REPORT_CARD_GRADE_CONFIG);
export const deleteGreenReportCardGradeConfigAct = createAction<INewActionType | undefined>(pvaReportsConstants.DELETE_GREEN_REPORT_CARD_GRADE_CONFIG);

// Green Report Card Category
export const getGreenReportCardCategoryListAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_GREEN_REPORT_CARD_CATEGORY_LIST);
export const getGreenReportCardCategoryByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_GREEN_REPORT_CARD_CATEGORY_BY_ID);
export const saveGreenReportCardCategoryItemAct = createAction<INewActionType | undefined>(pvaReportsConstants.SAVE_GREEN_REPORT_CARD_CATEGORY_ITEM);
export const updateGreenReportCardCategoryItemAct = createAction<INewActionType | undefined>(pvaReportsConstants.UPDATE_GREEN_REPORT_CARD_CATEGORY_ITEM);
export const deleteGreenReportCardCategoryItemAct = createAction<INewActionType | undefined>(pvaReportsConstants.DELETE_GREEN_REPORT_CARD_CATEGORY_ITEM);

// Green Report Card Management
export const getCategorySelectionListAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_CATEGORY_SELECTION_LIST);
export const saveCategorySelectionAct = createAction<INewActionType | undefined>(pvaReportsConstants.SAVE_CATEGORY_SELECTION);
export const getCategorySelectionByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_CATEGORY_SELECTION_BY_ID);
export const updateCategorySelectionAct = createAction<INewActionType | undefined>(pvaReportsConstants.UPDATE_CATEGORY_SELECTION);
export const deleteCategorySelectionAct = createAction<INewActionType | undefined>(pvaReportsConstants.DELETE_CATEGORY_SELECTION);

// Green Grade Entry

export const getAllGreenReportGradeEntryStntsListAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_ALL_GREEN_REPORT_GRADE_ENRTY_STNT_LIST);
export const getGreenReportGradeEntryStntByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_GREEN_REPORT_GRADE_ENTRY_STNT_BY_ID);
export const saveGreenReportGradeAct = createAction<INewActionType | undefined>(pvaReportsConstants.SAVE_GREEN_REPORT_GRADE_ENTRY);

// --->>> DISCIPLE <<<---

// Domains
export const getDisciplineSettingsDomainsAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_DISCIPLINE_SETTINGS_DOMAINS_RESP)
export const getDisciplineSettingsDomainItemByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_DISCIPLINE_SETTINGS_DOMAINS_ITEM_BY_ID_RESP)
export const saveDisciplineSettingsDomainItemByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.SAVE_DISCIPLINE_SETTINGS_DOMAINS_ITEM_BY_ID_RESP)
export const updateDisciplineSettingsDomainItemByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.UPDATE_DISCIPLINE_SETTINGS_DOMAINS_ITEM_BY_ID_RESP)
export const delDisciplineSettingsDomainItemByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.DEL_DISCIPLINE_SETTINGS_DOMAINS_ITEM_BY_ID_RESP)

// Sub Domains

export const getDisciplineSettingsSubDomainsAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_DISCIPLINE_SETTINGS_SUB_DOMAINS_RESP)
export const getDisciplineSettingsSubDomainItemByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_DISCIPLINE_SETTINGS_SUB_DOMAINS_ITEM_BY_ID_RESP)
export const saveDisciplineSettingsSubDomainItemByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.SAVE_DISCIPLINE_SETTINGS_SUB_DOMAINS_ITEM_BY_ID_RESP)
export const updateDisciplineSettingsSubDomainItemByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.UPDATE_DISCIPLINE_SETTINGS_SUB_DOMAINS_ITEM_BY_ID_RESP)
export const delDisciplineSettingsSybDomainItemByIdAct = createAction<INewActionType | undefined>(pvaReportsConstants.DEL_DISCIPLINE_SETTINGS_SUB_DOMAINS_ITEM_BY_ID_RESP)

// Grade Config
export const getDisciplineGradeConfigListAct = createAction<INewActionType | undefined>(pvaReportsConstants.GET_DISCIPLINE_GRADE_CONFIG_LIST)
export const saveDisciplineGradeConfigListAct = createAction<INewActionType | undefined>(pvaReportsConstants.SAVE_DISCIPLINE_GRADE_CONFIG_LIST)
export const delDisciplineGradeConfigListAct = createAction<INewActionType | undefined>(pvaReportsConstants.DEL_DISCIPLINE_GRADE_CONFIG_LIST)