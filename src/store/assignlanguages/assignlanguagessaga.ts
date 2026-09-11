import {call,put,takeLatest} from "redux-saga/effects";

import { setAdvanceFilterClassListAct, setAdvanceFilterCurriculumListAct, setAssignLanBrchStreamGroupsAct, setAssignLanClassListAct, setAssignLanSectionListAct, setAssignLanguagesErrAct, setAssignLanguagesListAct, setAssignListCurriculumAct, setCopyAssignLanguagesAct, setExaminationLanguagesListAct, setExportAssignLanguagesAct, setStuLanguagesListAct, setUpdateAssignLanguagesAct } from "./assignlanguagesslice";
import { getData, postData } from "../../api/apiactions";
import { AssignLanguagesConstants } from "./assignlanguagesconstants";
import { ICreatedActionType } from "../types";

function* getAssignLanguagesListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAssignLanguagesErrAct(response.error));
    } else {
        yield put(setAssignLanguagesListAct(response.data));
    }
}

function* getStuLanguagesListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAssignLanguagesErrAct(response.error));
    } else {
        yield put(setStuLanguagesListAct(response.data));
    }
}
function* getAssignLanClassListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAssignLanguagesErrAct(response.error));
    } else {
        yield put(setAssignLanClassListAct(response.data));
    }
}

function* getAssignCurriculumListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAssignLanguagesErrAct(response.error));
    } else {
        yield put(setAssignListCurriculumAct(response.data));
    }
}

function* getAssignLanSectionListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAssignLanguagesErrAct(response.error));
    } else {
        yield put(setAssignLanSectionListAct(response.data));
    }
}

function* updateAssignLanguagesGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAssignLanguagesErrAct(response.error));
    } else {
        yield put(setUpdateAssignLanguagesAct({statusCode : response.status}));
    }
}
function* copyAssignLanguagesGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAssignLanguagesErrAct(response.error));
    } else {
        yield put(setCopyAssignLanguagesAct({statusCode : response.status}));
    }
}
function* advanceFilterCurriculumListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAssignLanguagesErrAct(response.error));
    } else {
        yield put(setAdvanceFilterCurriculumListAct(response.data));
    }
}

function* advanceFilterClassListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAssignLanguagesErrAct(response.error));
    } else {
        yield put(setAdvanceFilterClassListAct(response.data));
    }
}
function* exportAssignLanguagesGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAssignLanguagesErrAct(response.error));
    } else {
        yield put(setExportAssignLanguagesAct(response.data));
    }
}
function* getAssignLanBrchStreamGroupsGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAssignLanguagesErrAct(response.error));
    } else {
        yield put(setAssignLanBrchStreamGroupsAct(response.data));
    }
}
function* getExaminationLanguagesListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAssignLanguagesErrAct(response.error));
    } else {
        yield put(setExaminationLanguagesListAct(response.data));
    }
}


export default function* assignLanguagesSaga(){
    yield takeLatest(AssignLanguagesConstants.GET_ASSIGN_LANGUAGES_LIST ,getAssignLanguagesListGen);
    yield takeLatest(AssignLanguagesConstants.GET_STU_LANGUAGES_LIST ,getStuLanguagesListGen);
    yield takeLatest(AssignLanguagesConstants.ASSIGN_LAN_CLASS_LIST ,getAssignLanClassListGen);
    yield takeLatest(AssignLanguagesConstants.ASSIGN_LAN_SECTION_LIST ,getAssignLanSectionListGen);
    yield takeLatest(AssignLanguagesConstants.UPDATE_ASSIGN_LANGUAGES ,updateAssignLanguagesGen);
    yield takeLatest(AssignLanguagesConstants.COPY_ASSIGN_LANGUAGES ,copyAssignLanguagesGen);
    yield takeLatest(AssignLanguagesConstants.ASSIGN_CURRICULUM_LIST ,getAssignCurriculumListGen);
    yield takeLatest(AssignLanguagesConstants.ADVANCE_FILTER_CURRICULUM_LIST ,advanceFilterCurriculumListGen);
    yield takeLatest(AssignLanguagesConstants.ADVANCE_FILTER_CLASS_LIST ,advanceFilterClassListGen);
    yield takeLatest(AssignLanguagesConstants.EXPORT_ASSIGN_LANGUAGES ,exportAssignLanguagesGen);
    yield takeLatest(AssignLanguagesConstants.ASSIGN_LAN_BRCH_STREAM_GROUPS ,getAssignLanBrchStreamGroupsGen);
    yield takeLatest(AssignLanguagesConstants.GET_EXAMINATION_LANGUAGES_LIST ,getExaminationLanguagesListGen);

}