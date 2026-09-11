import { call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { getData, postData } from "../../../api/apiactions";
import {
  setCurrentStatusOfAssessmentAct,
  setDownloadResultReportCardAct,
  setGetAssessmentQuestionsDetailsAct,
  setGetAssessmentQuestionSectionHeatMapGenAct,
  setGetAssessmentSectionGradeSummaryDetailsGenAct,
  setGetAssessmentSectionWiseMarksOutcomeDetailsGenAct,
  setGetAssessmentSectionWiseOutcomeDetailsGenAct,
  setGetAssessmentSummaryResultDetailsAct,
  setGetAssessmentWiseTopStudentsDetailsGenAct,
  setGetStatsByAssessmentGenAct,
  setGetStudentAssessmentStatsDetailsGenAct,
  setRestartAssessmentAct,
  setSaveAutoAssessmentAct,
  setSaveEvaluateManualMarksAct,
  setSaveQuestionOrderByAttempIdAct,
  setStartAssessmentDetailsAct,
  setStudentAssessmentsErrorAct,
  setStudentAssessmentsListAct,
  setStudentAssessmentsListByIdAct,
  setStudentAssessmentsListByIdErrorAct,
  setStudentAssessmentsQuestionsAct,
  setStudentAssessmentsQuestionsErrorAct,
  setsubmitAssessmentAct,
  setValidateStudentReadinessAct,
  setValidateStudentReadinessErrorAct,
} from "./studentAssessmentSlice";
import { studentAssessmentConstants } from "./studentAssessmentConstants";
import { getStudentAssessmentsListByIdAct } from "./studentAssessmentActions";
import { LocationFavourite01Icon } from "@hugeicons-pro/core-stroke-standard";

function* getStudentAssessmentsListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setStudentAssessmentsErrorAct(response.error));
  } else {
    yield put(setStudentAssessmentsListAct(response.data));
  }
}

function* getStudentAssessmentsListByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setStudentAssessmentsListByIdErrorAct(response.error));
  } else {
    yield put(setStudentAssessmentsListByIdAct(response.data));
  }
}

function* getStudentAssessmentsQuestionsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setStudentAssessmentsQuestionsErrorAct(response.error));
  } else {
    yield put(setStudentAssessmentsQuestionsAct(response.data));
  }
}

function* validateStudentReadinessGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setValidateStudentReadinessErrorAct(response.error));
  } else {
    yield put(setValidateStudentReadinessAct(response.data));
  }
}

function* getCurrentStatusOfAssessmentGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setStudentAssessmentsErrorAct(response.error));
  } else {
    yield put(setCurrentStatusOfAssessmentAct(response.data))
  }
}

function* getStartAssessmentDetailsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setStudentAssessmentsQuestionsErrorAct(response.error));
  } else {
    yield put(setStartAssessmentDetailsAct(response.data));
  }
}

function* restartAssessmentGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setStudentAssessmentsQuestionsErrorAct(response.error));
  } else {
    yield put(setRestartAssessmentAct(response.data));
  }
}

function* saveQuestionOrderByAttempIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setStudentAssessmentsQuestionsErrorAct(response.error));
    } else {
        yield put(setSaveQuestionOrderByAttempIdAct(response.data));
    }
}

function* saveAutoAssessmentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setStudentAssessmentsQuestionsErrorAct(response.error));
    } else {
        yield put(setSaveAutoAssessmentAct(response.data));
    }
}

//Submit Assessment Test
function* submitAssessmentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setStudentAssessmentsQuestionsErrorAct(response.error));
    } else {
        yield put(setsubmitAssessmentAct({statusCode : response.status, ...response.data}));
    }
}

function* getAssessmentSummaryResultDetailsAct(action: ICreatedActionType): any {
  const { payload } = action;
   const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
  if (response && response.error) {
    yield put(setStudentAssessmentsErrorAct(response.error));
  } else {
    yield put(setGetAssessmentSummaryResultDetailsAct(response.data))
  }
}

function* getAssessmentQuestionDetailsGen(action: ICreatedActionType): any {
  const { payload } = action;
   const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
  if (response && response.error) {
    yield put(setStudentAssessmentsErrorAct(response.error));
  } else {
    yield put(setGetAssessmentQuestionsDetailsAct(response.data))
  }
}
function* saveEvaluateManualMarksGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setStudentAssessmentsErrorAct(response.error));
    } else {
        yield put(setSaveEvaluateManualMarksAct({statusCode : response.status}));
  }
}
function* downloadResultReportCardGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
  if (response && response.error) {
    yield put(setStudentAssessmentsErrorAct(response.error));
  } else {
    yield put(setDownloadResultReportCardAct(response.data));
  }
}

//Dashboard
function* getAssessmentQuestionSectionHeatMapGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
  if (response && response.error) {
    yield put(setStudentAssessmentsErrorAct(response.error));
  } else {
    yield put(setGetAssessmentQuestionSectionHeatMapGenAct(response.data))
  }
}

function* getStatsByAssessmentGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
  if (response && response.error) {
    yield put(setStudentAssessmentsErrorAct(response.error));
  } else {
    yield put(setGetStatsByAssessmentGenAct(response.data))
  }
}

function* getAssessmentWiseTopStudentsDetailsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
  if (response && response.error) {
    yield put(setStudentAssessmentsErrorAct(response.error));
  } else {
    yield put(setGetAssessmentWiseTopStudentsDetailsGenAct(response.data))
  }
}

function* getAssessmentSectionGradeSummaryDetailsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
  if (response && response.error) {
    yield put(setStudentAssessmentsErrorAct(response.error));
  } else {
    yield put(setGetAssessmentSectionGradeSummaryDetailsGenAct(response.data))
  }
}

function* getAssessmentSectionWiseOutcomeDetailsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
  if (response && response.error) {
    yield put(setStudentAssessmentsErrorAct(response.error));
  } else {
    yield put(setGetAssessmentSectionWiseOutcomeDetailsGenAct(response.data))
  }
}

function* getAssessmentSectionWiseMarksOutcomeDetailsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
  if (response && response.error) {
    yield put(setStudentAssessmentsErrorAct(response.error));
  } else {
    yield put(setGetAssessmentSectionWiseMarksOutcomeDetailsGenAct(response.data))
  }
}

//Student-Assessment

function* getStudentAssessmentStatsDetailsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
  if (response && response.error) {
    yield put(setStudentAssessmentsErrorAct(response.error));
  } else {
    yield put(setGetStudentAssessmentStatsDetailsGenAct(response.data))
  }
}

export default function* studentAssessmentsSaga() {
  yield takeLatest(
    studentAssessmentConstants.GET_STUDENT_ASSESSMENTS,
    getStudentAssessmentsListGen
  );

  yield takeLatest(
    studentAssessmentConstants.GET_STUDENT_ASSESSMENTS_BY_ID,
    getStudentAssessmentsListByIdGen
  );

  yield takeLatest(
    studentAssessmentConstants.GET_STUDENT_ASSESSMENTS_QUESTIONS,
    getStudentAssessmentsQuestionsGen
  );

  yield takeLatest(
    studentAssessmentConstants.VALIDATE_STUDENT_READINESS,
    validateStudentReadinessGen
  );

  yield takeLatest(studentAssessmentConstants.GET_CURRENT_STATUS_OF_ASSESSMENT, getCurrentStatusOfAssessmentGen)
  yield takeLatest(
    studentAssessmentConstants.GET_START_ASSESSMENT_CHANGES,
    getStartAssessmentDetailsGen
  );
  yield takeLatest(
    studentAssessmentConstants.RESTART_ASSESSMENT,
    restartAssessmentGen
  );

  yield takeLatest(studentAssessmentConstants.SAVE_QUESTION_ORDER_BY_ATTEMPT_ID, saveQuestionOrderByAttempIdGen);
  //Save Auto Assessment
  yield takeLatest(studentAssessmentConstants.SAVE_AUTO_ASSESSMENT, saveAutoAssessmentGen);

//Submit Assessment Test
  yield takeLatest(studentAssessmentConstants.SUBMIT_ASSESSMENT, submitAssessmentGen);
  yield takeLatest(studentAssessmentConstants.GET_ASSESSMENT_RESULT_SUMMARY_DETAILS, getAssessmentSummaryResultDetailsAct);
  yield takeLatest(studentAssessmentConstants.GET_ASSESSMENT_QUESTION_DETAILS, getAssessmentQuestionDetailsGen);
  yield takeLatest(studentAssessmentConstants.SAVE_EVALUATE_MANUAL_MARKS, saveEvaluateManualMarksGen);
  yield takeLatest(studentAssessmentConstants.DOWNLOAD_RESULT_REPORT_CARD, downloadResultReportCardGen);

  //Dashboard
  yield takeLatest(studentAssessmentConstants.GET_ASSESSMENT_QUESTION_SECTION_HEATMAP, getAssessmentQuestionSectionHeatMapGen);
  yield takeLatest(studentAssessmentConstants.GET_STATS_BY_ASSESSMENT, getStatsByAssessmentGen);
  yield takeLatest(studentAssessmentConstants.GET_ASSESSMENT_WISE_TOP_STUDENTS_DETAILS, getAssessmentWiseTopStudentsDetailsGen);
  yield takeLatest(studentAssessmentConstants.GET_ASSESSMENT_SECTION_GRADE_SUMMARY_DETAILS, getAssessmentSectionGradeSummaryDetailsGen);
  yield takeLatest(studentAssessmentConstants.GET_ASSESSMENT_SECTION_WISE_OUTCOME_DETAILS, getAssessmentSectionWiseOutcomeDetailsGen);
  yield takeLatest(studentAssessmentConstants.GET_ASSESSMENT_SECTION_WISE_MARKS_OUTCOME_DETAILS, getAssessmentSectionWiseMarksOutcomeDetailsGen);

  //Student-Assessment
  yield takeLatest(studentAssessmentConstants.GET_STUDENT_ASSESSMENTS_STATS_DETAILS, getStudentAssessmentStatsDetailsGen);
    
}