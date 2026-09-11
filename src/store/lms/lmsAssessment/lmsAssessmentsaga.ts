import axios, { AxiosError, AxiosResponse } from "axios";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { lmsAssessmentErrorAct, setAllAssessmentsAct, setAssessmentByIdAct, setAssessmentCodeAct, setAssessmentQuestionsByIdAct, setAssessmentReviewAct, setAssessmentStatsAct, setAssignStudentsAssessmentByIdAct, setDeleteGradeDistrubutionAct, setDeleteQuestionBankAct, setDeleteQuestionPoolLibraryAct, setEditFeedbackAct, setEditQuestionPoolLibraryAct, setExportStudentResultListAct, setGlobalSettingsBranchIdAct, setGradeDistrubutionAct, setGradeDistrubutionByIdAct, setLiveMonitorAct, setQuestionBankAct, setQuestionBankByIdAct, setQuestionPoolLibraryAct, setQuestionPoolLibraryByIdAct, setResultListAct, setSaveAssessemntSettingsStepAct, setSaveAssessmentQuestionsAct, setSaveAssignStudentAssessmentAct, setSaveBasicAssessmentAct, setSaveGlobalSettingsAct, setSaveGradeDistrubutionAct, setSavePublishAssessmentAct, setSaveQuestionBankAct, setSaveQuestionPoolLibraryAct, setSaveRescheduleAssessmentAct, setSettingsByAssessmentIdAct, setUpdateGradeDistrubutionAct, setUpdateQuestionBankAct } from "./lmsAssessmentslice";
// import { lmsAssessmentErrorAct, setQuestionBankAct, setQuestionPoolLibraryAct, setSaveQuestionPoolLibraryAct } from "./lmsAssessmentslice";
import { lmsAssessmentConstants } from "./lmsAssessmentconstants";

//Lms Settings

function* getQuestionBankGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setQuestionBankAct(response.data));
    }
}
function* getQuestionBankByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setQuestionBankByIdAct(response.data));
    }
}
function* saveQuestionBankGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setSaveQuestionBankAct({statusCode: response.status}));
    }
}
function* updateQuestionBankGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setUpdateQuestionBankAct({statusCode: response.status}));
    }
}

function* getQuestionPoolLibraryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setQuestionPoolLibraryAct(response.data));
    }
}
function* saveQuestionPoolLibraryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setSaveQuestionPoolLibraryAct({statusCode : response.status}));
    }
}
function* deleteQuestionPoolLibraryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setDeleteQuestionPoolLibraryAct({statusCode : response.status}));
    }
}

function* editQuestionPoolLibraryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setEditQuestionPoolLibraryAct({statusCode : response.status}));
    }
}

function* getQuestionPoolLibraryByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setQuestionPoolLibraryByIdAct(response.data));
    }
}

function* deleteQuestionBankGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setDeleteQuestionBankAct({statusCode : response.status}));
    }
}


// Create Assessment
function* saveBasicAssessmentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setSaveBasicAssessmentAct({statusCode: response.status, data: response.data}));
    }
}
function* getAssessmentCodeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setAssessmentCodeAct(response.data));
    }
}
function* getAssessmentByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setAssessmentByIdAct(response.data));
    }
}
function* saveAssessmentQuestionsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setSaveAssessmentQuestionsAct({statusCode: response.status, data: response.data}));
    }
}
function* saveRescheduleAssessmentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setSaveRescheduleAssessmentAct({statusCode: response.status, data: response.data}));
    }
}
function* getAssessmentQuestionsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setAssessmentQuestionsByIdAct(response.data));
    }
}
function* getAssignStudentsAssessmentByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setAssignStudentsAssessmentByIdAct(response.data));
    }
}
function* getAssessmentStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setAssessmentStatsAct(response.data));
    }
}
function* saveAssessmentSettingsStepGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setSaveAssessemntSettingsStepAct({statusCode: response.status, data: response.data}))
    }
}
function* saveAssignStudentAssessmentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setSaveAssignStudentAssessmentAct({ statusCode: response.status, data: response.data }))
    }
}
function* savePublishAssessmentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setSavePublishAssessmentAct({ statusCode: response.status, data: response.data }))
    }
}

// get all assesments
function* getAllAssessmentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setAllAssessmentsAct(response.data));
    }
}

// Global Settings
function* getSettingsByAssessmentIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setSettingsByAssessmentIdAct(response.data));
    }
}
function* getGlobalSettingsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setGlobalSettingsBranchIdAct(response.data));
    }
}

function* saveGlobalSettingsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setSaveGlobalSettingsAct({ statusCode: response.status, data: response.data }))
    }
}

// Grades Distribution
function* getGradeDistrubutionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setGradeDistrubutionAct(response.data));
    }
}
function* saveGradeDistrubutionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setSaveGradeDistrubutionAct({ statusCode: response.status, data: response.data }))
    }
}
function* updateGradeDistrubutionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setUpdateGradeDistrubutionAct({ statusCode: response.status, data: response.data }))
    }
}
function* editFeedbackGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setEditFeedbackAct({ statusCode: response.status }))
    }
}
function* deleteGradeDistrubutionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setDeleteGradeDistrubutionAct({ statusCode: response.status, data: response.data }))
    }
}
function* getGradeDistrubutionByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setGradeDistrubutionByIdAct(response.data));
    }
}
function* getAssessmentReviewGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setAssessmentReviewAct(response.data));
    }
}

