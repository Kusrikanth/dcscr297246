import axios, { AxiosError, AxiosResponse } from "axios";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import {
    setSaveCbseExaminationListAct, setCbseExaminationErrorAct, setCbseExaminationListAct, setCbseExaminationListByIdAct, setEditCbseExaminationListAct, setDelCbseExaminationListAct, setDelCbseWeightageListAct, setEditCbseWeightageListAct, setSaveCbseWeightageListAct, setCbseWeightageListByIdAct, setCbseWeightageListAct, setDelCbseExaminationSubjectsListAct, setEditCbseExaminationSubjectsListAct, setSaveCbseExaminationSubjectsListAct, setCbseExaminationSubjectsListByIdAct, setCbseExaminationSubjectsListAct, setDelCbseExaminationCoscholasticGradesListAct, setEditCbseExaminationCoscholasticGradesListAct, setSaveCbseExaminationCoscholasticGradesListAct, setCbseExaminationCoscholasticGradesListByIdAct, setCbseExaminationCoscholasticGradesListAct, setSubjectsListAct,
    setCbseExaminationOverAllGradesAct,
    setCbseExaminationOverAllGradesByIdAct,
    setSaveCbseExaminationOverAllGradesByIdAct,
    setEditCbseExaminationOverAllGradesByIdAct,
    setDeleteCbseExaminationOverAllGradesByIdAct,
    setCopyCbseExaminationOverAllGradesAct,
    setExaminationTermListAct,
    setCoscholasticSubjectsListAct,
    setDeleteCbseExaminationMarksByIdAct,
    setEditCbseExaminationMarksByIdAct,
    setSaveCbseExaminationMarksByIdAct,
    setCbseExaminationMarksByIdAct,
    setCbseExaminationMarksAct, setCbseExamiantionMultipleExamMarksAct,
    setSaveCbseExamiantionMultipleExamMarksAct,
    setEditCbseExamiantionMultipleExamMarksByIdAct,
    setDeleteCbseExamiantionMultipleExamMarksByIdAct,
    setCbseExamiantionMultipleExamMarksByIdAct,
    setSkillEntryListAct,
    setSubjectListAct,
    setAoMappingSubjectAct,
    setSaveAoMappingSubjectAct,
    setDeleteAoMappingSubjectAct,
    setUpdateAoMappingSubjectAct,
    setAoMappingSubjectByIdAct,
    setCopyCbseExaminationCoscholasticGradesAct,
    setChangeDisplayOrderExamAct,
    setSaveSkillEntryAct,
    setDeleteSkillEntryAct,
    setSkillEntryByIdAct,
    setUpdateSkillEntryAct,
    setExamCategoryAct,
    setSignatureListAct,
    setSaveSignatureAct,
    setUpdateSignatureAct,
    setDeleteSignatureAct,
    setIgseTermNameListAct,
    setSaveIgseTermNameAct,
    setIgseTermDetailsListAct,
    setCbseInternalSubjectsGradesListResp,
    setCbseInternalSubjectsGradesListByIdResp,
    setSaveCbseInternalSubjectsGradesListResp,
    setEditCbseInternalSubjectsGradesListResp,
    setDeleteCbseInternalSubjectsGradesListResp,
    setCopyCbseInternalSubjectsGradesListResp,
    setIgseTermNameByIdAct,
    setUpdateIgseTermNameByIdAct,
    setDeleteIgseTermNameByIdAct,
    setIgseTermDetailsByIdAct,
    setSaveIgseTermDetailsAct,
    setUpdateIgseTermDetailsByIdAct,
    setDeleteIgseTermDetailsByIdAct,
    setExaminationListAct,
    setModelSubjectListAct,
    setPercentageSlabsListAct,
    setSavePercentageSlabsListAct,
    setEditPercentageSlabsListAct,
    setDeletePercentageSlabsListAct,
    setAreaofStrengthFocusListAct,
    setAreaofStrengthFocusByIdAct,
    setSaveAreaofStrengthFocusAct,
    setUpdateAreaofStrengthFocusAct,
    setChangeDisplayOrderExaminationSubjectsListAct,
    setHolisticDomainAct,
    setSaveHolisticDomainAct,
    setHolisticActivityAct,
    setSaveHolisticActivityAct,
    setUpdateHolisticDomainAct,
    setUpdateHolisticActivityAct,
    setSaveDomainOrderAct,
    setHolisticDomainModelAct,
    setHolisticDomainActivityAct,
    setSaveHolisticDomainActivityAct,
    setDeleteHolisticDomainActivityAct,
    setHolisticCurriculumGoalsAct,
    setSaveHolisticCurriculumGoalsAct,
    setUpdateHolisticCurriculumGoalsAct,
    setDeleteHolisticDomainAct,
    setDeleteHolisticActivityAct,
    setClassInstituteIdAct,
    setActivityBranchAct,
    setActivityClassAct,
    setActivityByIdAct,
    setInstituteClassAct,
    setClassesByStageAct,

    setReportCardSettingsAct,
    setReportCardConfigAct,
    setSaveReportCardSettingsAct,
    setDeleteReportCardSettingsAct,
    setPreparatoryDomainAct,
    setSavePreparatoryDomainAct,
    setUpdatePreparatoryDomainAct,
    setSavePreparatoryDomainOrderAct,
    setDeletePreparatoryDomainAct,
    setPreparatoryCurriculumGoalsAct,
    setSavePreparatoryCurriculumGoalsAct,
    setUpdatePreparatoryCurriculumGoalsAct,
    setPreparatoryDomainModelAct,
    setPreparatoryGradeEntryListAct,
    setSavePreparatoryGradeEntryListAct,
    setPreparatoryGradeEntryListByIdAct,
    setUpdatePreparatoryGradeEntryListAct,
    setSavePreparatoryStudentSurroundingAct,
    setSavePreparatoryStudentFeedbackAct,
    setSavePreparatoryParentFeedbackAct,
    setPreparatoryActivityAct,
    setSavePreparatoryActivityAct,
    setUpdatePreparatoryActivityAct,
    setDeletePreparatoryActivityAct,
    setPreparatoryActivityByIdAct,
    setPreparatoryDomainStudentsAct,
    setSavePreparatoryDomainStudentsAct,
    setUpdatePreparatoryDomainStudentsAct,
    setPreparatorySummaryByIdAct,
    setSavePreparatorySummaryAct,
    setPreparatoryStatusAct,
    setSavePrepartoryParentCollectionAct,
    setExportPreparatoryGradeEntryListAct,
    setCopyHolisticActivityAct,
    setCopyPreparatoryActivityAct,
    setCbseExaminationSubjectOrderAct,
    setCBSEAllSubjectsOrderAct,
    setSaveCbseExaminationSubjectOrderAct,
    setUpdateCbseExaminationSubjectOrderAct,
    setSkillAttributeSettingsListAct,
    setSkillAttributeSettingsItemByIdAct,
    setSaveSkillAttributeSettingsItemAct,
    setUpdateSkillAttributeSettingsItemAct,
    setDeleteSkillAttributeSettingsItemAct,
    setSaveSetSkillOrderAct,
    setSaveSetSkillAttributeOrderAct,
    setSaveOverallGradeColorAct,
    setOverallGradeColorListAct,
    setCopyPreparatoryGradeEntryStudentDetailsAct,
    setCopyIgseTermNameListAct,
    setCopyClassesByStageAct,
} from "./examinationsettingsslice";
import { ExaminationSettingsConstants } from "./examinationsettingsconstants";

