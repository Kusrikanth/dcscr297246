import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { lmsSettingsConstants } from "./lmssettingsconstants";


//Lms Settings

export const getQuestionNoFormatAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_QUESTION_NO_FORMAT);
export const saveQuestionNoFormatAct = createAction<INewActionType | undefined>(lmsSettingsConstants.SAVE_QUESTION_NO_FORMAT);
export const updateQuestionNoFormatAct = createAction<INewActionType | undefined>(lmsSettingsConstants.UPDATE_QUESTION_NO_FORMAT);
export const deleteQuestionNoFormatAct = createAction<INewActionType | undefined>(lmsSettingsConstants.DELETE_QUESTION_NO_FORMAT);

//Question-Types
export const getQuestionTypesAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_QUESTION_TYPES);
export const saveQuestionTypesAct = createAction<INewActionType | undefined>(lmsSettingsConstants.SAVE_QUESTION_TYPES);
export const updateQuestionTypesAct = createAction<INewActionType | undefined>(lmsSettingsConstants.UPDATE_QUESTION_TYPES);
export const deleteQuestionTypesAct = createAction<INewActionType | undefined>(lmsSettingsConstants.DELETE_QUESTION_TYPES);
export const getQuestionTypesByIdAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_QUESTION_TYPES_BY_ID);

//Difficulty-Level
export const getDifficultyLevelsAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_DIFFICULTY_LEVELS);
export const saveDifficultyLevelsAct = createAction<INewActionType | undefined>(lmsSettingsConstants.SAVE_DIFFICULTY_LEVELS);
export const updateDifficultyLevelsAct = createAction<INewActionType | undefined>(lmsSettingsConstants.UPDATE_DIFFICULTY_LEVELS);
export const deleteDifficultyLevelsAct = createAction<INewActionType | undefined>(lmsSettingsConstants.DELETE_DIFFICULTY_LEVELS);
export const getDifficultyLevelsByIdAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_DIFFICULTY_LEVELS_BY_ID);

//Bloom Taxonomy
export const getBloomTaxonomyAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_BLOOM_TAXONOMY);
export const saveBloomTaxonomyAct = createAction<INewActionType | undefined>(lmsSettingsConstants.SAVE_BLOOM_TAXONOMY);
export const updateBloomTaxonomyAct = createAction<INewActionType | undefined>(lmsSettingsConstants.UPDATE_BLOOM_TAXONOMY);
export const deleteBloomTaxonomyAct = createAction<INewActionType | undefined>(lmsSettingsConstants.DELETE_BLOOM_TAXONOMY);

//Digital CUrriculum Settings
// Academic Details
export const getAcademicDetailsListAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_ACADEMIC_DETAILS_LIST);
export const saveAcademicDetailsAct = createAction<INewActionType | undefined>(lmsSettingsConstants.SAVE_ACADEMIC_DETAILS);
export const getAcademicDetailsByIdAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_ACADEMIC_DETAILS_BY_ID);
export const deleteAcademicDetailsAct = createAction<INewActionType | undefined>(lmsSettingsConstants.DELETE_ACADEMIC_DETAILS);

//AcademicTerm Details
export const getAcademicTermDetailsListAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_ACADEMIC_TERM_DETAILS_LIST);
export const saveAcademicTermDetailsAct = createAction<INewActionType | undefined>(lmsSettingsConstants.SAVE_ACADEMIC_TERM_DETAILS);
export const getAcademicTermDetailsByIdAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_ACADEMIC_TERM_DETAILS_BY_ID);
export const deleteAcademicTermDetailsAct = createAction<INewActionType | undefined>(lmsSettingsConstants.DELETE_ACADEMIC_TERM_DETAILS);

//School Period Details
export const getSchoolPeriodDetailsListAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_SCHOOL_PERIOD_DETAILS_LIST);
export const saveSchoolPeriodDetailsAct = createAction<INewActionType | undefined>(lmsSettingsConstants.SAVE_SCHOOL_PERIOD_DETAILS);
export const getSchoolPeriodDetailsByIdAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_SCHOOL_PERIOD_DETAILS_BY_ID);
export const deleteSchoolPeriodDetailsAct = createAction<INewActionType | undefined>(lmsSettingsConstants.DELETE_SCHOOL_PERIOD_DETAILS);

//School Holidays
export const getSchoolHolidaysListAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_SCHOOL_HOLIDAYS_LIST);
export const saveSchoolHolidaysAct = createAction<INewActionType | undefined>(lmsSettingsConstants.SAVE_SCHOOL_HOLIDAYS);
export const getSchoolHolidaysByIdAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_SCHOOL_HOLIDAYS_BY_ID);
export const deleteSchoolHolidaysAct = createAction<INewActionType | undefined>(lmsSettingsConstants.DELETE_SCHOOL_HOLIDAYS);

//Digital Curriculum Validation's
export const getDigitalCurriculumValidationListAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_DIGITAL_CURRICULUM_VALIDATION_LIST);
export const saveDigitalCurriculumValidationAct = createAction<INewActionType | undefined>(lmsSettingsConstants.SAVE_DIGITAL_CURRICULUM_VALIDATION);

//Digital Curriculum Rules's
export const getDigitalCurriculumRulesListAct = createAction<INewActionType | undefined>(lmsSettingsConstants.GET_DIGITAL_CURRICULUM_RULES_LIST);
export const saveDigitalCurriculumRulesAct = createAction<INewActionType | undefined>(lmsSettingsConstants.SAVE_DIGITAL_CURRICULUM_RULES);