import { createAction } from "@reduxjs/toolkit";
import { LanguagesConstants } from "./languagesconstants";
import { INewActionType } from "../../types";

export const getLanguageList = createAction<INewActionType | undefined>(
  LanguagesConstants.GET_LANGUAGE_LIST
);
export const deleteLanguage = createAction<INewActionType | undefined>(
  LanguagesConstants.DELETE_LANGUAGE
);


export const studentsIdCardAct = createAction<INewActionType | undefined>(LanguagesConstants.GET_STUDENTS_IDCARD_REQUEST);
export const updateStudentIdCardAct =
  createAction<INewActionType | undefined>(LanguagesConstants.UPDATE_STUDENT_IDCARD_REQUEST);
export const previewStudentIdCardAct = createAction<INewActionType | undefined>(LanguagesConstants.PREVIEW_STUDENT_IDCARD_REQUEST);