//Cbse Settings

// Examination-Tab
function* getCbseExaminationListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExaminationListAct(response.data));
    }
}

function* getExaminationTermListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setExaminationTermListAct(response.data));
    }
}
function* getCbseExaminationSubjectOrderGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExaminationSubjectOrderAct(response.data));
    }
}
function* getCBSEAllSubjectsOrderGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCBSEAllSubjectsOrderAct(response.data));
    }
}
function* saveCbseExaminationSubjectOrderGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveCbseExaminationSubjectOrderAct({ statusCode: response.status }));
    }
}
function* updateCbseExaminationSubjectOrderGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdateCbseExaminationSubjectOrderAct({ statusCode: response.status }));
    }
}

function* getCbseExaminationListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExaminationListByIdAct(response.data));
    }
}

function* saveCbseExaminationListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveCbseExaminationListAct({ statusCode: response.status }));
    }
}

function* editCbseExaminationListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setEditCbseExaminationListAct({ statusCode: response.status }));
    }
}

function* deleteCbseExaminationListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDelCbseExaminationListAct({ status: response.statusCode }));
    }
}

function* changeDisplayOrderExamGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setChangeDisplayOrderExamAct({ statusCode: response.status }));
    }
}

function* getExamCategoryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setExamCategoryAct(response.data));
    }
}

// Examination-Weightage
function* getCbseWeightageListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseWeightageListAct(response.data));
    }
}

function* getCbseWeightageListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseWeightageListByIdAct(response.data));
    }
}

function* saveCbseWeightageListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveCbseWeightageListAct({ statusCode: response.status }));
    }
}

function* editCbseWeightageListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setEditCbseWeightageListAct({ statusCode: response.status }));
    }
}

function* deleteCbseWeightageListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDelCbseWeightageListAct({ status: response.statusCode }));
    }
}

// Examination-Subjects
function* getCbseExaminationSubjectsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExaminationSubjectsListAct(response.data));
    }
}

function* changeDisplayOrderExaminationSubjectsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setChangeDisplayOrderExaminationSubjectsListAct({ statusCode: response.status }));
    }
}

function* getSubjectsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSubjectsListAct(response.data));
    }
}

function* getCbseExaminationSubjectsListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExaminationSubjectsListByIdAct(response.data));
    }
}

function* saveCbseExaminationSubjectsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveCbseExaminationSubjectsListAct({ statusCode: response.status }));
    }
}

function* editCbseExaminationSubjectsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setEditCbseExaminationSubjectsListAct({ statusCode: response.status }));
    }
}

function* deleteCbseExaminationSubjectsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDelCbseExaminationSubjectsListAct({ status: response.statusCode }));
    }
}

// Examination-Coscholastic-Grades
function* getCbseExaminationCoscholasticGradesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExaminationCoscholasticGradesListAct(response.data));
    }
}

function* getCoscholasticSubjectsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCoscholasticSubjectsListAct(response.data));
    }
}

function* getCbseExaminationCoscholasticGradesListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExaminationCoscholasticGradesListByIdAct(response.data));
    }
}

function* saveCbseExaminationCoscholasticGradesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveCbseExaminationCoscholasticGradesListAct({ statusCode: response.status }));
    }
}

function* editCbseExaminationCoscholasticGradesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setEditCbseExaminationCoscholasticGradesListAct({ statusCode: response.status }));
    }
}

function* deleteCbseExaminationCoscholasticGradesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDelCbseExaminationCoscholasticGradesListAct({ status: response.statusCode }));
    }
}

export function* copyCbseExaminationCoscholasticGradesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCopyCbseExaminationCoscholasticGradesAct({ status: response.statusCode }));
    }
}
//Add multiple exam marks
function* getCbseMultipleExamMarksGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExamiantionMultipleExamMarksAct(response.data));
    }
}

function* getCbseMultipleExamMarksByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExamiantionMultipleExamMarksByIdAct(response.data));
    }
}

function* saveCbseMultipleExamMarksGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveCbseExamiantionMultipleExamMarksAct({ status: response.statusCode }));
    }
}

function* editCbseMultipleExamMarksGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setEditCbseExamiantionMultipleExamMarksByIdAct({ statusCode: response.status }));
    }
}

function* deleteCbseMultipleExamMarksGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteCbseExamiantionMultipleExamMarksByIdAct({ status: response.statusCode }));
    }
}


//OverAllGrades
export function* getCbseExaminationOverAllGradesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExaminationOverAllGradesAct(response.data));
    }
}

export function* getCbseExaminationOverAllGradesByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExaminationOverAllGradesByIdAct(response.data));
    }
}

export function* saveCbseExaminationOverAllGradesByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveCbseExaminationOverAllGradesByIdAct({ status: response.status }));
    }
}

export function* editCbseExaminationOverAllGradesByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setEditCbseExaminationOverAllGradesByIdAct({ statusCode: response.status }));
    }
}

export function* deleteCbseExaminationOverAllGradesByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteCbseExaminationOverAllGradesByIdAct({ status: response.statusCode }));
    }
}

export function* copyCbseExaminationOverAllGradesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCopyCbseExaminationOverAllGradesAct({ statusCode: response.status }));
    }
}
export function* getOverallGradeColorListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setOverallGradeColorListAct(response.data));
    }
}
export function* saveOverallGradeColorGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveOverallGradeColorAct({ status: response.status }));
    }
}

//Examination-Marks
export function* getCbseExaminationMarksGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExaminationMarksAct(response.data));
    }
}

export function* getCbseExaminationMarksByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseExaminationMarksByIdAct(response.data));
    }
}

export function* saveCbseExaminationMarksByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveCbseExaminationMarksByIdAct({ status: response.status }));
    }
}

export function* editCbseExaminationMarksByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setEditCbseExaminationMarksByIdAct({ statusCode: response.status }));
    }
}

export function* deleteCbseExaminationMarksByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteCbseExaminationMarksByIdAct({ status: response.statusCode }));
    }
}

//Skill Entry
export function* getSkillEntryListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSkillEntryListAct(response.data));
    }
}

function* saveSkillEntryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveSkillEntryAct({ status: response.status }));
    }
}
function* deleteSkillEntryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteSkillEntryAct({ status: response.status }));
    }
}
function* getSkillEntryByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSkillEntryByIdAct(response.data));
    }
}
function* updateSkillEntryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdateSkillEntryAct({ status: response.status }));
    }
}

//Ao Mapping
export function* getSubjectListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSubjectListAct(response.data));
    }
}
export function* getModelSubjectListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setModelSubjectListAct(response.data));
    }
}
export function* getAoMappingSubjectGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setAoMappingSubjectAct(response.data));
    }
}
function* saveAoMappingSubjectGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveAoMappingSubjectAct({ status: response.status }));
    }
}
function* deleteAoMappingSubjectGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteAoMappingSubjectAct({ status: response.status }));
    }
}
function* updateAoMappingSubjectGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdateAoMappingSubjectAct({ status: response.status }));
    }
}
function* getAoMappingSubjectByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setAoMappingSubjectByIdAct(response.data));
    }
}

//signature
function* getSignatureListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSignatureListAct(response.data));
    }
}
function* saveSignatureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveSignatureAct({ status: response.status }));
    }
}
function* updateSignatureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdateSignatureAct({ status: response.status }));
    }
}
function* deleteSignatureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteSignatureAct({ status: response.status }));
    }
}

// Internal Subject Grades

function* getCbseInternalSubjectsGradesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseInternalSubjectsGradesListResp(response.data));
    }
}

function* getCbseInternalSubjectsGradesListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCbseInternalSubjectsGradesListByIdResp(response.data));
    }
}
function* saveCbseInternalSubjectsGradesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveCbseInternalSubjectsGradesListResp({ statusCode: response.status }));
    }
}
function* editCbseInternalSubjectsGradesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setEditCbseInternalSubjectsGradesListResp({ statusCode: response.status }));
    }
}
function* deleteCbseInternalSubjectsGradesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteCbseInternalSubjectsGradesListResp(response.data));
    }
}
function* copyCbseInternalSubjectsGradesListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCopyCbseInternalSubjectsGradesListResp(response.data));
    }
}

// IGSE Settings
//Term Name 
export function* getIgseTermNameListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setIgseTermNameListAct(response.data));
    }
}
export function* getCopyIgseTermNameListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCopyIgseTermNameListAct(response.data));
    }
}
export function* saveIgseTermNameGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveIgseTermNameAct({ status: response.status }));
    }
}

export function* getIgseTermNameByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setIgseTermNameByIdAct(response.data));
    }
}

export function* updateIgseTermNameByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdateIgseTermNameByIdAct({ statusCode: response.status }));
    }
}

export function* deleteIgseTermNameByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteIgseTermNameByIdAct({ status: response.statusCode }));
    }
}
//Term Details
export function* getIgseTermDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setIgseTermDetailsListAct(response.data));
    }
}

export function* getIgseTermDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setIgseTermDetailsByIdAct(response.data));
    }
}

export function* saveIgseTermDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveIgseTermDetailsAct({ status: response.status }));
    }
}

export function* updateIgseTermDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdateIgseTermDetailsByIdAct({ statusCode: response.status }));
    }
}

export function* deleteIgseTermDetailsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteIgseTermDetailsByIdAct({ status: response.statusCode }));
    }
}


export function* getExaminationListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setExaminationListAct(response.data));
    }
}
export function* getPercentageSlabsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setPercentageSlabsListAct(response.data));
    }
}
export function* savePercentageSlabsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSavePercentageSlabsListAct({ status: response.status }));
    }
}
export function* editPercentageSlabsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setEditPercentageSlabsListAct({ status: response.status }));
    }
}
export function* deletePercentageSlabsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeletePercentageSlabsListAct({ status: response.status }));
    }
}

