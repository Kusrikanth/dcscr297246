import { call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { pvaReportsConstants } from "./pvaReportsConstants";
import { setCategorySelectionByIdAct, setDeleteCategorySelectionAct, setDeleteGreenReportCardCategoryItemAct, setDeleteGreenReportCardGradeConfigAct, setDeletePvaGradesAct, setDeletePvaSkillAreaAct, setDeletePvaSubjectAct, setDeletePvaSubjecttoClassMappingAct, setGetPvaGradesByIdAct, setGetPvaSkillAreaByIdAct, setGetPvaSubjectByIdAct, setGetPvaSubjecttoClassMappingByIdAct, setGreenReportCardCategoryByIdAct, setGreenReportCardCategoryListAct, setGreenReportCardGradeConfigByIdAct, setGreenReportCardGradeConfigListAct, setCategorySelectionListAct, setPvaGradeEntrySubjectAct, setPvaGradesAct, setPvaReportsErrAct, setPvaSkillAreaAct, setPvaStudentGradeEntryListAct, setPvaSubjectAct, setPvaSubjecttoClassMappingAct, setSaveCategorySelectionAct, setSaveGreenReportCardCategoryItemAct, setSaveGreenReportCardGradeConfigAct, setSavePvaGradesAct, setSavePvaSkillAreaAct, setSavePvaStudentGradeEntryListAct, setSavePvaSubjectAct, setSavePvaSubjecttoClassMappingAct, setUpdateCategorySelectionAct, setUpdateGreenReportCardCategoryItemAct, setUpdatePvaGradesAct, setUpdatePvaSubjectAct, setUpdatePvaSubjecttoClassMappingAct, setAllGreenReportGradeEntryStntsListAct, setGreenReportGradeEntryStntByIdAct, setSaveGreenReportGradeAct, setDisciplineSettingsDomainsAct, setDisciplineSettingsDomainItemByIdAct, setSaveDisciplineSettingsDomainItemByIdAct, setUpdateDisciplineSettingsDomainItemByIdAct, setDelDisciplineSettingsDomainItemByIdAct, setDisciplineSettingsSubDomainsAct, setSaveDisciplineSettingsSubDomainItemByIdAct, setUpdateDisciplineSettingsSubDomainItemByIdAct, setDelDisciplineSettingsSubDomainItemByIdAct, setDisciplineSettingsSubDomainItemByIdAct, setDisciplineGradeConfigListAct, setSaveDisciplineGradeConfigListAct, setDelDisciplineGradeConfigListAct } from "./pvaReportsSlice";

//Settings
function* getPvaSubjectGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setPvaSubjectAct(response.data));
  }
}
function* getPvaGradeEntrySubjectGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setPvaGradeEntrySubjectAct(response.data));
  }
}

function* savePvaSubjectGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setSavePvaSubjectAct(response));
  }
}

function* updatePvaSubjectGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setUpdatePvaSubjectAct({ statusCode: response.status }));
  }
}

function* getPvaSubjectByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setGetPvaSubjectByIdAct(response.data));
  }
}

function* deletePvaSubjectGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDeletePvaSubjectAct({ statusCode: response.status }));
  }
}

//PVA Skill Area
function* getPvaSkillAreaGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setPvaSkillAreaAct(response.data));
  }
}

function* savePvaSkillAreaGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setSavePvaSkillAreaAct(response));
  }
}

function* getPvaSkillAreaByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setGetPvaSkillAreaByIdAct(response.data));
  }
}

function* deletePvaSkillAreaGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDeletePvaSkillAreaAct({ statusCode: response.status }));
  }
}

//PVA Grades
function* getPvaGradesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setPvaGradesAct(response.data));
  }
}

function* savePvaGradesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setSavePvaGradesAct(response));
  }
}

function* updatePvaGradesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setUpdatePvaGradesAct({ statusCode: response.status }));
  }
}

function* getPvaGradesByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setGetPvaGradesByIdAct(response.data));
  }
}

function* deletePvaGradesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDeletePvaGradesAct({ statusCode: response.status }));
  }
}


//PVA Subject to Class Mapping
function* getPvaSubjecttoClassMappingGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setPvaSubjecttoClassMappingAct(response.data));
  }
}

function* savePvaSubjecttoClassMappingGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setSavePvaSubjecttoClassMappingAct(response));
  }
}

function* updatePvaSubjecttoClassMappingGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setUpdatePvaSubjecttoClassMappingAct({ statusCode: response.status }));
  }
}

function* getPvaSubjecttoClassMappingByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setGetPvaSubjecttoClassMappingByIdAct(response.data));
  }
}

function* deletePvaSubjecttoClassMappingGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDeletePvaSubjecttoClassMappingAct({ statusCode: response.status }));
  }
}

function* getPvaStudentGradeEntryListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setPvaStudentGradeEntryListAct(response.data));
  }
}
function* savePvaGradeEntryListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setSavePvaStudentGradeEntryListAct({ statusCode: response.status }));
  }
}

// green report card grade config 
function* getGreenReportCardGradeConfigGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setGreenReportCardGradeConfigListAct(response.data));
  }
}

function* getGreenReportCardGradeConfigByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setGreenReportCardGradeConfigByIdAct(response.data));
  }
}

function* saveGreenReportCardGradeConfigGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setSaveGreenReportCardGradeConfigAct(response));
  }
}

function* deleteGreenReportCardGradeConfigGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDeleteGreenReportCardGradeConfigAct({ statusCode: response.status }));
  }
}

function* getGreenReportCardCategoryListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setGreenReportCardCategoryListAct(response.data));
  }
}

function* getGreenReportCardCategoryByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setGreenReportCardCategoryByIdAct(response.data));
  }
}

function* saveGreenReportCardCategoryItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setSaveGreenReportCardCategoryItemAct(response));
  }
}

function* updateGreenReportCardCategoryItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setUpdateGreenReportCardCategoryItemAct({ statusCode: response.status }));
  }
}

function* deleteGreenReportCardCategoryItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDeleteGreenReportCardCategoryItemAct({ statusCode: response.status }));
  }
}

function* getCategorySelectionListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setCategorySelectionListAct(response.data));
  }
}
function* saveCategorySelectionGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setSaveCategorySelectionAct({ statusCode: response.status }));
  }
}
function* getCategorySelectionByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setCategorySelectionByIdAct(response.data));
  }
}
function* updateCategorySelectionGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setUpdateCategorySelectionAct({ statusCode: response.status }));
  }
}
function* deleteCategorySelectionGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDeleteCategorySelectionAct({ statusCode: response.status }));
  }
}

// Green Grade Entry

function* getAllGreenReportGradeEntryStntsListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setAllGreenReportGradeEntryStntsListAct(response.data));
  }
}
function* getGreenReportGradeEntryStntByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setGreenReportGradeEntryStntByIdAct(response.data));
  }
}
function* saveGreenReportGradeGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setSaveGreenReportGradeAct({ statusCode: response.status }));
  }
}

// --->>> DISCIPLE <<<---

// Domains
function* getDisciplineSettingsDomainsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDisciplineSettingsDomainsAct(response.data));
  }
}
function* getDisciplineSettingsDomainItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDisciplineSettingsDomainItemByIdAct(response.data));
  }
}
function* saveDisciplineSettingsDomainItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setSaveDisciplineSettingsDomainItemByIdAct(response.data));
  }
}
function* updateDisciplineSettingsDomainItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setUpdateDisciplineSettingsDomainItemByIdAct(response.data));
  }
}
function* delDisciplineSettingsDomainItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDelDisciplineSettingsDomainItemByIdAct({statusCode: response.status}));
  }
}

// Sub Domains
function* getDisciplineSettingsSubDomainsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDisciplineSettingsSubDomainsAct(response.data));
  }
}
function* getDisciplineSettingsSubDomainItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDisciplineSettingsSubDomainItemByIdAct(response.data));
  }
}
function* saveDisciplineSettingsSubDomainItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setSaveDisciplineSettingsSubDomainItemByIdAct(response.data));
  }
}
function* updateDisciplineSettingsSubDomainItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setUpdateDisciplineSettingsSubDomainItemByIdAct(response.data));
  }
}
function* delDisciplineSettingsSubDomainItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDelDisciplineSettingsSubDomainItemByIdAct({statusCode: response.status}));
  }
}
function* getDisciplineGradeConfigListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDisciplineGradeConfigListAct(response.data));
  }
}
function* saveDisciplineGradeConfigListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setSaveDisciplineGradeConfigListAct({ statusCode: response.status }));
  }
}
function* delDisciplineGradeConfigListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setPvaReportsErrAct(response.error));
  } else {
    yield put(setDelDisciplineGradeConfigListAct({statusCode: response.status}));
  }
}


