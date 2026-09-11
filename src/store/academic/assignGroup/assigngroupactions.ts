import { createAction } from "@reduxjs/toolkit";
import { AssignGroupConstants } from "./assigngroupconstants";
import { INewActionType } from "../../types";

export {resetAssigroupAct,clearStudentList,resetStreamList} from './assigngroupslice'
export const getGroupStudentsList = createAction<INewActionType | undefined>(
  AssignGroupConstants.GET_GROUP_STUDENTS_LIST
);
export const getAcademicSubjectsList = createAction<INewActionType | undefined>(
  AssignGroupConstants.GET_ACADEMIC_SUBJECTS_LIST
);
export const getStreamList = createAction<INewActionType | undefined>(
  AssignGroupConstants.GET_STREAM_LIST
);
export const getStreamById = createAction<INewActionType | undefined>(
  AssignGroupConstants.GET_STREAM_BY_ID
);
export const getUnassignedGroupStudentsList = createAction<
  INewActionType | undefined
>(AssignGroupConstants.GET_UNASSIGNED_GROUP_STUDENTS_LIST);
export const setAssignStudentToGroup = createAction<INewActionType | undefined>(
  AssignGroupConstants.ASSIGN_STUDENT_TO_GROUP
);
export const removeStudentToGroup = createAction<INewActionType | undefined>(
  AssignGroupConstants.REMOVE_STUDENT_TO_GROUP
);
export const getAcademicDetails = createAction<INewActionType | undefined>(
  AssignGroupConstants.GET_ACADEMIC_DETAILS
);
export const getClassDetails = createAction<INewActionType | undefined>(
  AssignGroupConstants.GET_CLASS_DETAILS
);