//Area of Strength Focus
export function* getAreaofStrengthFocusListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setAreaofStrengthFocusListAct(response.data));
    }
}

export function* getAreaofStrengthFocusByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setAreaofStrengthFocusByIdAct(response.data));
    }
}

export function* saveAreaofStrengthFocusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveAreaofStrengthFocusAct({ status: response.status }));
    }
}

export function* updateAreaofStrengthFocusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdateAreaofStrengthFocusAct({ statusCode: response.status }));
    }
}

// holistics Domain
export function* getHolisticDomainGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setHolisticDomainAct(response.data));
    }
}
export function* getHolisticDomainModelGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setHolisticDomainModelAct(response.data));
    }
}
export function* saveHolisticDomainGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveHolisticDomainAct({ status: response.status }));
    }
}
export function* updateHolisticDomainGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdateHolisticDomainAct({ status: response.status }));
    }
}
export function* saveDomainOrderGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveDomainOrderAct({ status: response.status }));
    }
}
export function* deleteHolisticDomainGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteHolisticDomainAct({ status: response.status }));
    }
}

// holistics Activity
export function* getHolisticActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setHolisticActivityAct(response.data));
    }
}
export function* getClassInstituteIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setClassInstituteIdAct(response.data));
    }
}
export function* getActivityBranchGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setActivityBranchAct(response.data));
    }
}
export function* getActivityClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setActivityClassAct(response.data));
    }
}
export function* getInstituteClassGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setInstituteClassAct(response.data));
    }
}
export function* getClassesByStageGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setClassesByStageAct(response.data));
    }
}
export function* getCopyClassesByStageGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCopyClassesByStageAct(response.data));
    }
}
export function* saveHolisticActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveHolisticActivityAct({ status: response.status }));
    }
}
export function* updateHolisticActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdateHolisticActivityAct({ status: response.status }));
    }
}
export function* deleteHolisticActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteHolisticActivityAct({ status: response.status }));
    }
}

// holistics domain activity
export function* getActivityByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setActivityByIdAct(response.data));
    }
}
export function* getHolisticDomainActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setHolisticDomainActivityAct(response.data));
    }
}
export function* saveDomainActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveHolisticDomainActivityAct({ status: response.status }));
    }
}
export function* deleteHolisticDomainActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteHolisticDomainActivityAct({ status: response.status }));
    }
}
export function* getHolisticCurriculumGoalsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setHolisticCurriculumGoalsAct(response.data));
    }
}
export function* saveHolisticCurriculumGoalsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveHolisticCurriculumGoalsAct({ status: response.status }));
    }
}
export function* updateHolisticCurriculumGoalsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdateHolisticCurriculumGoalsAct({ status: response.status }));
    }
}
export function* copyHolisticActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCopyHolisticActivityAct({ status: response.status }));
    }
}
export function* copyPreparatoryActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCopyPreparatoryActivityAct({ status: response.status }));
    }
}

export function* getReportCardSettingsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setReportCardSettingsAct(response.data));
    }
}

export function* getReportCardConfigGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setReportCardConfigAct(response.data));
    }
}

export function* saveReportCardSettingsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveReportCardSettingsAct(response.data));
    }
}

export function* deleteReportCardSettingsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteReportCardSettingsAct({ status: response.status }));
    }
}

// -----Preparatory-----

//Preparatory domain
export function* getPreparatoryDomainGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setPreparatoryDomainAct(response.data));
    }
}
export function* getPreparatoryDomainModelGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setPreparatoryDomainModelAct(response.data));
    }
}
export function* savePreparatoryDomainGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSavePreparatoryDomainAct({ status: response.status }));
    }
}
export function* updatePreparatoryDomainGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdatePreparatoryDomainAct({ status: response.status }));
    }
}
export function* savePreparatoryDomainOrderGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSavePreparatoryDomainOrderAct({ status: response.status }));
    }
}
export function* deletePreparatoryDomainGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeletePreparatoryDomainAct({ status: response.status }));
    }
}

//preparatory Curriculum Goals
export function* getPreparatoryCurriculumGoalsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setPreparatoryCurriculumGoalsAct(response.data));
    }
}
export function* savePreparatoryCurriculumGoalsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSavePreparatoryCurriculumGoalsAct({ status: response.status }));
    }
}
export function* updatePreparatoryCurriculumGoalsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdatePreparatoryCurriculumGoalsAct({ status: response.status }));
    }
}

//preparatory grade entry
export function* getPreparatoryGradeEntryListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setPreparatoryGradeEntryListAct(response.data));
    }
}
export function* savePreparatoryGradeEntryListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSavePreparatoryGradeEntryListAct({ status: response.status, data: response.data }));
    }
}
export function* getPreparatoryGradeEntryListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setPreparatoryGradeEntryListByIdAct(response.data));
    }
}
export function* updatePreparatoryGradeEntryListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdatePreparatoryGradeEntryListAct({ status: response.status, data: response.data }));
    }
}
export function* savePreparatoryStudentSurroundingGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSavePreparatoryStudentSurroundingAct({ status: response.status, data: response.data }));
    }
}
export function* savePreparatoryStudentFeedbackGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSavePreparatoryStudentFeedbackAct({ status: response.status, data: response.data }));
    }
}
export function* savePreparatoryParentFeedbackGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSavePreparatoryParentFeedbackAct({ status: response.status, data: response.data }));
    }
}

