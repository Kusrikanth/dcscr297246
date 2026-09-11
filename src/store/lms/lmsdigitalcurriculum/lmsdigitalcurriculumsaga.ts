import { call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { getData, postData } from "../../../api/apiactions";
import { lmsdigitalcurriculumErrorAct, setGetDigitalCurriculumBulkUploadPreviewAct, setDigitalCurriculumListAct, setSaveBasicDigitalCurriculumAct, setSaveDigitalCurriculumBulkUploadAct, setSaveDigitalCurriculumBulkUploadExcelAct, setSaveHeaderMapDigitalCurriculumAct, setDigitalCurriculumManualUploadByIdAct, setSaveDigitalCurriculumManualUploadAct, setPreviewDigitalCurriculumDetailsAct, setSubmitDigitalCurriculumReviewAct, setHodReviewDigitalCurriculumDetailsByIdAct, setHodFeedbackHistoryDetailsByIdAct, setSubmitHodReviewDigitalCurriculumDetailsByIdAct, setDigitalCurriculumStatsAct, setDigitalCurriculumBasicDetailsByIdAct, setSavePublishDigitalCurriculumAct, setHodReviewCoursePlannerDetailsByIdAct, setSubmitHodReviewCoursePlannerDetailsByIdAct, setHodFeedbackHistoryCoursePlannerDetailsByIdAct, setCurriculumStructureAct, setinlineBuilderGridAct, setWeeksListAct, saveSubjectCurriculumBuildAct, setSendBuildReviewAct, setSaveBuildPublishAct, setDigitalCurriculumDownloadReportAct } from "./lmsdigitalcurriculumslice";
import { lmsdigitalcurriculumConstants } from "./lmsdigitalcurriculumconstants";

// Digital Curriculum
function* getDigitalCurriculumStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setDigitalCurriculumStatsAct(response.data));
    }
}
function* getDigitalCurriculumListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setDigitalCurriculumListAct(response.data));
    }
}

function* saveBasicDigitalCurriculumGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setSaveBasicDigitalCurriculumAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}

function* getDigitalCurriculumBasicDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setDigitalCurriculumBasicDetailsByIdAct(response.data));
    }
}

function* saveDigitalCurriculumBulkUploadExcelGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setSaveDigitalCurriculumBulkUploadExcelAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}

function* saveHeaderMapDigitalCurriculumGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setSaveHeaderMapDigitalCurriculumAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}

function* getDigitalCurriculumBulkUploadPreviewGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setGetDigitalCurriculumBulkUploadPreviewAct(response.data));
    }
}

function* saveDigitalCurriculumBulkUploadGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setSaveDigitalCurriculumBulkUploadAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}

function* getDigitalCurriculumManualUploadByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setDigitalCurriculumManualUploadByIdAct(response.data));
    }
}

function* saveDigitalCurriculumManualUploadGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setSaveDigitalCurriculumManualUploadAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}

function* getPreviewDigitalCurriculumDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setPreviewDigitalCurriculumDetailsAct(response.data));
    }
}

function* submitDigitalCurriculumReviewGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setSubmitDigitalCurriculumReviewAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}

function* publishDigitalCurriculumGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setSavePublishDigitalCurriculumAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}

function* getCurriculumStructuregen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setCurriculumStructureAct(response.data));
    }
}
function* getinlineBuilderGridGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setinlineBuilderGridAct(response.data));
    }
}
function* getWeeksListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setWeeksListAct(response.data));
    }
}
function* saveSubjectCurriculumBuildGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(saveSubjectCurriculumBuildAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}
function* sendBuildReviewGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setSendBuildReviewAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}
function* saveBuildPublishGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setSaveBuildPublishAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}
function* digitalCurriculumDownloadReportGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
  if (response && response.error) {
    yield put(lmsdigitalcurriculumErrorAct(response.error));
  } else {
    yield put(setDigitalCurriculumDownloadReportAct(response.data));
  }
}

//HOD Review
function* getHodReviewDigitalCurriculumDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setHodReviewDigitalCurriculumDetailsByIdAct(response.data));
    }
}

function* submitHodReviewDigitalCurriculumDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setSubmitHodReviewDigitalCurriculumDetailsByIdAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}

function* getHodFeedbackHistoryDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setHodFeedbackHistoryDetailsByIdAct(response.data));
    }
}

//HOD Course Planner Review
function* getHodReviewCoursePlannerDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setHodReviewCoursePlannerDetailsByIdAct(response.data));
    }
}

function* submitHodReviewCoursePlannerDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setSubmitHodReviewCoursePlannerDetailsByIdAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}

function* getHodFeedbackHistoryCoursePlannerDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsdigitalcurriculumErrorAct(response.error));
    } else {
        yield put(setHodFeedbackHistoryCoursePlannerDetailsByIdAct(response.data));
    }
}
export default function* lmsdigitalcurriculumSaga() {

    // Digital Curriculum
    yield takeLatest(lmsdigitalcurriculumConstants.GET_DIGITAL_CURRICULUM_STATS, getDigitalCurriculumStatsGen);
    yield takeLatest(lmsdigitalcurriculumConstants.GET_DIGITAL_CURRICULUM_LIST, getDigitalCurriculumListGen);
    yield takeLatest(lmsdigitalcurriculumConstants.SAVE_BASIC_DIGITAL_CURRICULUM, saveBasicDigitalCurriculumGen);
    yield takeLatest(lmsdigitalcurriculumConstants.GET_DIGITAL_CURRICULUM_BASIC_DETAILS_BY_ID, getDigitalCurriculumBasicDetailsByIdGen);
    yield takeLatest(lmsdigitalcurriculumConstants.SAVE_DIGITAL_CURRICULUM_BULK_UPLOAD_EXCEL, saveDigitalCurriculumBulkUploadExcelGen);
    yield takeLatest(lmsdigitalcurriculumConstants.SAVE_HEADER_MAP_DIGITAL_CURRICULUM, saveHeaderMapDigitalCurriculumGen);
    yield takeLatest(lmsdigitalcurriculumConstants.GET_DIGITAL_CURRICULUM_BULK_UPLOAD_PREVIEW, getDigitalCurriculumBulkUploadPreviewGen);
    yield takeLatest(lmsdigitalcurriculumConstants.SAVE_DIGITAL_CURRICULUM_BULK_UPLOAD, saveDigitalCurriculumBulkUploadGen);
    yield takeLatest(lmsdigitalcurriculumConstants.GET_DIGITAL_CURRICULUM_MANUAL_UPLOAD_BY_ID, getDigitalCurriculumManualUploadByIdGen);
    yield takeLatest(lmsdigitalcurriculumConstants.SAVE_DIGITAL_CURRICULUM_MANUAL_UPLOAD, saveDigitalCurriculumManualUploadGen);
    yield takeLatest(lmsdigitalcurriculumConstants.PREVIEW_DIGITAL_CURRICULUM_DETAILS, getPreviewDigitalCurriculumDetailsGen);
    yield takeLatest(lmsdigitalcurriculumConstants.SUBMIT_DIGITAL_CURRICULUM_REVIEW, submitDigitalCurriculumReviewGen);
    yield takeLatest(lmsdigitalcurriculumConstants.PUBLISH_DIGITAL_CURRICULUM, publishDigitalCurriculumGen);
    yield takeLatest(lmsdigitalcurriculumConstants.GET_CURRICULUM_STRUCTURE, getCurriculumStructuregen);
    yield takeLatest(lmsdigitalcurriculumConstants.GET_INLINE_BUILDER_GRID, getinlineBuilderGridGen);
    yield takeLatest(lmsdigitalcurriculumConstants.GET_WEEKS_LIST, getWeeksListGen);
    yield takeLatest(lmsdigitalcurriculumConstants.SAVE_SUBJECT_CURRICULUM_BUILDER, saveSubjectCurriculumBuildGen);
    yield takeLatest(lmsdigitalcurriculumConstants.SEND_BUILD_REVIEW, sendBuildReviewGen);
    yield takeLatest(lmsdigitalcurriculumConstants.SAVE_BUILD_PUBLISH, saveBuildPublishGen);
    yield takeLatest(lmsdigitalcurriculumConstants.DIGITAL_CURRICULUM_DOWNLOAD_REPORT, digitalCurriculumDownloadReportGen);
    //HOD Review
    yield takeLatest(lmsdigitalcurriculumConstants.HOD_REVIEW_DIGITAL_CURRICULUM_DETAILS_BY_ID, getHodReviewDigitalCurriculumDetailsByIdGen);
    yield takeLatest(lmsdigitalcurriculumConstants.SUBMIT_HOD_REVIEW_DIGITAL_CURRICULUM_DETAILS_BY_ID, submitHodReviewDigitalCurriculumDetailsByIdGen);
    yield takeLatest(lmsdigitalcurriculumConstants.HOD_FEEDBACK_HISTORY_DETAILS_BY_ID, getHodFeedbackHistoryDetailsByIdGen);

    // Course Planner-HOD Review
    yield takeLatest(lmsdigitalcurriculumConstants.HOD_REVIEW_COURSE_PLANNER_DETAILS_BY_ID, getHodReviewCoursePlannerDetailsByIdGen);
    yield takeLatest(lmsdigitalcurriculumConstants.SUBMIT_HOD_REVIEW_COURSE_PLANNER_DETAILS_BY_ID, submitHodReviewCoursePlannerDetailsByIdGen);
    yield takeLatest(lmsdigitalcurriculumConstants.HOD_FEEDBACK_HISTORY_COURSE_PLANNER_DETAILS_BY_ID, getHodFeedbackHistoryCoursePlannerDetailsByIdGen);
}