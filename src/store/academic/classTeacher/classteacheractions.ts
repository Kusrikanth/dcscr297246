import { createAction } from "@reduxjs/toolkit";
import { ClassTeacherConstants } from "./classteacherconstants";
import { INewActionType } from "../../types";

export {clearSubjectsOfTeacherTableData} from './classteacherslice'
export const deleteSubjectTeacher = createAction<INewActionType | undefined>(
  ClassTeacherConstants.DELETE_SUBJECT_OF_TEACHER
);
export const getSubjectTeacherTableData = createAction<
  INewActionType | undefined
>(ClassTeacherConstants.GET_SUBJECT_OF_TEACHER_TABLE_DATA);
export const assignSubjectToTeacher = createAction<INewActionType | undefined>(
  ClassTeacherConstants.ASSIGN_TEACHER_TO_SUBJECT
);
export const updateAssignedSubjectToTeacher = createAction<INewActionType | undefined>(
  ClassTeacherConstants.UPDATE_ASSIGNED_TEACHER_TO_SUBJECT
);
