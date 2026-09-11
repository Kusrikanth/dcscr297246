import { call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../api/apiactions";
import {
  setDelSportsAttributeItemAct,
  setDelSportsGradeItemAct,
  setDelSportsNameItemAct,
  setEditAssignSportsToStudentsAct,
  setUnAssignSportsTeacherAct,
  setEditSportsAttributeItemAct,
  setEditSportsClassMappingItemAct,
  setEditSportsGradeItemAct,
  setEditSportsNameItemAct,
  setEditSportsSubAttributeItemAct,
  setEditStudentSportsGradeEntryAct,
  setExaminationSportsErrAct,
  setGetAssignSportsToStudentItemByIdAct,
  setGetAssignSportsToStudentsListAct,
  setNotAssignedStudentsListAct,
  setSaveAssignSportsToStudentsAct,
  setSaveSportsAttributeItemAct,
  setSaveSportsClassMappingItemAct,
  setSaveSportsDiscriptionsListAct,
  setSaveSportsGradeItemAct,
  setSaveSportsNameItemAct,
  setSaveSportsSubAttributeItemAct,
  setSaveStudentSportsGradeEntryAct,
  setSaveSportsTeacherAct,
  setSportsAttributeByIdAct,
  setSportsAttributesListAct,
  setSportsClassesListAct,
  setSportsClassesListByIdAct,
  setSportsClassMappingByIdAct,
  setSportsClassMappingListAct,
  setSportsDiscriptionsListAct,
  setSportsGradeItemByIdAct,
  setSportsGradesListAct,
  setSportsMainAttributesWithSubAttributesAct,
  setSportsNameByIdAct,
  setSportsNamesAct,
  setSportsSubAttributeItemByIdAct,
  setSportsSubAttributeListAct,
  setStudentSportsGradeEntryAct,
  setStudentSportsGradeEntryByIdAct,
  setSportsTeacherByIdAct,
  setSportsTeacherListAct,
  setSubAttributesItemsListAct,
  setSportsProgressCardListAct,
  setDownloadSportsProgressCardAct,
  setSportsunAssignedClassesAct,
  setEditSportsTeacherAct,
  setOtherProgressCardAccessAct,
  setSaveStudentBmiDetailsAct,
  setSubAttributesCommonListAct,
  setDeleteSportsClassMappingAct,
  setDeleteSportsSubAttributeItemAct,
  setDelSportsDiscriptionsItemAct,
} from "./examinationSportsSlice";
import { examinationSportsConstants } from "./examinationSportsConstants";
import { PrePrimaryResultTableData } from "../../../pages/Examination/IgseManagement/SkillsEntry/CurricularSkills/helper";

function* getSportsNamesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsNamesAct(response.data));
  }
}

function* getSportsNameItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsNameByIdAct(response.data));
  }
}

function* saveSportsNameItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSaveSportsNameItemAct(response.data));
  }
}
function* editSportsNameItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setEditSportsNameItemAct({ statusCode: response.status }));
  }
}

function* delSportsNameItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setDelSportsNameItemAct({ status: response.statusCode }));
  }
}

// sports attributes
function* getSportsAttributeGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsAttributesListAct(response.data));
  }
}

function* getSportsAttributeItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsAttributeByIdAct(response.data));
  }
}

function* saveSportsAttributeItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSaveSportsAttributeItemAct(response.data));
  }
}
function* editSportsAttributeItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setEditSportsAttributeItemAct({ statusCode: response.status }));
  }
}

function* delSportsAttributeItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setDelSportsAttributeItemAct({ status: response.statusCode }));
  }
}

// sports grades
function* getSportsGradesListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsGradesListAct(response.data));
  }
}

function* getSportsGradeItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsGradeItemByIdAct(response.data));
  }
}

function* saveSportsGradeItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSaveSportsGradeItemAct(response.data));
  }
}
function* editSportsGradeItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setEditSportsGradeItemAct({ statusCode: response.status }));
  }
}

function* delSportsGradeItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setDelSportsGradeItemAct({ status: response.statusCode }));
  }
}

// sports management
function* getSportsClassMappingListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsClassMappingListAct(response.data));
  }
}

function* getSportsClassMappingItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsClassMappingByIdAct(response.data));
  }
}

function* saveSportsClassMappingItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSaveSportsClassMappingItemAct(response.data));
  }
}
function* editSportsClassMappingItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(
      setEditSportsClassMappingItemAct({ statusCode: response.status })
    );
  }
}

function* deleteSportsClassMappingGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setDeleteSportsClassMappingAct({ status: response.statusCode }));
  }
}

function* getSportsSubAttributeListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsSubAttributeListAct(response.data));
  }
}

function* getSportsSubAttributeItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsSubAttributeItemByIdAct(response.data));
  }
}

function* saveSportsSubAttributeItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(
      setSaveSportsSubAttributeItemAct({ statusCode: response.status })
    );
  }
}
function* editSportsSubAttributeItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(
      setEditSportsSubAttributeItemAct({ statusCode: response.status })
    );
  }
}
function* delSportsSubAttributeItemGen(action: ICreatedActionType):any {
  const { payload } = action;
  const response = yield call(deleteData,payload.endpoint,
    payload.payload,
    payload.optionalConfig)

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(
      setDeleteSportsSubAttributeItemAct({ status: response.statusCode })
    );
  }
}

function* getSportsClassesListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsClassesListAct(response.data));
  }
}

function* getSportsClassesListByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsClassesListByIdAct(response.data));
  }
}


function* getSportsDiscriptionsListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsDiscriptionsListAct(response.data));
  }
}

function* getStudentSportsGradeEntryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setExaminationSportsErrAct(response.error));
    } else {
        yield put(setStudentSportsGradeEntryAct(response.data));
    }
}

function* getStudentSportsGradeEntryByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setExaminationSportsErrAct(response.error));
    } else {
        yield put(setStudentSportsGradeEntryByIdAct(response.data));
    }
}

function* editStudentSportsGradeEntryById(action: any): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setExaminationSportsErrAct(response.error));
    } else {
        yield put(setEditStudentSportsGradeEntryAct({statusCode : response.status}));
    }
}

function* saveStudentSportsGradeEntryAct(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
     if (response && response.error) {
        yield put(setExaminationSportsErrAct(response.error));
    } else {
        yield put(setSaveStudentSportsGradeEntryAct({statusCode : response.status}));
    }
}

function* getSportsMainAttributesWithSubAttributesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setExaminationSportsErrAct(response.error));
    } else {
        yield put(setSportsMainAttributesWithSubAttributesAct(response.data));
    }
}


function* saveSportsDiscriptionsItemsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSaveSportsDiscriptionsListAct(response.data));
  }
}
function* delSportsDiscriptionsItemsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setDelSportsDiscriptionsItemAct({status: response.statusCode}));
  }
}

function* getSubAttributesItemsListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSubAttributesItemsListAct(response.data));
  }
}

function* getSubAttributesCommonListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if(response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  }else {
    yield put(setSubAttributesCommonListAct(response.data));
  }
}

// assign sports to students
function* getAssignSportsToStudentsListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setGetAssignSportsToStudentsListAct(response.data));
  }
}

function* getAssignSportsToStudentItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setGetAssignSportsToStudentItemByIdAct(response.data));
  }
}

function* saveAssignSportsToStudentsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(
      setSaveAssignSportsToStudentsAct({ statusCode: response.status })
    );
  }
}
function* editAssignSportsToStudentsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(
      setEditAssignSportsToStudentsAct({statusCode: response.status})
    );
  }
}


function* getNotAssignedStudentsListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setNotAssignedStudentsListAct(response.data));
  }
}


function* getSportsTeacherListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsTeacherListAct(response.data));
  }
}

function* getSportsTeacherByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsTeacherByIdAct(response.data));
  }
}

function* saveSportsTeacherGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSaveSportsTeacherAct({ status: response.statusCode }));
  }
}
function* editSportsTeacherGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setEditSportsTeacherAct({ status: response.statusCode }));
  }
}

function* unAssignSportsTeacherGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setUnAssignSportsTeacherAct({ status: response.statusCode }));
  }
}

// Sports Progress Card
function* getSportsProgressCardListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsProgressCardListAct(response.data));
  }
}

function* downloadSportsProgressCardGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setDownloadSportsProgressCardAct(response.data));
  }
}

function* getSportsunAssignedClassesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setSportsunAssignedClassesAct(response.data));
  }
}
function* getOtherProgressCardAccessGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setExaminationSportsErrAct(response.error));
  } else {
    yield put(setOtherProgressCardAccessAct(response.data));
  }
}

function* saveStudentBmiDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setExaminationSportsErrAct(response.error));
    } else {
        yield put(setSaveStudentBmiDetailsAct({data: response.data, statusCode: response.status}));
    }
  }

export default function* examinationSportsSaga() {
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_NAMES,
    getSportsNamesGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_NAME_BY_ID,
    getSportsNameItemByIdGen
  );
  yield takeLatest(
    examinationSportsConstants.SAVE_SPORTS_NAME_ITEM,
    saveSportsNameItemGen
  );
  yield takeLatest(
    examinationSportsConstants.EDIT_SPORTS_NAME_ITEM,
    editSportsNameItemGen
  );
  yield takeLatest(
    examinationSportsConstants.DEL_SPORTS_NAME_ITEM,
    delSportsNameItemGen
  );

  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_ATTRIBUTE_LIST,
    getSportsAttributeGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_ATTRIBUTE_BY_ID,
    getSportsAttributeItemByIdGen
  );
  yield takeLatest(
    examinationSportsConstants.SAVE_SPORTS_ATTRIBUTE_ITEM,
    saveSportsAttributeItemGen
  );
  yield takeLatest(
    examinationSportsConstants.EDIT_SPORTS_ATTRIBUTE_ITEM,
    editSportsAttributeItemGen
  );
  yield takeLatest(
    examinationSportsConstants.DEL_SPORTS_ATTRIBUTE_ITEM,
    delSportsAttributeItemGen
  );

  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_GRADE_LIST,
    getSportsGradesListGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_GRADE_BY_ID,
    getSportsGradeItemByIdGen
  );
  yield takeLatest(
    examinationSportsConstants.SAVE_SPORTS_GRADE_ITEM,
    saveSportsGradeItemGen
  );
  yield takeLatest(
    examinationSportsConstants.EDIT_SPORTS_GRADE_ITEM,
    editSportsGradeItemGen
  );
  yield takeLatest(
    examinationSportsConstants.DEL_SPORTS_GRADE_ITEM,
    delSportsGradeItemGen
  );

  // management
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_CLASS_MAPPING_LIST,
    getSportsClassMappingListGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_CLASS_MAPPING_BY_ID,
    getSportsClassMappingItemByIdGen
  );
  yield takeLatest(
    examinationSportsConstants.SAVE_SPORTS_CLASS_MAPPING_ITEM,
    saveSportsClassMappingItemGen
  );
  yield takeLatest(
    examinationSportsConstants.EDIT_SPORTS_CLASS_MAPPING_ITEM,
    editSportsClassMappingItemGen
  );
  yield takeLatest(examinationSportsConstants.DELETE_SPORTS_CLASS_MAPPING, deleteSportsClassMappingGen);

  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_SUBATTRIBUTE_LIST,
    getSportsSubAttributeListGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_SUBATTRIBUTE_ITEM_BY_ID,
    getSportsSubAttributeItemByIdGen
  );
  yield takeLatest(
    examinationSportsConstants.SAVE_SPORTS_SUBATTRIBUTE_ITEM,
    saveSportsSubAttributeItemGen
  );
  yield takeLatest(
    examinationSportsConstants.EDIT_SPORTS_SUBATTRIBUTE_ITEM,
    editSportsSubAttributeItemGen
  );
  yield takeLatest(
    examinationSportsConstants.DEL_SPORTS_SUBATTRIBUTE_ITEM,delSportsSubAttributeItemGen
  );
    yield takeLatest(
    examinationSportsConstants.GET_SPORTS_CLASSES_LIST,
    getSportsClassesListGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_CLASSES_LIST_BY_ID,
    getSportsClassesListByIdGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_DISCRIPTIONS_LIST,
    getSportsDiscriptionsListGen
  );

  // Grade Entry
    yield takeLatest(examinationSportsConstants.GET_STUDENT_SPORTS_GRADE_ENTRY, getStudentSportsGradeEntryGen);
    yield takeLatest(examinationSportsConstants.GET_STUDENT_SPORTS_GRADE_ENTRY_BY_ID, getStudentSportsGradeEntryByIdGen);
    yield takeLatest(examinationSportsConstants.EDIT_STUDENT_SPORTS_GRADE_ENTRY, editStudentSportsGradeEntryById);
    yield takeLatest(examinationSportsConstants.SAVE_STUDENT_SPORTS_GRADE_ENTRY, saveStudentSportsGradeEntryAct);
    yield takeLatest(examinationSportsConstants.GET_SPORTS_MAIN_ATTRIBUTES_WITH_SUB_ATTRIBUTES, getSportsMainAttributesWithSubAttributesGen);
  
  // BMI Details
  yield takeLatest(
    examinationSportsConstants.SAVE_STUDENT_BMI_DETAILS,
    saveStudentBmiDetailsGen
  );
    
  yield takeLatest(
    examinationSportsConstants.SAVE_SPORTS_DISCRIPTION_ITEMS,
    saveSportsDiscriptionsItemsGen
  );
  yield takeLatest(examinationSportsConstants.DEL_SPORTS_DISCRIPTIONS_ITEM,delSportsDiscriptionsItemsGen)
  yield takeLatest(
    examinationSportsConstants.GET_SUB_ATTRIBUTE_ITEMS_LIST,
    getSubAttributesItemsListGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_SUB_ATTRIBUTES_COMMON_LIST,
    getSubAttributesCommonListGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_ASSIGN_SPORTS_TO_STUDENTS_LIST,
    getAssignSportsToStudentsListGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_ASSIGN_SPORTS_TO_STUDENT_ITEM_BY_ID,
    getAssignSportsToStudentItemByIdGen
  );
  yield takeLatest(
    examinationSportsConstants.SAVE_ASSIGN_SPORTS_TO_STUDENT_ITEMS,
    saveAssignSportsToStudentsGen
  );
  yield takeLatest(
    examinationSportsConstants.EDIT_ASSIGN_SPORTS_TO_STUDENT_ITEMS,
    editAssignSportsToStudentsGen
  );
  yield takeLatest(examinationSportsConstants.GET_NOT_ASSIGNED_STUDENTS_LIST,getNotAssignedStudentsListGen)

  // sports teacher
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_TEACHER_LIST,
    getSportsTeacherListGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_TEACHER_BY_ID,
    getSportsTeacherByIdGen
  );
  yield takeLatest(
    examinationSportsConstants.SAVE_SPORTS_TEACHER,
    saveSportsTeacherGen
  );
  yield takeLatest(
    examinationSportsConstants.EDIT_SPORTS_TEACHER,
    editSportsTeacherGen
  );
  yield takeLatest(
    examinationSportsConstants.UNASSIGN_SPORTS_TEACHER,
    unAssignSportsTeacherGen
  );

  // Sports Progress Card
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_PROGRESS_CARD_LIST,
    getSportsProgressCardListGen
  );
  yield takeLatest(
    examinationSportsConstants.DOWNLOAD_SPORTS_PROGRESS_CARD,
    downloadSportsProgressCardGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_SPORTS_UNASSIGNED_CLASSES_LIST,
    getSportsunAssignedClassesGen
  );
  yield takeLatest(
    examinationSportsConstants.GET_OTHER_PROGRESS_CARD_ACCESS,
    getOtherProgressCardAccessGen
  );
}
