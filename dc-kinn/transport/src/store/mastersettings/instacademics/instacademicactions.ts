import { createAction } from "@reduxjs/toolkit";
import { InstAcademicsConstants } from "./instacademicconstants";
import { INewActionType } from "../../types";

export { setModulesListAct } from "./instacademicslice";

export const getInstAcademicYearAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.GET_INST_ACADEMIC_YEAR_REQUEST
);
export const getInstAcademicYearsDateAct = createAction<
  INewActionType | undefined
>(InstAcademicsConstants.GET_INST_ACADEMIC_YEARS_DATE_REQUEST);

export const addInstAcademicYearAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.ADD_INST_ACADEMIC_YEAR_REQUEST
);

export const updateInstAcademicYearAct = createAction<
  INewActionType | undefined
>(InstAcademicsConstants.UPDATE_INST_ACADEMIC_YEAR_REQUEST);

export const deleteInstAcademicYearAct = createAction<
  INewActionType | undefined
>(InstAcademicsConstants.DELETE_INST_ACADEMIC_YEAR_REQUEST);

export const getInstAcademicTermAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.GET_INST_ACADEMIC_TERMS_REQUEST
);
export const getInstTermAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.GET_INST_TERMS_REQUEST
);

export const addInstAcademicTermAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.ADD_INST_ACADEMIC_TERMS_REQUEST
);
export const addInstTermAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.ADD_INST_TERMS_REQUEST
);

export const updateInstAcademicTermAct = createAction<
  INewActionType | undefined
>(InstAcademicsConstants.UPDATE_INST_ACADEMIC_TERMS_REQUEST);
export const updateInstTermAct = createAction<
  INewActionType | undefined
>(InstAcademicsConstants.UPDATE_INST_TERMS_REQUEST);

export const deleteInstTermAct = createAction<
  INewActionType | undefined
>(InstAcademicsConstants.DELETE_INST_TERMS_REQUEST);
export const deleteInstAcademicTermAct = createAction<
  INewActionType | undefined
>(InstAcademicsConstants.DELETE_INST_ACADEMIC_TERMS_REQUEST);

export const getInstCurriculumAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.GET_INST_CURRICULUM_REQUEST
);
export const addInstCurriculumAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.ADD_INST_CURRICULUM_REQUEST
);
export const updateInstCurriculumAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.UPDATE_INST_CURRICULUM_REQUEST
);
export const deleteInstCurriculumAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.DELETE_INST_CURRICULUM_REQUEST
);

export const getInstClassAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.GET_INST_CLASS_REQUEST
);
export const getInstClassForBranchAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.GET_INST_CLASS_FOR_BRANCH_REQUEST
);
export const getInstSecondClassAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.GET_INST_SECOND_CLASS_REQUEST
);
export const addInstClassAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.ADD_INST_CLASS_REQUEST
);
export const updateInstClassAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.UPDATE_INST_CLASS_REQUEST
);
export const deleteInstClassAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.DELETE_INST_CLASS_REQUEST
);

export const getCurriculumClassAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.GET_CURRICULUM_CLASS_REQUEST
);
export const addCurriculumClassAct = createAction<INewActionType | undefined>(
  InstAcademicsConstants.ADD_CURRICULUM_CLASS_REQUEST
);
export const updateCurriculumClassAct = createAction<
  INewActionType | undefined
>(InstAcademicsConstants.UPDATE_CURRICULUM_CLASS_REQUEST);
export const deleteCurriculumClassAct = createAction<
  INewActionType | undefined
>(InstAcademicsConstants.DELETE_CURRICULUM_CLASS_REQUEST);

export const getModulesList = createAction<INewActionType | undefined>(InstAcademicsConstants.GET_MODULES_LIST_REQUEST);
export const updateModule = createAction<INewActionType | undefined>(InstAcademicsConstants.UPDATE_MODULE_REQUEST);

export { resetCurriculumClassAct } from "./instacademicslice";