//preparatory activity
export function* getPreparatoryActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setPreparatoryActivityAct(response.data));
    }
}
export function* savePreparatoryActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSavePreparatoryActivityAct({ status: response.status, data: response.data }));
    }
}
export function* updatePreparatoryActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdatePreparatoryActivityAct({ status: response.status, data: response.data }));
    }
}
export function* deletePreparatoryActivityGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeletePreparatoryActivityAct({ status: response.status, data: response.data }));
    }
}
export function* getPreparatoryActivityByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setPreparatoryActivityByIdAct(response.data));
    }
}
export function* getPreparatoryDomainStudentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setPreparatoryDomainStudentsAct(response.data));
    }
}
export function* savePreparatoryDomainStudentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSavePreparatoryDomainStudentsAct({ status: response.status, data: response.data }));
    }
}
export function* updatePreparatoryDomainStudentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdatePreparatoryDomainStudentsAct({ status: response.status, data: response.data }));
    }
}
export function* getPreparatorySummaryByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setPreparatorySummaryByIdAct(response.data));
    }
}
export function* savePreparatorySummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSavePreparatorySummaryAct({ status: response.status, data: response.data }));
    }
}
export function* getPreparatoryStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setPreparatoryStatusAct(response.data));
    }
}
export function* exportPreparatoryGradeEntryListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setExportPreparatoryGradeEntryListAct(response.data));
    }
}
export function* copyPreparatoryGradeEntryStudentDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setCopyPreparatoryGradeEntryStudentDetailsAct({ status: response.status }));
    }

}
export function* savePrepartoryParentCollectionGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSavePrepartoryParentCollectionAct({ status: response.status, data: response.data }));
    }
}

// IGSE Skill Attribute Settings
export function* getSkillAttributeSettingsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if(response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSkillAttributeSettingsListAct(response.data));
    }
}

export function* getSkillAttributeSettginsItemByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if(response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSkillAttributeSettingsItemByIdAct(response.data));
    }
}

export function* saveSkillAttributeSettingsItemGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if(response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setSaveSkillAttributeSettingsItemAct({ status: response.status,data: response.data }));
    }
}

export function* updateSkillAttributeSettingsItemGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if(response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setUpdateSkillAttributeSettingsItemAct({ status: response.status,data: response.data }));
    }
}

export function* deleteSkillAttributeSettingsItemGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if(response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    } else {
        yield put(setDeleteSkillAttributeSettingsItemAct({ status: response.status}));
    }
}
export function* saveSetSkillOrderGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if(response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    }
    else {
        yield put(setSaveSetSkillOrderAct({ status: response.status,data: response.data }));
    }
}

export function* saveSetSkillAttributeOrderGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if(response && response.error) {
        yield put(setCbseExaminationErrorAct(response.error));
    }
    else {
        yield put(setSaveSetSkillAttributeOrderAct({ status: response.status }));
    }
}

