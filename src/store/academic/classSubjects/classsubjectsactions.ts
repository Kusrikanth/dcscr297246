import { createAction } from "@reduxjs/toolkit";
import { ClassSubjectsConstants } from "./classsubjectsconstants";
import { INewActionType } from "../../types";

export { setCopyToCurrentClassAct, setCopyToCurrentSectionAct, setAssignedClassSubjectsListAct, resetAssignedClassSubjectsListAct } from './classsubjectsslice'
export const getClassSubjectsList = createAction<INewActionType | undefined>(
  ClassSubjectsConstants.GET_CLASS_SUBJECTS_LIST
);
export const getAssignedClassSubjectsList = createAction<INewActionType | undefined>(
  ClassSubjectsConstants.GET_ASSIGNED_CLASS_SUBJECTS_LIST
);
export const updateClassSubjectsList = createAction<INewActionType | undefined>(
  ClassSubjectsConstants.UPDATE_CLASS_SUBJECTS_LIST
);
export const delteClassSubjectsList = createAction<INewActionType | undefined>(
  ClassSubjectsConstants.DELETE_CLASS_SUBJECTS_LIST
);


export const getStudentAllocatedSubjectsAct = createAction<INewActionType | undefined>(ClassSubjectsConstants.GET_STUDENT_ALLOCATEDSUBJECTS_REQUEST);
export const assignSubjectToStudentAct = createAction<INewActionType | undefined>(ClassSubjectsConstants.ASSIGN_SUBJECT_TOSTUDENT_REQUEST);
export const copyPreviousSubjectAllocationAct = createAction<INewActionType | undefined>(ClassSubjectsConstants.COPY_PREVIOUS_SUBJECT_ALLOCATION_REQUEST);
export const copyToCurrentClassAct = createAction<INewActionType | undefined>(ClassSubjectsConstants.GET_COPYTO_CURRENT_CLASS_REQUEST);
export const copyToCurrentSectionAct = createAction<INewActionType | undefined>(ClassSubjectsConstants.GET_COPYTO_CURRENT_SECTION_REQUEST);
export const deleteStudentSubjectAllocationAct = createAction<INewActionType | undefined>(ClassSubjectsConstants.DELETE_STUDENT_SUBJECTALLOCATION_REQUEST);

export const getAssignTeacherListAct = createAction<INewActionType | undefined>(ClassSubjectsConstants.GET_SUBJECT_TEACHER_LIST);
export const saveSubjectTeacherAct = createAction<INewActionType | undefined>(ClassSubjectsConstants.SAVE_SUBJECT_TEACHER);

export const saveBranchClassLanguagesAct = createAction<INewActionType | undefined>(ClassSubjectsConstants.SAVE_BRANCH_CLASS_LANGUAGES);
export const deleteBranchClassLanguagesAct = createAction<INewActionType | undefined>(ClassSubjectsConstants.DELETE_BRANCH_CLASS_LANGUAGES);
