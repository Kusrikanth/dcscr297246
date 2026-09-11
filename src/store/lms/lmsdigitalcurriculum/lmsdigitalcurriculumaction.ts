import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { lmsdigitalcurriculumConstants } from "./lmsdigitalcurriculumconstants";
export { resetSaveDigitalCurriculumBulkUploadExcelAct, resetDigitalCurriculumManualUploadByIdAct, resetHodReviewCoursePlannerDetailsByIdAct, resetSaveDigitalCurriculumManualUploadAct, resetHodReviewDigitalCurriculumDetailsByIdAct, resetHodFeedbackHistoryDetailsByIdAct, resetDigitalCurriculumBasicDetailsByIdAct, resetCurriculumStructureAct } from "./lmsdigitalcurriculumslice";

// Digital Curriculum
export const getDigitalCurriculumStatsAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.GET_DIGITAL_CURRICULUM_STATS);
export const getDigitalCurriculumListAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.GET_DIGITAL_CURRICULUM_LIST);
export const getDigitalCurriculumBasicDetailsByIdAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.GET_DIGITAL_CURRICULUM_BASIC_DETAILS_BY_ID);
export const saveBasicDigitalCurriculumAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.SAVE_BASIC_DIGITAL_CURRICULUM);
export const saveDigitalCurriculumBulkUploadExcelAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.SAVE_DIGITAL_CURRICULUM_BULK_UPLOAD_EXCEL);
export const saveHeaderMapDigitalCurriculumAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.SAVE_HEADER_MAP_DIGITAL_CURRICULUM);
export const getDigitalCurriculumBulkUploadPreviewAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.GET_DIGITAL_CURRICULUM_BULK_UPLOAD_PREVIEW);
export const saveDigitalCurriculumBulkUploadAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.SAVE_DIGITAL_CURRICULUM_BULK_UPLOAD);
export const getDigitalCurriculumManualUploadByIdAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.GET_DIGITAL_CURRICULUM_MANUAL_UPLOAD_BY_ID);
export const saveDigitalCurriculumManualUploadAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.SAVE_DIGITAL_CURRICULUM_MANUAL_UPLOAD);
export const previewDigitalCurriculumDetailsAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.PREVIEW_DIGITAL_CURRICULUM_DETAILS);
export const submitDigitalCurriculumReviewAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.SUBMIT_DIGITAL_CURRICULUM_REVIEW);
export const publishDigitalCurriculumAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.PUBLISH_DIGITAL_CURRICULUM);
export const getCurriculumStructureAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.GET_CURRICULUM_STRUCTURE);
export const getinlineBuilderGridAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.GET_INLINE_BUILDER_GRID);
export const getWeeksListAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.GET_WEEKS_LIST);
export const saveSubjectCurriculumBuildAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.SAVE_SUBJECT_CURRICULUM_BUILDER);
export const sendBuildReviewAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.SEND_BUILD_REVIEW);
export const saveBuildPublishAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.SAVE_BUILD_PUBLISH);
export const digitalCurriculumDownloadReportAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.DIGITAL_CURRICULUM_DOWNLOAD_REPORT);

//HOD Digital Curriculum Review
export const hodReviewDigitalCurriculumDetailsByIdAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.HOD_REVIEW_DIGITAL_CURRICULUM_DETAILS_BY_ID);
export const submitHodReviewDigitalCurriculumDetailsByIdAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.SUBMIT_HOD_REVIEW_DIGITAL_CURRICULUM_DETAILS_BY_ID);
export const hodFeedbackHistoryDigitalCurriculumDetailsByIdAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.HOD_FEEDBACK_HISTORY_DETAILS_BY_ID);

// Course Planner-HOD Review
export const hodReviewCoursePlannerDetailsByIdAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.HOD_REVIEW_COURSE_PLANNER_DETAILS_BY_ID);
export const submitHodReviewCoursePlannerDetailsByIdAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.SUBMIT_HOD_REVIEW_COURSE_PLANNER_DETAILS_BY_ID);
export const hodFeedbackHistoryCoursePlannerDetailsByIdAct = createAction<INewActionType | undefined>(lmsdigitalcurriculumConstants.HOD_FEEDBACK_HISTORY_COURSE_PLANNER_DETAILS_BY_ID);