export default function* examinationSettingsSaga() {
    //Cbse Settings

    // Examination-Tab
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_LIST, getCbseExaminationListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_SUBJECTS_ORDER, getCbseExaminationSubjectOrderGen);
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_ALL_SUBJECTS_ORDER, getCBSEAllSubjectsOrderGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_SUBJECT_ORDER, saveCbseExaminationSubjectOrderGen);
    yield takeLatest(ExaminationSettingsConstants.UPDATE_CBSE_EXAMINATION_SUBJECT_ORDER, updateCbseExaminationSubjectOrderGen);
    yield takeLatest(ExaminationSettingsConstants.GET_EXAMINATION_TERM_LIST, getExaminationTermListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_LIST_BY_ID, getCbseExaminationListByIdGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_LIST, saveCbseExaminationListGen);
    yield takeLatest(ExaminationSettingsConstants.EDIT_CBSE_EXAMINATION_LIST, editCbseExaminationListGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_CBSE_EXAMINATION_LIST, deleteCbseExaminationListGen);
    yield takeLatest(ExaminationSettingsConstants.CHANGE_DISPLAY_ORDER_EXAM, changeDisplayOrderExamGen);
    yield takeLatest(ExaminationSettingsConstants.GET_EXAM_CATEGORY, getExamCategoryGen);

    // Examination-Weightage
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_WEIGHTAGE_LIST, getCbseWeightageListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_WEIGHTAGE_LIST_BY_ID, getCbseWeightageListByIdGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_CBSE_WEIGHTAGE_LIST, saveCbseWeightageListGen);
    yield takeLatest(ExaminationSettingsConstants.EDIT_CBSE_WEIGHTAGE_LIST, editCbseWeightageListGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_CBSE_WEIGHTAGE_LIST, deleteCbseWeightageListGen);

    // Examination-Subjects
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_SUBJECTS_LIST, getCbseExaminationSubjectsListGen);
    yield takeLatest(ExaminationSettingsConstants.CHANGE_DISPLAY_ORDER_EXAMINATION_SUBJECTS_LIST, changeDisplayOrderExaminationSubjectsListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_SUBJECTS_LIST, getSubjectsListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_SUBJECTS_LIST_BY_ID, getCbseExaminationSubjectsListByIdGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_SUBJECTS_LIST, saveCbseExaminationSubjectsListGen);
    yield takeLatest(ExaminationSettingsConstants.EDIT_CBSE_EXAMINATION_SUBJECTS_LIST, editCbseExaminationSubjectsListGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_CBSE_EXAMINATION_SUBJECTS_LIST, deleteCbseExaminationSubjectsListGen);


    //Examination-Coscholastic-Grades
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_COSCHOLASTIC_GRADES_LIST, getCbseExaminationCoscholasticGradesListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_COSCHOLASTIC_SUBJECTS_LIST, getCoscholasticSubjectsListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_COSCHOLASTIC_GRADES_LIST_BY_ID, getCbseExaminationCoscholasticGradesListByIdGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_COSCHOLASTIC_GRADES_LIST, saveCbseExaminationCoscholasticGradesListGen);
    yield takeLatest(ExaminationSettingsConstants.EDIT_CBSE_EXAMINATION_COSCHOLASTIC_GRADES_LIST, editCbseExaminationCoscholasticGradesListGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_CBSE_EXAMINATION_COSCHOLASTIC_GRADES_LIST, deleteCbseExaminationCoscholasticGradesListGen);
    yield takeLatest(ExaminationSettingsConstants.COPY_CBSE_EXAMINATION_COSCHOLASTIC_GRADES, copyCbseExaminationCoscholasticGradesGen);

    //Add Multiple Exam Marks
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_MULTIPLE_EXAM_MARKS, getCbseMultipleExamMarksGen);
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_MULTIPLE_EXAM_MARKS_BY_ID, getCbseMultipleExamMarksByIdGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_MULTIPLE_EXAM_MARKS, saveCbseMultipleExamMarksGen);
    yield takeLatest(ExaminationSettingsConstants.EDIT_CBSE_EXAMINATION_MULTIPLE_EXAM_MARKS_BY_ID, editCbseMultipleExamMarksGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_CBSE_EXAMINATION_MULTIPLE_EXAM_MARKS_BY_ID, deleteCbseMultipleExamMarksGen);

    // OverAllGrades
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_OVER_ALL_GRADES, getCbseExaminationOverAllGradesGen);
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_OVER_ALL_GRADES_BY_ID, getCbseExaminationOverAllGradesByIdGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_OVER_ALL_GRADES, saveCbseExaminationOverAllGradesByIdGen);
    yield takeLatest(ExaminationSettingsConstants.EDIT_CBSE_EXAMINATION_OVER_ALL_GRADES_BY_ID, editCbseExaminationOverAllGradesByIdGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_CBSE_EXAMINATION_OVER_ALL_GRADES_BY_ID, deleteCbseExaminationOverAllGradesByIdGen);
    yield takeLatest(ExaminationSettingsConstants.COPY_CBSE_EXAMINATION_OVER_ALL_GRADES, copyCbseExaminationOverAllGradesGen);
    yield takeLatest(ExaminationSettingsConstants.GET_OVERALL_GRADE_COLOR_LIST, getOverallGradeColorListGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_OVERALL_GRADE_COLOR, saveOverallGradeColorGen);

    // Examination-Marks
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_MARKS_LIST, getCbseExaminationMarksGen);
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_EXAMINATION_MARKS_BY_ID, getCbseExaminationMarksByIdGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_CBSE_EXAMINATION_MARKS, saveCbseExaminationMarksByIdGen);
    yield takeLatest(ExaminationSettingsConstants.EDIT_CBSE_EXAMINATION_MARKS, editCbseExaminationMarksByIdGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_CBSE_EXAMINATION_MARKS, deleteCbseExaminationMarksByIdGen);

    // Skill Entry
    yield takeLatest(ExaminationSettingsConstants.GET_SKILL_ENTRY_LIST, getSkillEntryListGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_SKILL_ENTRY, saveSkillEntryGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_SKILL_ENTRY, deleteSkillEntryGen);
    yield takeLatest(ExaminationSettingsConstants.GET_SKILL_ENTRY_BY_ID, getSkillEntryByIdGen);
    yield takeLatest(ExaminationSettingsConstants.UPDATE_SKILL_ENTRY, updateSkillEntryGen);

    // Ao Mapping
    yield takeLatest(ExaminationSettingsConstants.GET_SUBJECT_LIST, getSubjectListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_MODEL_SUBJECT_LIST, getModelSubjectListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_AO_MAPPING_SUBJECTS, getAoMappingSubjectGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_AO_MAPPING_SUBJECTS, saveAoMappingSubjectGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_AO_MAPPING_SUBJECTS, deleteAoMappingSubjectGen);
    yield takeLatest(ExaminationSettingsConstants.UPDATE_AO_MAPPING_SUBJECTS, updateAoMappingSubjectGen);
    yield takeLatest(ExaminationSettingsConstants.GET_AO_MAPPING_SUBJECTS_BY_ID, getAoMappingSubjectByIdGen);

    //signature
    yield takeLatest(ExaminationSettingsConstants.GET_SIGNATURE_LIST, getSignatureListGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_SIGNATURE, saveSignatureGen);
    yield takeLatest(ExaminationSettingsConstants.UPDATE_SIGNATURE, updateSignatureGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_SIGNATURE, deleteSignatureGen);

    // IGSE Settings
    //Term Name 
    yield takeLatest(ExaminationSettingsConstants.GET_IGSE_TERM_NAME_LIST, getIgseTermNameListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_COPY_IGSE_TERM_NAME_LIST, getCopyIgseTermNameListGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_IGSE_TERM_NAME, saveIgseTermNameGen);
    yield takeLatest(ExaminationSettingsConstants.GET_IGSE_TERM_NAME_BY_ID, getIgseTermNameByIdGen);
    yield takeLatest(ExaminationSettingsConstants.UPDATE_IGSE_TERM_NAME, updateIgseTermNameByIdGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_IGSE_TERM_NAME, deleteIgseTermNameByIdGen);

    //Term Details
    yield takeLatest(ExaminationSettingsConstants.GET_IGSE_TERM_DETAILS_LIST, getIgseTermDetailsListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_IGSE_TERM_DETAILS_BY_ID, getIgseTermDetailsByIdGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_IGSE_TERM_DETAILS, saveIgseTermDetailsGen);
    yield takeLatest(ExaminationSettingsConstants.UPDATE_IGSE_TERM_DETAILS, updateIgseTermDetailsByIdGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_IGSE_TERM_DETAILS, deleteIgseTermDetailsByIdGen);

    // Internal Subject Grades
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_INTERNAL_SUBJECTS_GRADES_LIST, getCbseInternalSubjectsGradesListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_CBSE_INTERNAL_SUBJECTS_GRADES_BY_ID, getCbseInternalSubjectsGradesListByIdGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_CBSE_INTERNAL_SUBJECTS_GRADES, saveCbseInternalSubjectsGradesListGen);
    yield takeLatest(ExaminationSettingsConstants.EDIT_CBSE_INTERNAL_SUBJECTS_GRADES, editCbseInternalSubjectsGradesListGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_CBSE_INTERNAL_SUBJECTS_GRADES, deleteCbseInternalSubjectsGradesListGen);
    yield takeLatest(ExaminationSettingsConstants.COPY_CBSE_INTERNAL_SUBJECTS_GRADES, copyCbseInternalSubjectsGradesListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_EXAMINATION_LIST, getExaminationListGen);

    // Percentage Slabs
    yield takeLatest(ExaminationSettingsConstants.GET_PERCENTAGE_SLAB, getPercentageSlabsListGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_PERCENTAGE_SLAB, savePercentageSlabsListGen);
    yield takeLatest(ExaminationSettingsConstants.EDIT_PERCENTAGE_SLAB, editPercentageSlabsListGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_PERCENTAGE_SLAB, deletePercentageSlabsListGen);

    //Area of Strangth Focus
    yield takeLatest(ExaminationSettingsConstants.GET_AREA_OF_STRENGTH_FOCUS_LIST, getAreaofStrengthFocusListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_AREA_OF_STRENGTH_FOCUS_BY_ID, getAreaofStrengthFocusByIdGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_AREA_OF_STRENGTH_FOCUS, saveAreaofStrengthFocusGen);
    yield takeLatest(ExaminationSettingsConstants.UPDATE_AREA_OF_STRENGTH_FOCUS, updateAreaofStrengthFocusGen);

    //Holistic Domain
    yield takeLatest(ExaminationSettingsConstants.GET_HOLISTIC_DOMAIN_LIST, getHolisticDomainGen);
    yield takeLatest(ExaminationSettingsConstants.GET_HOLISTIC_DOMAIN_MODEL_LIST, getHolisticDomainModelGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_HOLISTIC_DOMAIN, saveHolisticDomainGen);
    yield takeLatest(ExaminationSettingsConstants.UPDATE_HOLISTIC_DOMAIN, updateHolisticDomainGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_DOMAIN_ORDER, saveDomainOrderGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_DOMAIN_ORDER, deleteHolisticDomainGen);

    //Holistic Activity
    yield takeLatest(ExaminationSettingsConstants.GET_HOLISTIC_ACTIVITY_LIST, getHolisticActivityGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_HOLISTIC_ACTIVITY, saveHolisticActivityGen);
    yield takeLatest(ExaminationSettingsConstants.UPDATE_HOLISTIC_ACTIVITY, updateHolisticActivityGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_HOLISTIC_ACTIVITY, deleteHolisticActivityGen);
    yield takeLatest(ExaminationSettingsConstants.GET_CLASS_INSTITUTE_ID, getClassInstituteIdGen);
    yield takeLatest(ExaminationSettingsConstants.GET_ACTIVITY_BRANCH, getActivityBranchGen);
    yield takeLatest(ExaminationSettingsConstants.GET_ACTIVITY_CLASS, getActivityClassGen);
    yield takeLatest(ExaminationSettingsConstants.GET_ACTIVITY_BY_ID, getActivityByIdGen);
    yield takeLatest(ExaminationSettingsConstants.GET_INSTITUTE_CLASS, getInstituteClassGen);
    yield takeLatest(ExaminationSettingsConstants.GET_CLASSES_BY_STAGE, getClassesByStageGen);
    yield takeLatest(ExaminationSettingsConstants.GET_COPY_CLASSES_BY_STAGE, getCopyClassesByStageGen);
    yield takeLatest(ExaminationSettingsConstants.COPY_HOLISTIC_ACTIVITY, copyHolisticActivityGen);
    yield takeLatest(ExaminationSettingsConstants.COPY_PREPARATORY_ACTIVITY, copyPreparatoryActivityGen);

    //Holistic Domain Activity
    yield takeLatest(ExaminationSettingsConstants.GET_HOLISTIC_DOMAIN_ACTIVITY_LIST, getHolisticDomainActivityGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_HOLISTIC_DOMAIN_ACTIVITY, saveDomainActivityGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_HOLISTIC_DOMAIN_ACTIVITY, deleteHolisticDomainActivityGen);

    //Holistic Curriculum Goals
    yield takeLatest(ExaminationSettingsConstants.GET_HOLISTIC_CURRICULUM_GOALS_LIST, getHolisticCurriculumGoalsGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_HOLISTIC_CURRICULUM_GOALS, saveHolisticCurriculumGoalsGen);
    yield takeLatest(ExaminationSettingsConstants.UPDATE_HOLISTIC_CURRICULUM_GOALS, updateHolisticCurriculumGoalsGen);

    //Report Card Settings
    yield takeLatest(ExaminationSettingsConstants.GET_REPORT_CARD_SETTINGS, getReportCardSettingsGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_REPORT_CARD_SETTINGS, saveReportCardSettingsGen);
    yield takeLatest(ExaminationSettingsConstants.GET_REPORT_CARD_CONFIG, getReportCardConfigGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_REPORT_CARD_SETTINGS, deleteReportCardSettingsGen);

    // -----Preparatory-----

    //Preparatory domain
    yield takeLatest(ExaminationSettingsConstants.GET_PREPARATORY_DOMAIN_LIST, getPreparatoryDomainGen)
    yield takeLatest(ExaminationSettingsConstants.GET_PREPARATORY_DOMAIN_MODAL, getPreparatoryDomainModelGen)
    yield takeLatest(ExaminationSettingsConstants.SAVE_PREPARATORY_DOMAIN, savePreparatoryDomainGen)
    yield takeLatest(ExaminationSettingsConstants.UPDATE_PREPARATORY_DOMAIN, updatePreparatoryDomainGen)
    yield takeLatest(ExaminationSettingsConstants.SAVE_PREPARATORY_ORDER, savePreparatoryDomainOrderGen)
    yield takeLatest(ExaminationSettingsConstants.DELETE_PREPARATORY_ORDER, deletePreparatoryDomainGen)

    //preparatory Curriculum Goals
    yield takeLatest(ExaminationSettingsConstants.GET_PREPARATORY_CURRICULUM_GOAL, getPreparatoryCurriculumGoalsGen)
    yield takeLatest(ExaminationSettingsConstants.SAVE_PREPARATORY_CURRICULUM_GOAL, savePreparatoryCurriculumGoalsGen)
    yield takeLatest(ExaminationSettingsConstants.UPDATE_PREPARATORY_CURRICULUM_GOAL, updatePreparatoryCurriculumGoalsGen)

    //preparatory garde entry
    yield takeLatest(ExaminationSettingsConstants.GET_PREPARATORY_GRADE_ENTRY_LIST, getPreparatoryGradeEntryListGen)
    yield takeLatest(ExaminationSettingsConstants.SAVE_PREPARATORY_GRADE_ENTRY_LIST, savePreparatoryGradeEntryListGen)
    yield takeLatest(ExaminationSettingsConstants.GET_PREPARATORY_GRADE_ENTRY_LIST_BY_ID, getPreparatoryGradeEntryListByIdGen)
    yield takeLatest(ExaminationSettingsConstants.UPDATE_PREPARATORY_GRADE_ENTRY_LIST, updatePreparatoryGradeEntryListGen)
    yield takeLatest(ExaminationSettingsConstants.SAVE_PREPARATORY_STUDENT_SURROUNDING, savePreparatoryStudentSurroundingGen)
    yield takeLatest(ExaminationSettingsConstants.SAVE_PREPARATORY_STUDENT_FEEDBACK, savePreparatoryStudentFeedbackGen)
    yield takeLatest(ExaminationSettingsConstants.SAVE_PREPARATORY_PARENT_FEEDBACK, savePreparatoryParentFeedbackGen)
    yield takeLatest(ExaminationSettingsConstants.EXPORT_PREPARATORY_GRADE_ENTRY_LIST, exportPreparatoryGradeEntryListGen)
    yield takeLatest(ExaminationSettingsConstants.COPY_PREPARATORY_GRADE_ENTRY_STUDENT_DETAILS, copyPreparatoryGradeEntryStudentDetailsGen)

    //preparatory activity
    yield takeLatest(ExaminationSettingsConstants.GET_PREPARATORY_ACTIVITY, getPreparatoryActivityGen)
    yield takeLatest(ExaminationSettingsConstants.SAVE_PREPARATORY_ACTIVITY, savePreparatoryActivityGen)
    yield takeLatest(ExaminationSettingsConstants.UPDATE_PREPARATORY_ACTIVITY, updatePreparatoryActivityGen)
    yield takeLatest(ExaminationSettingsConstants.DELETE_PREPARATORY_ACTIVITY, deletePreparatoryActivityGen)
    yield takeLatest(ExaminationSettingsConstants.GET_PREPARATORY_ACTIVITY_BY_ID, getPreparatoryActivityByIdGen)
    yield takeLatest(ExaminationSettingsConstants.GET_PREPARATORY_DOMAIN_STUDENTS, getPreparatoryDomainStudentsGen)
    yield takeLatest(ExaminationSettingsConstants.SAVE_PREPARATORY_DOMAIN_STUDENTS, savePreparatoryDomainStudentsGen)
    yield takeLatest(ExaminationSettingsConstants.UPDATE_PREPARATORY_DOMAIN_STUDENTS, updatePreparatoryDomainStudentsGen)
    yield takeLatest(ExaminationSettingsConstants.GET_PREPARATORY_SUMMARY_BY_ID, getPreparatorySummaryByIdGen)
    yield takeLatest(ExaminationSettingsConstants.SAVE_PREPARATORY_SUMMARY, savePreparatorySummaryGen)
    yield takeLatest(ExaminationSettingsConstants.GET_PREPARATORY_STATUS, getPreparatoryStatusGen)
    yield takeLatest(ExaminationSettingsConstants.SAVE_PREPARATORY_PARENT_COLLECTED_STATUS, savePrepartoryParentCollectionGen)
   
    // IGSE Skill Attribute Settings
    yield takeLatest(ExaminationSettingsConstants.GET_SKILL_ATTRIBUTE_SETTINGS_LIST, getSkillAttributeSettingsListGen);
    yield takeLatest(ExaminationSettingsConstants.GET_SKILL_ATTRIBUTE_SETTINGS_ITEM_BY_ID, getSkillAttributeSettginsItemByIdGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_SKILL_ATTRIBUTE_SETTINGS_ITEM, saveSkillAttributeSettingsItemGen);
    yield takeLatest(ExaminationSettingsConstants.UPDATE_SKILL_ATTRIBUTE_SETTINGS_ITEM, updateSkillAttributeSettingsItemGen);
    yield takeLatest(ExaminationSettingsConstants.DELETE_SKILL_ATTRIBUTE_SETTINGS_ITEM, deleteSkillAttributeSettingsItemGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_SET_SKILL_ORDER, saveSetSkillOrderGen);
    yield takeLatest(ExaminationSettingsConstants.SAVE_SET_SKILL_ATTRIBUTE_ORDER, saveSetSkillAttributeOrderGen);
}