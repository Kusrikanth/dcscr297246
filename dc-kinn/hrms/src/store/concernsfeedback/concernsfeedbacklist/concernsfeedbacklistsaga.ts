import { call, put, takeLatest } from "redux-saga/effects";


import { ICreatedActionType } from "../../types";
import { ConcernsFeedbackConstants } from "./concernsfeedbacklistconstants";
import { getData, postData, putData, deleteData } from "../../../api/apiactions";
import {
    setAddCommentListAct, setAddConcernFileAct, setAddConcernsFeedbackListAct,
    setCommentListAct, setConcernsFeedbackErrorAct, setConcernsFeedbackListAct,
    setConcernsFeedbackListByIdAct, setConcernsStatsAct, setConcernsUserListAct,
    setDeleteCommentListAct, setDeleteConcernFileAct, setEditCommentListAct,
    setEditConcernsFeedbackListAct, setConcernDeptByHeadAct, setExportConcernsFeedbackListAct,
    setConcernsToParentListAct,
    setConcernsToParentSectionListAct,
    setSaveConcernsToParentListAct,
    setAllModulesListAct,
    setHelpDeskStatsAct,
    setFetchRequestTypeAct,
    setDepartmentListAct,
    setMonthWiseTicketsAct,
    setTopTenDepartmentsAct,
    setTopTenDepartmentsModelAct,
    setDepartmentAnalysisAct,
    setExportOpenTicketsAct
} from "./concernsfeedbacklistslice";


function* getConcernsFeedbackListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setConcernsFeedbackListAct(response.data));
    }
}

function* getConcernsStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setConcernsStatsAct(response.data));
    }
}

function* getConcernsFeedbackListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setConcernsFeedbackListByIdAct(response.data));
    }
}

function* getCommentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setCommentListAct(response.data));
    }
}

function* editCommentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setEditCommentListAct({ statusCode: response.status }));
    }
}

function* deleteCommentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setDeleteCommentListAct({ statusCode: response.status }));
    }
}

function* deleteConcernFileGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setDeleteConcernFileAct({ statusCode: response.status }));
    }
}

function* addConcernFileGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setAddConcernFileAct({ statusCode: response.status }));
    }
}

function* addCommentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setAddCommentListAct({ statusCode: response.status }));
    }
}

function* editConcernsFeedbackListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setEditConcernsFeedbackListAct({ statusCode: response.status }));
    }
}

function* addConcernsFeedbackListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setAddConcernsFeedbackListAct({ statusCode: response.status }));
    }
}

function* getConcernsUserListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setConcernsUserListAct(response.data));
    }
}

function* exportConcernsFeedbackListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setExportConcernsFeedbackListAct(response.data));
    }
}

function* getConcernDeptByHeadGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setConcernDeptByHeadAct(response.data));
    }
}

// concern to parent
function* getConcernsToParentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setConcernsToParentListAct(response.data));
    }
}

function* getConcernsToParentSectionListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setConcernsToParentSectionListAct(response.data));
    }
}

function* saveConcernsToParentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setSaveConcernsToParentListAct({statusCode : response.status}));
    }
}

function* getAllModulesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setAllModulesListAct(response.data));
    }
}
function* getHelpDeskStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setHelpDeskStatsAct(response.data));
    }
}
function* getFetchRequestTypeGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setFetchRequestTypeAct(response.data));
    }
}
function* getDepartmentListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setDepartmentListAct(response.data));
    }
}
function* getMonthWiseTicketsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setMonthWiseTicketsAct(response.data));
    }
}
function* getTopTenDepartmentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setTopTenDepartmentsAct(response.data));
    }
}
function* getTopTenDepartmentsModelGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setTopTenDepartmentsModelAct(response.data));
    }
}
function* getDepartmentAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setDepartmentAnalysisAct(response.data));
    }
}
function* exportOpenTicketsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setConcernsFeedbackErrorAct(response.error));
    } else {
        yield put(setExportOpenTicketsAct(response.data));
    }
}

export default function* concernsFeedbackSaga() {
    yield takeLatest(ConcernsFeedbackConstants.GET_CONCERNS_FEEDBACK_LIST, getConcernsFeedbackListGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_CONCERNS_STATS, getConcernsStatsGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_CONCERNS_FEEDBACK_LIST_BY_ID, getConcernsFeedbackListByIdGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_COMMENT_LIST, getCommentListGen);
    yield takeLatest(ConcernsFeedbackConstants.EDIT_COMMENT_LIST, editCommentListGen);
    yield takeLatest(ConcernsFeedbackConstants.DELETE_COMMENT_LIST, deleteCommentListGen);
    yield takeLatest(ConcernsFeedbackConstants.DELETE_CONCERN_FILE_LIST, deleteConcernFileGen);
    yield takeLatest(ConcernsFeedbackConstants.ADD_CONCERN_FILE_LIST, addConcernFileGen);
    yield takeLatest(ConcernsFeedbackConstants.ADD_COMMENT_LIST, addCommentListGen);
    yield takeLatest(ConcernsFeedbackConstants.UPDATE_CONCERNS_FEEDBACK_LIST, editConcernsFeedbackListGen);
    yield takeLatest(ConcernsFeedbackConstants.ADD_CONCERNS_FEEDBACK_LIST, addConcernsFeedbackListGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_CONCERNS_USER_LIST, getConcernsUserListGen);
    yield takeLatest(ConcernsFeedbackConstants.EXPORT_CONCERNS_FEEDBACK_LIST, exportConcernsFeedbackListGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_CONCERN_DEPARTMENT_BYHEAD_REQUEST, getConcernDeptByHeadGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_ALL_MODULES_LIST, getAllModulesListGen);

    // concern to parent
    yield takeLatest(ConcernsFeedbackConstants.GET_CONCERNS_TO_PARENT_LIST, getConcernsToParentListGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_CONCERNS_TO_PARENT_SECTION_LIST, getConcernsToParentSectionListGen);
    yield takeLatest(ConcernsFeedbackConstants.SAVE_CONCERNS_TO_PARENT_LIST, saveConcernsToParentListGen);

    // helpdesk dashboard
    yield takeLatest(ConcernsFeedbackConstants.GET_HELPDESK_STATS, getHelpDeskStatsGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_FETCH_REQUEST_TYPE, getFetchRequestTypeGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_DEPARRTMENT_LIST, getDepartmentListGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_MONTH_WISE_TICKETS, getMonthWiseTicketsGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_TOP_TEN_DEPARTMENTS, getTopTenDepartmentsGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_TOP_TEN_DEPARTMENTS_MODEL, getTopTenDepartmentsModelGen);
    yield takeLatest(ConcernsFeedbackConstants.GET_DEPARTMENT_ANALYSIS, getDepartmentAnalysisGen);
    yield takeLatest(ConcernsFeedbackConstants.EXPORT_OPEN_TICKETS, exportOpenTicketsGen);
}