// view Assessment
function* getResultListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setResultListAct(response.data));
    }
}
function* getLiveMonitorGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setLiveMonitorAct(response.data));
    }
}
function* exportStudentResultListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(lmsAssessmentErrorAct(response.error));
    } else {
        yield put(setExportStudentResultListAct(response.data));
    }
}

export default function* lmsAssessmentSaga() {
    
    //Lms Settings
    yield takeLatest(lmsAssessmentConstants.GET_QUESTION_BANK_REPOSITORY, getQuestionBankGen);
    yield takeLatest(lmsAssessmentConstants.GET_QUESTION_BANK_REPOSITORY_BY_ID, getQuestionBankByIdGen);
    yield takeLatest(lmsAssessmentConstants.SAVE_QUESTION_BANK_REPOSITORY, saveQuestionBankGen);
    yield takeLatest(lmsAssessmentConstants.UPDATE_QUESTION_BANK_REPOSITORY, updateQuestionBankGen);
    yield takeLatest(lmsAssessmentConstants.DELETE_QUESTION_BANK_REPOSITORY, deleteQuestionBankGen);
    
    //question pool
    yield takeLatest(lmsAssessmentConstants.GET_QUESTION_POOL_LIBRARY, getQuestionPoolLibraryGen);
    yield takeLatest(lmsAssessmentConstants.SAVE_QUESTION_POOL_LIBRARY, saveQuestionPoolLibraryGen);
    yield takeLatest(lmsAssessmentConstants.DELETE_QUESTION_POOL_LIBRARY, deleteQuestionPoolLibraryGen);
    yield takeLatest(lmsAssessmentConstants.EDIT_QUESTION_POOL_LIBRARY, editQuestionPoolLibraryGen);
    yield takeLatest(lmsAssessmentConstants.GET_QUESTION_POOL_LIBRARY_BY_ID, getQuestionPoolLibraryByIdGen);

    //Create Assessment
    yield takeLatest(lmsAssessmentConstants.SAVE_BASIC_ASSESSMENT, saveBasicAssessmentGen);
    yield takeLatest(lmsAssessmentConstants.GET_ASSESSMENT_CODE, getAssessmentCodeGen);
    yield takeLatest(lmsAssessmentConstants.GET_ASSESSMENT_BY_ID, getAssessmentByIdGen);
    yield takeLatest(lmsAssessmentConstants.SAVE_ASSESSMENT_QUESTIONS, saveAssessmentQuestionsGen);
    yield takeLatest(lmsAssessmentConstants.GET_ASSESSMENT_QUESTIONS_BY_ID, getAssessmentQuestionsByIdGen);
    yield takeLatest(lmsAssessmentConstants.SAVE_ASSESSMENT_SETTINGS_STEP, saveAssessmentSettingsStepGen)
    yield takeLatest(lmsAssessmentConstants.SAVE_ASSIGN_STUDENTS_ASSESSMENT, saveAssignStudentAssessmentGen);
    yield takeLatest(lmsAssessmentConstants.GET_ASSIGN_STUDENTS_ASSESSMENT_BY_ID, getAssignStudentsAssessmentByIdGen);
    yield takeLatest(lmsAssessmentConstants.SAVE_PUBLISHED_ASSESSMENT, savePublishAssessmentGen);
    yield takeLatest(lmsAssessmentConstants.SAVE_RESCHEDULE_ASSESSMENT, saveRescheduleAssessmentGen);
    yield takeLatest(lmsAssessmentConstants.GET_ASSESSMENT_STATS, getAssessmentStatsGen);
    
    //get all assesments
    yield takeLatest(lmsAssessmentConstants.GET_ALL_ASSESSMENTS, getAllAssessmentsGen);    

    //Global Settings
    yield takeLatest(lmsAssessmentConstants.GET_SETTINGS_ASSESSMENT_ID, getSettingsByAssessmentIdGen);
    yield takeLatest(lmsAssessmentConstants.GET_GLOBAL_SETTINGS_BRANCH_ID, getGlobalSettingsByIdGen);
    yield takeLatest(lmsAssessmentConstants.SAVE_GLOBAL_SETTINGS, saveGlobalSettingsGen);

    // Grades Distribution
    yield takeLatest(lmsAssessmentConstants.GET_GRADES_DISTRIBUTION, getGradeDistrubutionGen);
    yield takeLatest(lmsAssessmentConstants.SAVE_GRADES_DISTRIBUTION, saveGradeDistrubutionGen);
    yield takeLatest(lmsAssessmentConstants.UPDATE_GRADES_DISTRIBUTION, updateGradeDistrubutionGen);
    yield takeLatest(lmsAssessmentConstants.DELETE_GRADES_DISTRIBUTION, deleteGradeDistrubutionGen);
    yield takeLatest(lmsAssessmentConstants.GET_GRADES_DISTRIBUTION_BY_ID, getGradeDistrubutionByIdGen);
    yield takeLatest(lmsAssessmentConstants.GET_ASSESSMENT_REVIEW, getAssessmentReviewGen);

    //view Assessment
    yield takeLatest(lmsAssessmentConstants.GET_RESULT_LIST, getResultListGen);
    yield takeLatest(lmsAssessmentConstants.EDIT_FEEDBACK, editFeedbackGen);
    yield takeLatest(lmsAssessmentConstants.GET_LIVE_MONITOR, getLiveMonitorGen);
    yield takeLatest(lmsAssessmentConstants.EXPORT_STUDENT_RESULT_LIST, exportStudentResultListGen);
    
}