import { createAction } from "@reduxjs/toolkit";
import { examinationSportsConstants } from "./examinationSportsConstants";
import { INewActionType } from "../../types";

export const getSportsNamesAct = createAction<INewActionType | undefined>(
  examinationSportsConstants.GET_SPORTS_NAMES
);
export const getSportsNameItemByIdAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_NAME_BY_ID);
export const saveSportsNameItemAct = createAction<INewActionType | undefined>(
  examinationSportsConstants.SAVE_SPORTS_NAME_ITEM
);
export const editSportsNameItemAct = createAction<INewActionType | undefined>(
  examinationSportsConstants.EDIT_SPORTS_NAME_ITEM
);
export const delSportsNameItemAct = createAction<INewActionType | undefined>(
  examinationSportsConstants.DEL_SPORTS_NAME_ITEM
);

export const getSportsAttributeListAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_ATTRIBUTE_LIST);
export const getSportsAttributeItemByIdAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_ATTRIBUTE_BY_ID);
export const saveSportsAttributeItemAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.SAVE_SPORTS_ATTRIBUTE_ITEM);
export const editSportsAttributeItemAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.EDIT_SPORTS_ATTRIBUTE_ITEM);
export const delSportsAttributeItemAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.DEL_SPORTS_ATTRIBUTE_ITEM);

export const getSportsGradeListAct = createAction<INewActionType | undefined>(
  examinationSportsConstants.GET_SPORTS_GRADE_LIST
);
export const getSportsGradeItemByIdAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_GRADE_BY_ID);
export const saveSportsGradeItemAct = createAction<INewActionType | undefined>(
  examinationSportsConstants.SAVE_SPORTS_GRADE_ITEM
);
export const editSportsGradeItemAct = createAction<INewActionType | undefined>(
  examinationSportsConstants.EDIT_SPORTS_GRADE_ITEM
);
export const delSportsGradeItemAct = createAction<INewActionType | undefined>(
  examinationSportsConstants.DEL_SPORTS_GRADE_ITEM
);

// management
export const getSportsClassMappingListAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_CLASS_MAPPING_LIST);
export const getSportsClassMappingByIdAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_CLASS_MAPPING_BY_ID);
export const saveSportsClassMappingItemAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.SAVE_SPORTS_CLASS_MAPPING_ITEM);
export const editSportsClassMappingItemAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.EDIT_SPORTS_CLASS_MAPPING_ITEM);
export const delSportsClassMappingAct = createAction<INewActionType | undefined>(examinationSportsConstants.DELETE_SPORTS_CLASS_MAPPING);

export const getSportsSubAttributeListAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_SUBATTRIBUTE_LIST);
export const getSportsSubAttributeByIdAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_SUBATTRIBUTE_ITEM_BY_ID);
export const saveSportsSubAttributeItemAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.SAVE_SPORTS_SUBATTRIBUTE_ITEM);
export const editSportsSubAttributeItemAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.EDIT_SPORTS_SUBATTRIBUTE_ITEM);
export const delSportsSubAttributeItemAct = createAction<INewActionType | undefined>(examinationSportsConstants.DEL_SPORTS_SUBATTRIBUTE_ITEM);

export const getSportsByClassesListAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_CLASSES_LIST);
export const getSportsClassesListByIdAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_CLASSES_LIST_BY_ID);

// Grade Entry
export const getStudentSportsGradeEntryAct = createAction<INewActionType | undefined>(examinationSportsConstants.GET_STUDENT_SPORTS_GRADE_ENTRY);
export const getStudentSportsGradeEntryByIdAct = createAction<INewActionType | undefined>(examinationSportsConstants.GET_STUDENT_SPORTS_GRADE_ENTRY_BY_ID);
export const editStudentSportsGradeEntryAct = createAction<INewActionType | undefined>(examinationSportsConstants.EDIT_STUDENT_SPORTS_GRADE_ENTRY);
export const saveStudentSportsGradeEntryAct = createAction<INewActionType | undefined>(examinationSportsConstants.SAVE_STUDENT_SPORTS_GRADE_ENTRY);
export const getSportsMainAttributesWithSubAttributesAct = createAction<INewActionType | undefined>(examinationSportsConstants.GET_SPORTS_MAIN_ATTRIBUTES_WITH_SUB_ATTRIBUTES);
export const getSubAttributeItemsListAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SUB_ATTRIBUTE_ITEMS_LIST);
export const getSubAttributesCommonListAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SUB_ATTRIBUTES_COMMON_LIST);

// BMI Details
export const saveStudentBmiDetailsAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.SAVE_STUDENT_BMI_DETAILS);

export const getSportsDiscriptionsListAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_DISCRIPTIONS_LIST);
export const setSaveSportsDiscriptionsItemsAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.SAVE_SPORTS_DISCRIPTION_ITEMS);
export const delSportsDiscriptionsItemsAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.DEL_SPORTS_DISCRIPTIONS_ITEM);

// assign sports to students

export const getAssignSportsToStudentsListAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_ASSIGN_SPORTS_TO_STUDENTS_LIST);
export const getAssignSportsToStudentItemByIdAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_ASSIGN_SPORTS_TO_STUDENT_ITEM_BY_ID);
export const saveAssignSportsToStudentsAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.SAVE_ASSIGN_SPORTS_TO_STUDENT_ITEMS);
export const editAssignSportsToStudentsAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.EDIT_ASSIGN_SPORTS_TO_STUDENT_ITEMS);

export const getSportsNotAssignedStudentsListAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_NOT_ASSIGNED_STUDENTS_LIST);

// Sports Teacher
export const getSportsTeacherListAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_TEACHER_LIST);
export const getSportsTeacherByIdAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.GET_SPORTS_TEACHER_BY_ID);
export const saveSportsTeacherAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.SAVE_SPORTS_TEACHER);
export const editSportsTeacherAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.EDIT_SPORTS_TEACHER);
export const unassignSportsTeacherAct = createAction<
  INewActionType | undefined
>(examinationSportsConstants.UNASSIGN_SPORTS_TEACHER);

// Sports Progress Card
export const getSportsProgressCardListAct = createAction<INewActionType | undefined>(examinationSportsConstants.GET_SPORTS_PROGRESS_CARD_LIST);
export const downloadSportsProgressCardAct = createAction<INewActionType | undefined>(examinationSportsConstants.DOWNLOAD_SPORTS_PROGRESS_CARD);

export const getSportsunAssignedClassesAct = createAction<INewActionType | undefined>(examinationSportsConstants.GET_SPORTS_UNASSIGNED_CLASSES_LIST)
export const getOtherProgressCardAccessAct = createAction<INewActionType | undefined>(examinationSportsConstants.GET_OTHER_PROGRESS_CARD_ACCESS)