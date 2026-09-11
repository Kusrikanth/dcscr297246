import { createAction } from "@reduxjs/toolkit";
import { BranchAcademicsConstants } from "./branchacademicsconstants";
import { INewActionType } from "../../types";


export {
    setBranchClassScopeAct, setBrchCurriculumScopeAct,
    resetBrchCurriculumAct, resetBrchClassAct, setBrchClassAct, setBrchSectionByClassAct, setBrchCurriculumAct,
    setBrchSectionsAct, resetBrchSectionsAct, setBrchStreamGroupsAct, resetBrchSectionByClassAct
} from "./branchacademicsslice";

export const getBranchAcademicYearAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_BRANCH_ACADEMIC_YEAR_REQUEST);
export const getAcademicLanguagesAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_ACADEMIC_LANGUAGES_REQUEST);

export const addBranchAcademicYearAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.ADD_BRANCH_ACADEMIC_YEAR_REQUEST);

export const updateBranchAcademicYearAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.UPDATE_BRANCH_ACADEMIC_YEAR_REQUEST);

export const deleteBranchAcademicYearAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.DELETE_BRANCH_ACADEMIC_YEAR_REQUEST);


export const getBranchAcademicTermAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_BRANCH_ACADEMIC_TERMS_REQUEST);

export const addBranchAcademicTermAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.ADD_BRANCH_ACADEMIC_TERMS_REQUEST);

export const updateBranchAcademicTermAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.UPDATE_BRANCH_ACADEMIC_TERMS_REQUEST);

export const deleteBranchAcademicTermAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.DELETE_BRANCH_ACADEMIC_TERMS_REQUEST);


export const getBranchCurriculumAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_BRANCH_CURRICULUM_REQUEST);
export const addBranchCurriculumAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.ADD_BRANCH_CURRICULUM_REQUEST);
export const updateBranchCurriculumAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.UPDATE_BRANCH_CURRICULUM_REQUEST);
export const deleteBranchCurriculumAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.DELETE_BRANCH_CURRICULUM_REQUEST);


export const getBranchClassAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_BRANCH_CLASS_REQUEST);
export const getCurriculumWIseClassAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_CURRICULUM_WISE_CLASS_REQUEST);
export const addBranchClassAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.ADD_BRANCH_CLASS_REQUEST);
export const updateBranchClassAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.UPDATE_BRANCH_CLASS_REQUEST);
export const deleteBranchClassAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.DELETE_BRANCH_CLASS_REQUEST);


export const getBrchCurriculumClassAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_BRANCH_CURRICULUM_CLASS_REQUEST);
export const addBrchCurriculumClassAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.ADD_BRANCH_CURRICULUM_CLASS_REQUEST);
export const updateCurriculumClassAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.UPDATE_BRANCH_CURRICULUM_CLASS_REQUEST);
export const deleteCurriculumClassAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.DELETE_BRANCH_CURRICULUM_CLASS_REQUEST);

export const getBrchSectionsAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_BRANCH_SECTIONS_REQUEST);
export const addBrchSectionAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.ADD_BRANCH_SECTION_REQUEST);
export const updateBrchSectionAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.UPDATE_BRANCH_SECTION_REQUEST);
export const deleteBrchSectionAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.DELETE_BRANCH_SECTION_REQUEST);
export const getBrchSectionByClassAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_BRANCH_SECTION_BYCLASS_REQUEST);

export const getBrchSubjectsAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_BRANCH_SUBJECTS_REQUEST);
export const getInstSubjectNameAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_INST_SUBJECT_NAME);
export const addBrchSubjectAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.ADD_BRANCH_SUBJECT_REQUEST);
export const updateBrchSubjectAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.UPDATE_BRANCH_SUBJECT_REQUEST);
export const deleteBrchSubjectAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.DELETE_BRANCH_SUBJECT_REQUEST);

export const getBrchStreamGroupsAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_BRANCH_STREAM_GROUPS_REQUEST);
export const addBrchStreamGroupAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.ADD_BRANCH_STREAM_GROUP_REQUEST);
export const updateBrchStreamGroupAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.UPDATE_BRANCH_STREAM_GROUP_REQUEST);
export const deleteBrchStreamGroupAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.DELETE_BRANCH_STREAM_GROUP_REQUEST);


export const getBrchAcademicClassAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_BRANCH_ACADEMIC_CLASSES_REQUEST);


export const getClassWiseTermDateAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_CLASS_WISE_TERMS_DATE_REQUEST);
export const delClassWiseTermDateAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.DELETE_CLASS_WISE_TERMS_DATE_REQUEST);
export const addClassWiseTermDateAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.ADD_CLASS_WISE_TERMS_DATE_REQUEST);
export const updateClassWiseTermDateAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.UPDATE_CLASS_WISE_TERMS_DATE_REQUEST);

export const getBranchClassWiseTermIdAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.GET_BRANCH_CLASS_WISE_TERMS_ID_REQUEST);
export const addAcademicDatesAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.ADD_ACADEMIC_DATE);
export const updateAcademicDatesAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.UPDATE_ACADEMIC_DATE);
export const deleteAcademicDatesAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.DELETE_ACADEMIC_DATE);
export const getMastersCurriculumAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.MASTER_CURRICULUM_REQUEST);
export const getMasterCurriculumClassAct = createAction<INewActionType | undefined>(BranchAcademicsConstants.MASTER_CURRICULUM_CLASS_REQUEST);
