import axios, { AxiosError, AxiosResponse } from "axios";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { lmsSettingsErrorAct, setAcademicDetailsAct, setAcademicDetailsByIdAct, setAcademicTermDetailsAct, setAcademicTermDetailsByIdAct, setBloomTaxonomyAct, setDeleteAcademicDetailsAct, setDeleteAcademicTermDetailsAct, setDeleteBloomTaxonomyAct, setDeleteDifficultyLevelsAct, setDeleteQuestionNoFormatAct, setDeleteQuestionTypesAct, setDeleteSchoolHolidaysAct, setDeleteSchoolPeriodDetailsAct, setDifficultyLevelsAct, setDifficultyLevelsByIdAct, setGetDigitalCurriculumRulesAct, setGetDigitalCurriculumValidationAct, setQuestionNoFormatAct, setQuestionTypesAct, setQuestionTypesByIdAct, setSaveAcademicDetailsAct, setSaveAcademicTermDetailsAct, setSaveBloomTaxonomyAct, setSaveDifficultyLevelsAct, setSaveDigitalCurriculumRulesAct, setSaveDigitalCurriculumValidationAct, setSaveQuestionNoFormatAct, setSaveQuestionTypesAct, setSaveSchoolHolidaysAct, setSaveSchoolPeriodDetailsAct, setSchoolHolidaysAct, setSchoolHolidaysByIdAct, setSchoolPeriodDetailsAct, setSchoolPeriodDetailsByIdAct, setUpdateBloomTaxonomyAct, setUpdateDifficultyLevelsAct, setUpdateQuestionNoFormatAct, setUpdateQuestionTypesAct } from "./lmssettingsslice";
import { lmsSettingsConstants } from "./lmssettingsconstants";

//Lms Settings

function* getQuestionNoFormatGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setQuestionNoFormatAct(response.data));
    }
}
function* saveQuestionNoFormatGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setSaveQuestionNoFormatAct({statusCode : response.status}));
    }
}
function* updateQuestionNoFormatGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateQuestionNoFormatAct({statusCode : response.status}));
    }
}
function* deleteQuestionNoFormatGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteQuestionNoFormatAct({statusCode : response.status}));
    }
}
function* getQuestionTypesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setQuestionTypesAct(response.data));
    }
}
export function* getQuestionTypesByIdGen(action: ICreatedActionType): any {
            const { payload } = action;
            const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
            if (response && response.error) {
                yield put(lmsSettingsErrorAct(response.error));
            } else {
                yield put(setQuestionTypesByIdAct(response.data));
            }
    }
    
    export function* saveQuestionTypesGen(action: ICreatedActionType): any {
            const { payload } = action;
            const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
            if (response && response.error) {
                yield put(lmsSettingsErrorAct(response.error));
            } else {
                yield put(setSaveQuestionTypesAct({status: response.status}));
            }
    }
    
    export function* updateQuestionTypesGen(action: ICreatedActionType): any {
            const { payload } = action;
            const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
            if (response && response.error) {
                yield put(lmsSettingsErrorAct(response.error));
            } else {
                yield put(setUpdateQuestionTypesAct({statusCode : response.status}));
            }
    }
    
    export function* deleteQuestionTypesGen(action: ICreatedActionType): any {
            const { payload } = action;
            const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
            if (response && response.error) {
                yield put(lmsSettingsErrorAct(response.error));
            } else {
                yield put(setDeleteQuestionTypesAct({status : response.statusCode}));
            }
        }

function* getDifficultyLevelsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setDifficultyLevelsAct(response.data));
    }
}
export function* getDifficultyLevelsByIdGen(action: ICreatedActionType): any {
            const { payload } = action;
            const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
            if (response && response.error) {
                yield put(lmsSettingsErrorAct(response.error));
            } else {
                yield put(setDifficultyLevelsByIdAct(response.data));
            }
    }
    
    export function* saveDifficultyLevelsGen(action: ICreatedActionType): any {
            const { payload } = action;
            const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
            if (response && response.error) {
                yield put(lmsSettingsErrorAct(response.error));
            } else {
                yield put(setSaveDifficultyLevelsAct({status: response.status}));
            }
    }
    
    export function* updateDifficultyLevelsGen(action: ICreatedActionType): any {
            const { payload } = action;
            const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
            if (response && response.error) {
                yield put(lmsSettingsErrorAct(response.error));
            } else {
                yield put(setUpdateDifficultyLevelsAct({statusCode : response.status}));
            }
    }
    
    export function* deleteDifficultyLevelsGen(action: ICreatedActionType): any {
            const { payload } = action;
            const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
            if (response && response.error) {
                yield put(lmsSettingsErrorAct(response.error));
            } else {
                yield put(setDeleteDifficultyLevelsAct({status : response.statusCode}));
            }
        }

function* getBloomTaxonomyGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setBloomTaxonomyAct(response.data));
    }
}
function* saveBloomTaxonomyGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setSaveBloomTaxonomyAct({statusCode : response.status}));
    }
}
function* updateBloomTaxonomyGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setUpdateBloomTaxonomyAct({statusCode : response.status}));
    }
}
function* deleteBloomTaxonomyGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteBloomTaxonomyAct({statusCode : response.status}));
    }
}

//Academic Details
function* getAcademicDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setAcademicDetailsAct(response.data));
    }
}
function* getAcademicDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setAcademicDetailsByIdAct(response.data));
    }
}
function* saveAcademicDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setSaveAcademicDetailsAct({ statusCode: response.status }));
    }
}
function* deleteAcademicDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteAcademicDetailsAct({ statusCode: response.status }));
    }
}

//Academic Term Details
function* getAcademicTermDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setAcademicTermDetailsAct(response.data));
    }
}
function* getAcademicTermDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setAcademicTermDetailsByIdAct(response.data));
    }
}
function* saveAcademicTermDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setSaveAcademicTermDetailsAct({ statusCode: response.status }));
    }
}
function* deleteAcademicTermDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteAcademicTermDetailsAct({ statusCode: response.status }));
    }
}

//School Period Details
function* getSchoolPeriodDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setSchoolPeriodDetailsAct(response.data));
    }
}
function* getSchoolPeriodDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setSchoolPeriodDetailsByIdAct(response.data));
    }
}
function* saveSchoolPeriodDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setSaveSchoolPeriodDetailsAct({ statusCode: response.status }));
    }
}
function* deleteSchoolPeriodDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteSchoolPeriodDetailsAct({ statusCode: response.status }));
    }
}

//School Holidays
function* getSchoolHolidaysGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setSchoolHolidaysAct(response.data));
    }
}
function* getSchoolHolidaysByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setSchoolHolidaysByIdAct(response.data));
    }
}
function* saveSchoolHolidaysGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setSaveSchoolHolidaysAct({ statusCode: response.status }));
    }
}
function* deleteSchoolHolidaysGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setDeleteSchoolHolidaysAct({ statusCode: response.status }));
    }
}

//Digital Curriculum Validation's
function* getDigitalCurriculumValidationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setGetDigitalCurriculumValidationAct(response.data));
    }
}
function* saveDigitalCurriculumValidationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setSaveDigitalCurriculumValidationAct({ statusCode: response.status }));
    }
}

//Digital Curriculum Rules's
function* getDigitalCurriculumRulesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setGetDigitalCurriculumRulesAct(response.data));
    }
}
function* saveDigitalCurriculumRulesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(lmsSettingsErrorAct(response.error));
    } else {
        yield put(setSaveDigitalCurriculumRulesAct({ statusCode: response.status }));
    }
}

