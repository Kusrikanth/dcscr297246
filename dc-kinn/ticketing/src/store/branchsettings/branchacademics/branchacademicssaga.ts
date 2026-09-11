import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
    setBrchAcademicYearAct,
    setAddBrchtAcademicYearAct, setUpdateBrchAcademicYearAct,
    setDeleteBrchAcademicYearAct,

    setBrchAcademicTermAct,
    setAddBrchAcademicTermAct, setUpdateBrchAcademicTermAct,
    setDeleteBrchAcademicTermAct,

    setBrchCurriculumAct, setBrchCurriculumScopeAct, setAddBrchCurriculumAct, setUpdateBrchCurriculumAct, setDeleteBrchCurriculumAct,
    setBrchClassAct, setBranchClassScopeAct, setAddBrchClassAct, setUpdateBrchClassAct, setDeleteBrchClassAct,

    setBrchCurriculumClassAct, setAddBrchCurriculumClassAct, setUpdateBrchCurriculumClassAct, setDeleteBrchCurriculumClassAct,

    setBrchSubjectsAct, setAddBrchSubjectAct, setUpdateBrchSubjectAct, setDeleteBrchSubjectAct,
    setBrchSectionsAct, setAddBrchSectionAct, setUpdateBrchSectionAct, setDeleteBrchSectionAct,
    setBrchSectionByClassAct,

    setBrchStreamGroupsAct, setAddBrchStreamGroupAct, setUpdateBrchStreamGroupAct, setDelBrchStreamGroupAct,

    setBrchAcademicClassesAct,
    setBrchAcademicsErrorAct,
    setClassWiseTermsDateAct,
    setDeleteClassWiseTermsDateAct,
    setClassBranchWiseTermsIdAct,
    setAddClassWiseTermsDateAct,
    setUpdateClassWiseTermsDateAct,
    setAddAcademicDateAct,
    setDeleteAcademicDateAct,
    setUpdateAcademicDateAct,
    setInstSubjectNameAct,
    setAcademicLanguagesAct,
    setMastersCurriculumAct,
    setMasterCurriculumClassAct,
    setCurriculumWiseAct
} from "./branchacademicsslice";
import { BranchAcademicsConstants } from "./branchacademicsconstants";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { addAcademicLanguagesAct, setInstInfoErrorAct } from "../../mastersettings/instituteinfo/instituteinfoslice";


function* getBrchAcademicYearGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setBrchAcademicYearAct(response.data));
    }
}
function* addBrchAcademicYearGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setAddBrchtAcademicYearAct(response.status));
    }
}
function* updateBrchAcademicYearGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setUpdateBrchAcademicYearAct({ status: response.status }));
    }
}

function* deleteBrchAcademicYearGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setDeleteBrchAcademicYearAct({ status: response.status }));
    }
}


function* getBrchAcademicTermGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setBrchAcademicTermAct(response.data));
    }
}
function* addBrchAcademicTermGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setAddBrchAcademicTermAct({ status: response.status }));
    }
}
function* updateBrchAcademicTermGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setUpdateBrchAcademicTermAct({ status: response.status }));
    }
}

function* deleteBrchAcademicTermGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setDeleteBrchAcademicTermAct({ status: response.status }));
    }
}

function* getBrchCurriculumGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        const { optionalConfig } = payload || {};
        if (optionalConfig?.scope) {
            yield put(setBrchCurriculumScopeAct({ data: response.data, optionalConfig }));
        } else {
            yield put(setBrchCurriculumAct(response.data));
        }
    }
}
function* addBrchCurriculumGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setAddBrchCurriculumAct({ statusCode: response.status }));
    }
}
function* updateBrchCurriculumGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setUpdateBrchCurriculumAct(response.data));
    }
}

function* deleteBrchCurriculumGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setDeleteBrchCurriculumAct({ statusCode: response.status }));
    }
}


function* getBrchClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        const { optionalConfig } = payload || {};
        if (optionalConfig?.scope) {
            yield put(setBranchClassScopeAct({ data: response.data, optionalConfig }));
        } else {
            yield put(setBrchClassAct(response.data));
        }
    }
}

function* getCurriculumWiseGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setCurriculumWiseAct(response.data));
    }
}
function* addBrchClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setAddBrchClassAct(response.data));
    }
}
function* updateBrchClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setUpdateBrchClassAct(response.data));
    }
}

function* deleteBrchClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setDeleteBrchClassAct({ statusCode: response.status }));
    }
}

function* getBrchCurriculumClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setBrchCurriculumClassAct(response.data));
    }
}
function* addBrchCurriculumClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setAddBrchCurriculumClassAct({ statusCode: response.status }));
    }
}
function* updateBrchCurriculumClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setUpdateBrchCurriculumClassAct(response.data));
    }
}
function* deleteBrchCurriculumClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setDeleteBrchCurriculumClassAct({ statusCode: response.status }));
    }
}

function* getBrchSectionsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setBrchSectionsAct(response.data));
    }
}
function* addBrchSectionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setAddBrchSectionAct({ statusCode: response.status }));
    }
}
function* updateBrchSectionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setUpdateBrchSectionAct({ statusCode: response.status }));
    }
}

function* deleteBrchSectionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setDeleteBrchSectionAct({ statusCode: response.status }));
    }
}
function* getBrchSectionByClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setBrchSectionByClassAct(response.data));
    }
}


function* getBrchSubjectsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setBrchSubjectsAct(response.data));
    }
}
function* getInstSubjectNameGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setInstSubjectNameAct(response.data));
    }
}
function* addBrchSubjectGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setAddBrchSubjectAct({ statusCode: response.status }));
    }
}
function* updateBrchSubjectGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setUpdateBrchSubjectAct({ statusCode: response.status }));
    }
}

function* deleteBrchSubjectGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setDeleteBrchSubjectAct({ statusCode: response.status }));
    }
}

function* getBrchStreamGroupsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setBrchStreamGroupsAct(response.data));
    }
}
function* addBrchStreamGroupGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setAddBrchStreamGroupAct({ statusCode: response.status }));
    }
}
function* updateBrchStreamGroupGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setUpdateBrchStreamGroupAct(response.data));
    }
}

function* deleteBrchStreamGroupGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setDelBrchStreamGroupAct({ statusCode: response.status }));
    }
}




function* getBrchAcademicClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setBrchAcademicClassesAct(response.data));
    }
}
function* addAcademicDateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(
        postData,
        payload.endpoint,
        payload.payload,
        payload.optionalConfig
    );
    if (response && response.error) {
        yield put(setInstInfoErrorAct(response.error));
    } else {
        yield put(setAddAcademicDateAct({ statusCode: response.status }));
    }
}
function* updateAcademicDateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setUpdateAcademicDateAct({ statusCode: response.status }));
    }
}
function* deleteAcademicDateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(
        deleteData,
        payload.endpoint,
        payload.payload,
        payload.optionalConfig
    );
    if (response && response.error) {
        yield put(setInstInfoErrorAct(response.error));
    } else {
        yield put(setDeleteAcademicDateAct({ statusCode: response.status }));
    }
}


function* getClassWiseTermsDateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setClassWiseTermsDateAct(response.data));
    }
}
function* deleteClassWiseTermsDateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setDeleteClassWiseTermsDateAct({ statusCode: response.status }));
    }
}
function* addClassWiseTermsDateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setAddClassWiseTermsDateAct({ statusCode: response.status }));
    }
}
function* updateClassWiseTermsDateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setUpdateClassWiseTermsDateAct({ statusCode: response.status }));
    }
}

function* getBranchClassWiseTermsIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setClassBranchWiseTermsIdAct(response.data));
    }
}
function* getAcademicLanguagesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setAcademicLanguagesAct(response.data));
    }
}
function* getMastersCurriculumGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setMastersCurriculumAct(response.data));
    }
}
function* getMasterCurriculumClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setBrchAcademicsErrorAct(response.error));
    } else {
        yield put(setMasterCurriculumClassAct(response.data));
    }
}
export default function* brchAcademicsSaga() {
    yield takeLatest(BranchAcademicsConstants.GET_BRANCH_ACADEMIC_YEAR_REQUEST, getBrchAcademicYearGen);
    yield takeLatest(BranchAcademicsConstants.ADD_BRANCH_ACADEMIC_YEAR_REQUEST, addBrchAcademicYearGen);
    yield takeLatest(BranchAcademicsConstants.UPDATE_BRANCH_ACADEMIC_YEAR_REQUEST, updateBrchAcademicYearGen);
    yield takeLatest(BranchAcademicsConstants.DELETE_BRANCH_ACADEMIC_YEAR_REQUEST, deleteBrchAcademicYearGen);

    yield takeLatest(BranchAcademicsConstants.GET_BRANCH_ACADEMIC_TERMS_REQUEST, getBrchAcademicTermGen);
    yield takeLatest(BranchAcademicsConstants.ADD_BRANCH_ACADEMIC_TERMS_REQUEST, addBrchAcademicTermGen);
    yield takeLatest(BranchAcademicsConstants.UPDATE_BRANCH_ACADEMIC_TERMS_REQUEST, updateBrchAcademicTermGen);
    yield takeLatest(BranchAcademicsConstants.DELETE_BRANCH_ACADEMIC_TERMS_REQUEST, deleteBrchAcademicTermGen);

    yield takeLatest(BranchAcademicsConstants.GET_BRANCH_CURRICULUM_REQUEST, getBrchCurriculumGen);
    yield takeLatest(BranchAcademicsConstants.ADD_BRANCH_CURRICULUM_REQUEST, addBrchCurriculumGen);
    yield takeLatest(BranchAcademicsConstants.UPDATE_BRANCH_CURRICULUM_REQUEST, updateBrchCurriculumGen);
    yield takeLatest(BranchAcademicsConstants.DELETE_BRANCH_CURRICULUM_REQUEST, deleteBrchCurriculumGen);

    yield takeLatest(BranchAcademicsConstants.GET_BRANCH_CLASS_REQUEST, getBrchClassGen);
    yield takeLatest(BranchAcademicsConstants.GET_CURRICULUM_WISE_CLASS_REQUEST, getCurriculumWiseGen);
    yield takeLatest(BranchAcademicsConstants.ADD_BRANCH_CLASS_REQUEST, addBrchClassGen);
    yield takeLatest(BranchAcademicsConstants.UPDATE_BRANCH_CLASS_REQUEST, updateBrchClassGen);
    yield takeLatest(BranchAcademicsConstants.DELETE_BRANCH_CLASS_REQUEST, deleteBrchClassGen);

    yield takeLatest(BranchAcademicsConstants.GET_BRANCH_CURRICULUM_CLASS_REQUEST, getBrchCurriculumClassGen);
    yield takeLatest(BranchAcademicsConstants.ADD_BRANCH_CURRICULUM_CLASS_REQUEST, addBrchCurriculumClassGen);
    yield takeLatest(BranchAcademicsConstants.UPDATE_BRANCH_CURRICULUM_CLASS_REQUEST, updateBrchCurriculumClassGen);
    yield takeLatest(BranchAcademicsConstants.DELETE_BRANCH_CURRICULUM_CLASS_REQUEST, deleteBrchCurriculumClassGen);

    yield takeLatest(BranchAcademicsConstants.GET_BRANCH_SECTIONS_REQUEST, getBrchSectionsGen);
    yield takeLatest(BranchAcademicsConstants.ADD_BRANCH_SECTION_REQUEST, addBrchSectionGen);
    yield takeLatest(BranchAcademicsConstants.UPDATE_BRANCH_SECTION_REQUEST, updateBrchSectionGen);
    yield takeLatest(BranchAcademicsConstants.DELETE_BRANCH_SECTION_REQUEST, deleteBrchSectionGen);
    yield takeLatest(BranchAcademicsConstants.GET_BRANCH_SECTION_BYCLASS_REQUEST, getBrchSectionByClassGen);

    yield takeLatest(BranchAcademicsConstants.GET_BRANCH_SUBJECTS_REQUEST, getBrchSubjectsGen);
    yield takeLatest(BranchAcademicsConstants.GET_INST_SUBJECT_NAME, getInstSubjectNameGen);
    yield takeLatest(BranchAcademicsConstants.ADD_BRANCH_SUBJECT_REQUEST, addBrchSubjectGen);
    yield takeLatest(BranchAcademicsConstants.UPDATE_BRANCH_SUBJECT_REQUEST, updateBrchSubjectGen);
    yield takeLatest(BranchAcademicsConstants.DELETE_BRANCH_SUBJECT_REQUEST, deleteBrchSubjectGen);

    yield takeLatest(BranchAcademicsConstants.GET_BRANCH_STREAM_GROUPS_REQUEST, getBrchStreamGroupsGen);
    yield takeLatest(BranchAcademicsConstants.ADD_BRANCH_STREAM_GROUP_REQUEST, addBrchStreamGroupGen);
    yield takeLatest(BranchAcademicsConstants.UPDATE_BRANCH_STREAM_GROUP_REQUEST, updateBrchStreamGroupGen);
    yield takeLatest(BranchAcademicsConstants.DELETE_BRANCH_STREAM_GROUP_REQUEST, deleteBrchStreamGroupGen);

    yield takeLatest(BranchAcademicsConstants.GET_BRANCH_ACADEMIC_CLASSES_REQUEST, getBrchAcademicClassGen);
    yield takeLatest(BranchAcademicsConstants.ADD_ACADEMIC_DATE, addAcademicDateGen);
    yield takeLatest(BranchAcademicsConstants.DELETE_ACADEMIC_DATE, deleteAcademicDateGen);
    yield takeLatest(BranchAcademicsConstants.UPDATE_ACADEMIC_DATE, updateAcademicDateGen);

    yield takeLatest(BranchAcademicsConstants.GET_CLASS_WISE_TERMS_DATE_REQUEST, getClassWiseTermsDateGen);
    yield takeLatest(BranchAcademicsConstants.DELETE_CLASS_WISE_TERMS_DATE_REQUEST, deleteClassWiseTermsDateGen);
    yield takeLatest(BranchAcademicsConstants.ADD_CLASS_WISE_TERMS_DATE_REQUEST, addClassWiseTermsDateGen);
    yield takeLatest(BranchAcademicsConstants.UPDATE_CLASS_WISE_TERMS_DATE_REQUEST, updateClassWiseTermsDateGen);

    yield takeLatest(BranchAcademicsConstants.GET_BRANCH_CLASS_WISE_TERMS_ID_REQUEST, getBranchClassWiseTermsIdGen);
    yield takeLatest(BranchAcademicsConstants.GET_ACADEMIC_LANGUAGES_REQUEST, getAcademicLanguagesGen);
    yield takeLatest(BranchAcademicsConstants.MASTER_CURRICULUM_REQUEST, getMastersCurriculumGen);
    yield takeLatest(BranchAcademicsConstants.MASTER_CURRICULUM_CLASS_REQUEST, getMasterCurriculumClassGen);
}