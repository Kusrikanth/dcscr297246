import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { ConcernsFeedbackConstants } from "./concernsfeedbacklistconstants";

export { resetConcernsFeedbackListAct,setConcernsFeedbackListByIdAct} from "./concernsfeedbacklistslice"


export const getConcernsFeedbackListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_CONCERNS_FEEDBACK_LIST);
export const getConcernsFeedbackListByIdAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_CONCERNS_FEEDBACK_LIST_BY_ID);
export const getConcernsStatsAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_CONCERNS_STATS);
export const getCommentListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_COMMENT_LIST);
export const editCommentListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.EDIT_COMMENT_LIST);
export const deleteCommentListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.DELETE_COMMENT_LIST);
export const addCommentListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.ADD_COMMENT_LIST);
export const exportConcernsFeedbackListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.EXPORT_CONCERNS_FEEDBACK_LIST);

export const deleteConcernFileAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.DELETE_CONCERN_FILE_LIST);
export const addConcernFileAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.ADD_CONCERN_FILE_LIST);
export const editConcernsFeedbackListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.UPDATE_CONCERNS_FEEDBACK_LIST);
export const addConcernsFeedbackListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.ADD_CONCERNS_FEEDBACK_LIST);
export const getConcernsUserListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_CONCERNS_USER_LIST);
export const getConcernDeptByHeadAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_CONCERN_DEPARTMENT_BYHEAD_REQUEST);
export const getAllModulesListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_ALL_MODULES_LIST);

// concern to parent

export const getConcernsToParentListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_CONCERNS_TO_PARENT_LIST);
export const saveConcernsToParentListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.SAVE_CONCERNS_TO_PARENT_LIST);
export const getConcernsToParentSectionListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_CONCERNS_TO_PARENT_SECTION_LIST);


// helpdesk dashboard
export const getHelpDeskStatsAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_HELPDESK_STATS);
export const getFetchRequestTypeAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_FETCH_REQUEST_TYPE);
export const getDepartmentListAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_DEPARRTMENT_LIST);
export const getMonthWiseTicketsAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_MONTH_WISE_TICKETS);
export const getTopTenDepartmentsAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_TOP_TEN_DEPARTMENTS);
export const getTopTenDepartmentsModelAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_TOP_TEN_DEPARTMENTS_MODEL);
export const getDepartmentAnalysisAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.GET_DEPARTMENT_ANALYSIS);
export const exportOpenTicketsAct = createAction<INewActionType | undefined>(ConcernsFeedbackConstants.EXPORT_OPEN_TICKETS);