export default function* examinationSettingsSaga() {
    
    //Lms Settings
    yield takeLatest(lmsSettingsConstants.GET_QUESTION_NO_FORMAT, getQuestionNoFormatGen);
    yield takeLatest(lmsSettingsConstants.SAVE_QUESTION_NO_FORMAT, saveQuestionNoFormatGen);
    yield takeLatest(lmsSettingsConstants.UPDATE_QUESTION_NO_FORMAT, updateQuestionNoFormatGen);
    yield takeLatest(lmsSettingsConstants.DELETE_QUESTION_NO_FORMAT, deleteQuestionNoFormatGen);

    yield takeLatest(lmsSettingsConstants.GET_QUESTION_TYPES, getQuestionTypesGen);
    yield takeLatest(lmsSettingsConstants.SAVE_QUESTION_TYPES, saveQuestionTypesGen);
    yield takeLatest(lmsSettingsConstants.GET_QUESTION_TYPES_BY_ID, getQuestionTypesByIdGen);
    yield takeLatest(lmsSettingsConstants.UPDATE_QUESTION_TYPES, updateQuestionTypesGen);
    yield takeLatest(lmsSettingsConstants.DELETE_QUESTION_TYPES, deleteQuestionTypesGen);

    yield takeLatest(lmsSettingsConstants.GET_DIFFICULTY_LEVELS, getDifficultyLevelsGen);
    yield takeLatest(lmsSettingsConstants.SAVE_DIFFICULTY_LEVELS, saveDifficultyLevelsGen);
    yield takeLatest(lmsSettingsConstants.GET_DIFFICULTY_LEVELS_BY_ID, getDifficultyLevelsByIdGen);
    yield takeLatest(lmsSettingsConstants.UPDATE_DIFFICULTY_LEVELS, updateDifficultyLevelsGen);
    yield takeLatest(lmsSettingsConstants.DELETE_DIFFICULTY_LEVELS, deleteDifficultyLevelsGen);
    
    yield takeLatest(lmsSettingsConstants.GET_BLOOM_TAXONOMY, getBloomTaxonomyGen);
    yield takeLatest(lmsSettingsConstants.SAVE_BLOOM_TAXONOMY, saveBloomTaxonomyGen);
    yield takeLatest(lmsSettingsConstants.UPDATE_BLOOM_TAXONOMY, updateBloomTaxonomyGen);
    yield takeLatest(lmsSettingsConstants.DELETE_BLOOM_TAXONOMY, deleteBloomTaxonomyGen);
    
    //Academic Details
    yield takeLatest(lmsSettingsConstants.GET_ACADEMIC_DETAILS_LIST, getAcademicDetailsGen);
    yield takeLatest(lmsSettingsConstants.SAVE_ACADEMIC_DETAILS, saveAcademicDetailsGen);
    yield takeLatest(lmsSettingsConstants.GET_ACADEMIC_DETAILS_BY_ID, getAcademicDetailsByIdGen);
    yield takeLatest(lmsSettingsConstants.DELETE_ACADEMIC_DETAILS, deleteAcademicDetailsGen);
    
    //Academic Term Details
    yield takeLatest(lmsSettingsConstants.GET_ACADEMIC_TERM_DETAILS_LIST, getAcademicTermDetailsGen);
    yield takeLatest(lmsSettingsConstants.GET_ACADEMIC_TERM_DETAILS_BY_ID, getAcademicTermDetailsByIdGen);
    yield takeLatest(lmsSettingsConstants.SAVE_ACADEMIC_TERM_DETAILS, saveAcademicTermDetailsGen);
    yield takeLatest(lmsSettingsConstants.DELETE_ACADEMIC_TERM_DETAILS, deleteAcademicTermDetailsGen);
    
    //School Period Details
    yield takeLatest(lmsSettingsConstants.GET_SCHOOL_PERIOD_DETAILS_LIST, getSchoolPeriodDetailsGen);
    yield takeLatest(lmsSettingsConstants.SAVE_SCHOOL_PERIOD_DETAILS, saveSchoolPeriodDetailsGen);
    yield takeLatest(lmsSettingsConstants.GET_SCHOOL_PERIOD_DETAILS_BY_ID, getSchoolPeriodDetailsByIdGen);
    yield takeLatest(lmsSettingsConstants.DELETE_SCHOOL_PERIOD_DETAILS, deleteSchoolPeriodDetailsGen);
    
    //School Holidays
    yield takeLatest(lmsSettingsConstants.GET_SCHOOL_HOLIDAYS_LIST, getSchoolHolidaysGen);
    yield takeLatest(lmsSettingsConstants.SAVE_SCHOOL_HOLIDAYS, saveSchoolHolidaysGen);
    yield takeLatest(lmsSettingsConstants.GET_SCHOOL_HOLIDAYS_BY_ID, getSchoolHolidaysByIdGen);
    yield takeLatest(lmsSettingsConstants.DELETE_SCHOOL_HOLIDAYS, deleteSchoolHolidaysGen);

    //Digital Curriculum Validation's
    yield takeLatest(lmsSettingsConstants.GET_DIGITAL_CURRICULUM_VALIDATION_LIST, getDigitalCurriculumValidationGen);
    yield takeLatest(lmsSettingsConstants.SAVE_DIGITAL_CURRICULUM_VALIDATION, saveDigitalCurriculumValidationGen);

    //Digital Curriculum Rules's
    yield takeLatest(lmsSettingsConstants.GET_DIGITAL_CURRICULUM_RULES_LIST, getDigitalCurriculumRulesGen);
    yield takeLatest(lmsSettingsConstants.SAVE_DIGITAL_CURRICULUM_RULES, saveDigitalCurriculumRulesGen);

}