export default function* pvaReportsSaga() {

  //Settings
  yield takeLatest(pvaReportsConstants.GET_PVA_SUBJECTS, getPvaSubjectGen);
  yield takeLatest(pvaReportsConstants.SAVE_PVA_SUBJECTS, savePvaSubjectGen);
  yield takeLatest(pvaReportsConstants.UPDATE_PVA_SUBJECTS, updatePvaSubjectGen);
  yield takeLatest(pvaReportsConstants.GET_PVA_SUBJECTS_BY_ID, getPvaSubjectByIdGen);
  yield takeLatest(pvaReportsConstants.DELETE_PVA_SUBJECTS, deletePvaSubjectGen);
  yield takeLatest(pvaReportsConstants.GET_PVA_GRADE_ENTRY_SUBJECTS, getPvaGradeEntrySubjectGen);

  //PVA Skill Area
  yield takeLatest(pvaReportsConstants.GET_PVA_SKILL_AREA, getPvaSkillAreaGen);
  yield takeLatest(pvaReportsConstants.SAVE_PVA_SKILL_AREA, savePvaSkillAreaGen);
  yield takeLatest(pvaReportsConstants.GET_PVA_SKILL_AREA_BY_ID, getPvaSkillAreaByIdGen);
  yield takeLatest(pvaReportsConstants.DELETE_PVA_SKILL_AREA, deletePvaSkillAreaGen);

  //PVA Grades
  yield takeLatest(pvaReportsConstants.GET_PVA_GRADES, getPvaGradesGen);
  yield takeLatest(pvaReportsConstants.SAVE_PVA_GRADES, savePvaGradesGen);
  yield takeLatest(pvaReportsConstants.UPDATE_PVA_GRADES, updatePvaGradesGen);
  yield takeLatest(pvaReportsConstants.GET_PVA_GRADES_BY_ID, getPvaGradesByIdGen);
  yield takeLatest(pvaReportsConstants.DELETE_PVA_GRADES, deletePvaGradesGen);

  //PVA Subject to Class Mapping
  yield takeLatest(pvaReportsConstants.GET_PVA_SUBJECTS_CLASSES_MAPPING, getPvaSubjecttoClassMappingGen);
  yield takeLatest(pvaReportsConstants.SAVE_PVA_SUBJECTS_CLASSES_MAPPING, savePvaSubjecttoClassMappingGen);
  yield takeLatest(pvaReportsConstants.UPDATE_PVA_SUBJECTS_CLASSES_MAPPING, updatePvaSubjecttoClassMappingGen);
  yield takeLatest(pvaReportsConstants.GET_PVA_SUBJECTS_CLASSES_MAPPING_BY_ID, getPvaSubjecttoClassMappingByIdGen);
  yield takeLatest(pvaReportsConstants.DELETE_PVA_SUBJECTS_CLASSES_MAPPING, deletePvaSubjecttoClassMappingGen);

  //Management

  //Grade Entry
  yield takeLatest(pvaReportsConstants.GET_PVA_STUDENT_GRADE_ENTRY_LIST, getPvaStudentGradeEntryListGen);
  yield takeLatest(pvaReportsConstants.SAVE_PVA_GRADE_ENTRY_LIST, savePvaGradeEntryListGen);

  // Green Report Card grade config
  yield takeLatest(pvaReportsConstants.GET_GREEN_REPORT_CARD_GRADE_CONFIG, getGreenReportCardGradeConfigGen);
  yield takeLatest(pvaReportsConstants.GET_GREEN_REPORT_CARD_GRADE_CONFIG_BY_ID, getGreenReportCardGradeConfigByIdGen);
  yield takeLatest(pvaReportsConstants.SAVE_GREEN_REPORT_CARD_GRADE_CONFIG, saveGreenReportCardGradeConfigGen);
  yield takeLatest(pvaReportsConstants.DELETE_GREEN_REPORT_CARD_GRADE_CONFIG, deleteGreenReportCardGradeConfigGen);

  // Green Report Card Category
  yield takeLatest(pvaReportsConstants.GET_GREEN_REPORT_CARD_CATEGORY_LIST, getGreenReportCardCategoryListGen);
  yield takeLatest(pvaReportsConstants.GET_GREEN_REPORT_CARD_CATEGORY_BY_ID, getGreenReportCardCategoryByIdGen);
  yield takeLatest(pvaReportsConstants.SAVE_GREEN_REPORT_CARD_CATEGORY_ITEM, saveGreenReportCardCategoryItemGen);
  yield takeLatest(pvaReportsConstants.UPDATE_GREEN_REPORT_CARD_CATEGORY_ITEM, updateGreenReportCardCategoryItemGen);
  yield takeLatest(pvaReportsConstants.DELETE_GREEN_REPORT_CARD_CATEGORY_ITEM, deleteGreenReportCardCategoryItemGen);

  // Green Report Card Management
  yield takeLatest(pvaReportsConstants.GET_CATEGORY_SELECTION_LIST, getCategorySelectionListGen);
  yield takeLatest(pvaReportsConstants.SAVE_CATEGORY_SELECTION, saveCategorySelectionGen);
  yield takeLatest(pvaReportsConstants.GET_CATEGORY_SELECTION_BY_ID, getCategorySelectionByIdGen);
  yield takeLatest(pvaReportsConstants.UPDATE_CATEGORY_SELECTION, updateCategorySelectionGen);
  yield takeLatest(pvaReportsConstants.DELETE_CATEGORY_SELECTION, deleteCategorySelectionGen);
  
  // Green Grade Entry
  yield takeLatest(pvaReportsConstants.GET_ALL_GREEN_REPORT_GRADE_ENRTY_STNT_LIST, getAllGreenReportGradeEntryStntsListGen);
  yield takeLatest(pvaReportsConstants.GET_GREEN_REPORT_GRADE_ENTRY_STNT_BY_ID, getGreenReportGradeEntryStntByIdGen);
  yield takeLatest(pvaReportsConstants.SAVE_GREEN_REPORT_GRADE_ENTRY, saveGreenReportGradeGen);

  // --->>> DISCIPLE <<<---
  // Domains
  yield takeLatest(pvaReportsConstants.GET_DISCIPLINE_SETTINGS_DOMAINS_RESP,getDisciplineSettingsDomainsGen);
  yield takeLatest(pvaReportsConstants.GET_DISCIPLINE_SETTINGS_DOMAINS_ITEM_BY_ID_RESP,getDisciplineSettingsDomainItemByIdGen);
  yield takeLatest(pvaReportsConstants.SAVE_DISCIPLINE_SETTINGS_DOMAINS_ITEM_BY_ID_RESP,saveDisciplineSettingsDomainItemByIdGen);
  yield takeLatest(pvaReportsConstants.UPDATE_DISCIPLINE_SETTINGS_DOMAINS_ITEM_BY_ID_RESP,updateDisciplineSettingsDomainItemByIdGen);
  yield takeLatest(pvaReportsConstants.DEL_DISCIPLINE_SETTINGS_DOMAINS_ITEM_BY_ID_RESP,delDisciplineSettingsDomainItemByIdGen);

  // Sub Domains
  yield takeLatest(pvaReportsConstants.GET_DISCIPLINE_SETTINGS_SUB_DOMAINS_RESP,getDisciplineSettingsSubDomainsGen);
  yield takeLatest(pvaReportsConstants.GET_DISCIPLINE_SETTINGS_SUB_DOMAINS_ITEM_BY_ID_RESP,getDisciplineSettingsSubDomainItemByIdGen);
  yield takeLatest(pvaReportsConstants.SAVE_DISCIPLINE_SETTINGS_SUB_DOMAINS_ITEM_BY_ID_RESP,saveDisciplineSettingsSubDomainItemByIdGen);
  yield takeLatest(pvaReportsConstants.UPDATE_DISCIPLINE_SETTINGS_SUB_DOMAINS_ITEM_BY_ID_RESP,updateDisciplineSettingsSubDomainItemByIdGen);
  yield takeLatest(pvaReportsConstants.DEL_DISCIPLINE_SETTINGS_SUB_DOMAINS_ITEM_BY_ID_RESP,delDisciplineSettingsSubDomainItemByIdGen);
  yield takeLatest(pvaReportsConstants.GET_DISCIPLINE_GRADE_CONFIG_LIST,getDisciplineGradeConfigListGen);
  yield takeLatest(pvaReportsConstants.SAVE_DISCIPLINE_GRADE_CONFIG_LIST,saveDisciplineGradeConfigListGen);
  yield takeLatest(pvaReportsConstants.DEL_DISCIPLINE_GRADE_CONFIG_LIST,delDisciplineGradeConfigListGen);
  
}
