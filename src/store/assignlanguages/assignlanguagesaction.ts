import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../types";
import { AssignLanguagesConstants } from "./assignlanguagesconstants";

import { resetAssignLanClassListAct,resetStuLanguagesListAct,resetAssignLanSectionListAct,resetAssignListCurriculumAct } from "./assignlanguagesslice";

export const getAssignLanguagesList = createAction<INewActionType | undefined>(AssignLanguagesConstants.GET_ASSIGN_LANGUAGES_LIST);
export const getStuLanguagesListAct = createAction<INewActionType | undefined>(AssignLanguagesConstants.GET_STU_LANGUAGES_LIST);
export const getAssignLanClassListAct = createAction<INewActionType | undefined>(AssignLanguagesConstants.ASSIGN_LAN_CLASS_LIST);
export const getAssignLanSectionListAct = createAction<INewActionType | undefined>(AssignLanguagesConstants.ASSIGN_LAN_SECTION_LIST);
export const updateAssignLanguagesAct = createAction<INewActionType | undefined>(AssignLanguagesConstants.UPDATE_ASSIGN_LANGUAGES);
export const copyAssignLanguagesAct = createAction<INewActionType | undefined>(AssignLanguagesConstants.COPY_ASSIGN_LANGUAGES);
export const getAssignCurriculumListAct = createAction<INewActionType | undefined>(AssignLanguagesConstants.ASSIGN_CURRICULUM_LIST);
export const advanceFilterCurriculumListAct = createAction<INewActionType | undefined>(AssignLanguagesConstants.ADVANCE_FILTER_CURRICULUM_LIST);
export const advanceFilterClassListAct = createAction<INewActionType | undefined>(AssignLanguagesConstants.ADVANCE_FILTER_CLASS_LIST);
export const exportAssignLanguagesAct = createAction<INewActionType | undefined>(AssignLanguagesConstants.EXPORT_ASSIGN_LANGUAGES);
export const getAssignLanBrchStreamGroupsAct = createAction<INewActionType | undefined>(AssignLanguagesConstants.ASSIGN_LAN_BRCH_STREAM_GROUPS);
export const getExaminationLanguagesListAct = createAction<INewActionType | undefined>(AssignLanguagesConstants.GET_EXAMINATION_LANGUAGES_LIST);
