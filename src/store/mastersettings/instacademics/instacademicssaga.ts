import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  setInstAcademicYearAct,
  setAddInstAcademicYearAct,
  setUpdateInstAcademicYearAct,
  setDeleteAcademicYearAct,
  setInstAcademicTermAct,
  setAddInstAcademicTermAct,
  setUpdateInstAcademicTermAct,
  setDeleteAcademicTermAct,
  setInstCurriculumAct,
  setAddInstCurriculumAct,
  setUpdateInstCurriculumAct,
  setDeleteCurriculumAct,
  setInstClassAct,
  setAddInstClassAct,
  setUpdateInstClassAct,
  setDeleteClassAct,
  setCurriculumClassAct,
  setAddCurriculumClassAct,
  setUpdateCurriculumClassAct,
  setDeleteCurriculumClassAct,
  setInstAcademicsErrorAct,
  setInstAcademicYearsDateAct,
  setInstTermAct,
  setAddInstTermAct,
  setDeleteTermAct,
  setUpdateInstTermAct,
  setModulesListAct,
  setUpdateModuleAct,
  setInstSecondClassAct,
  setInstClassForBranchAct,
} from "./instacademicslice";
import { InstAcademicsConstants } from "./instacademicconstants";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getInstAcademicYearGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setInstAcademicYearAct(response.data));
  }
}
function* getInstAcademicYearsDateGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setInstAcademicYearsDateAct(response.data));
  }
}
function* addInstAcademicYearGen(action: ICreatedActionType): any {
  const { payload } = action;

  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setAddInstAcademicYearAct({ status: response.status }));
  }
}
function* updateInstAcademicYearGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setUpdateInstAcademicYearAct({ status: response.status }));
  }
}

function* deleteInstAcademicYearGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setDeleteAcademicYearAct({ status: response.status }));
  }
}

function* getInstAcademicTermGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setInstAcademicTermAct(response.data));
  }
}
function* getInstTermGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setInstTermAct(response.data));
  }
}
function* addInstAcademicTermGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setAddInstAcademicTermAct(response.data));
  }
}
function* addInstTermGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setAddInstTermAct({ status: response.status }));
  }
}
function* updateInstAcademicTermGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setUpdateInstAcademicTermAct({ status: response.status }));
  }
}
function* updateInstTermGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setUpdateInstTermAct({ status: response.status }));
  }
}

function* deleteInstAcademicTermGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setDeleteAcademicTermAct({ status: response.status }));
  }
}
function* deleteInstTermGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setDeleteTermAct({ status: response.status }));
  }
}

function* getInstCurriculumGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setInstCurriculumAct(response.data));
  }
}
function* addInstCurriculumGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setAddInstCurriculumAct(response.data));
  }
}
function* updateInstCurriculumGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setUpdateInstCurriculumAct(response.data));
  }
}

function* deleteInstCurriculumGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setDeleteCurriculumAct({ statusCode: response.status }));
  }
}

function* getInstClassGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setInstClassAct(response.data));
  }
}

function* getInstClassForBranchGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setInstClassForBranchAct(response.data));
  }
}
function* getInstSecondClassGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setInstSecondClassAct(response.data));
  }
}
function* addInstClassGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setAddInstClassAct(response.data));
  }
}
function* updateInstClassGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setUpdateInstClassAct(response.data));
  }
}

function* deleteInstClassGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setDeleteClassAct({ statusCode: response.status }));
  }
}

function* getCurriculumClassGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setCurriculumClassAct(response.data));
  }
}
function* addCurriculumClassGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setAddCurriculumClassAct({ statusCode: response.status }));
  }
}
function* updateCurriculumClassGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setUpdateCurriculumClassAct(response.data));
  }
}

function* deleteCurriculumClassGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setDeleteCurriculumClassAct({ statusCode: response.status }));
  }
}


function* getModulesListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );  
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setModulesListAct(response.data));
  }
}
function* updateModuleListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstAcademicsErrorAct(response.error));
  } else {
    yield put(setUpdateModuleAct({ statusCode: response.status }));
  }
}
export default function* instAcademicsSaga() {
  yield takeLatest(
    InstAcademicsConstants.GET_INST_ACADEMIC_YEAR_REQUEST,
    getInstAcademicYearGen
  );
  yield takeLatest(
    InstAcademicsConstants.GET_INST_ACADEMIC_YEARS_DATE_REQUEST,
    getInstAcademicYearsDateGen
  );
  yield takeLatest(
    InstAcademicsConstants.ADD_INST_ACADEMIC_YEAR_REQUEST,
    addInstAcademicYearGen
  );
  yield takeLatest(
    InstAcademicsConstants.UPDATE_INST_ACADEMIC_YEAR_REQUEST,
    updateInstAcademicYearGen
  );
  yield takeLatest(
    InstAcademicsConstants.DELETE_INST_ACADEMIC_YEAR_REQUEST,
    deleteInstAcademicYearGen
  );

  yield takeLatest(
    InstAcademicsConstants.GET_INST_ACADEMIC_TERMS_REQUEST,
    getInstAcademicTermGen
  );
  yield takeLatest(
    InstAcademicsConstants.GET_INST_TERMS_REQUEST,
    getInstTermGen
  );
  yield takeLatest(
    InstAcademicsConstants.ADD_INST_ACADEMIC_TERMS_REQUEST,
    addInstAcademicTermGen
  );
  yield takeLatest(
    InstAcademicsConstants.ADD_INST_TERMS_REQUEST,
    addInstTermGen
  );
  yield takeLatest(
    InstAcademicsConstants.UPDATE_INST_ACADEMIC_TERMS_REQUEST,
    updateInstAcademicTermGen
  );
  yield takeLatest(
    InstAcademicsConstants.UPDATE_INST_TERMS_REQUEST,
    updateInstTermGen
  );
  yield takeLatest(
    InstAcademicsConstants.DELETE_INST_ACADEMIC_TERMS_REQUEST,
    deleteInstAcademicTermGen
  );
  yield takeLatest(
    InstAcademicsConstants.DELETE_INST_TERMS_REQUEST,
    deleteInstTermGen
  );

  yield takeLatest(
    InstAcademicsConstants.GET_INST_CURRICULUM_REQUEST,
    getInstCurriculumGen
  );
  yield takeLatest(
    InstAcademicsConstants.ADD_INST_CURRICULUM_REQUEST,
    addInstCurriculumGen
  );
  yield takeLatest(
    InstAcademicsConstants.UPDATE_INST_CURRICULUM_REQUEST,
    updateInstCurriculumGen
  );
  yield takeLatest(
    InstAcademicsConstants.DELETE_INST_CURRICULUM_REQUEST,
    deleteInstCurriculumGen
  );

  yield takeLatest(
    InstAcademicsConstants.GET_INST_CLASS_REQUEST,
    getInstClassGen
  );
  yield takeLatest(
    InstAcademicsConstants.GET_INST_CLASS_FOR_BRANCH_REQUEST,
    getInstClassForBranchGen
  );
  yield takeLatest(
    InstAcademicsConstants.GET_INST_SECOND_CLASS_REQUEST,
    getInstSecondClassGen
  );
  yield takeLatest(
    InstAcademicsConstants.ADD_INST_CLASS_REQUEST,
    addInstClassGen
  );
  yield takeLatest(
    InstAcademicsConstants.UPDATE_INST_CLASS_REQUEST,
    updateInstClassGen
  );
  yield takeLatest(
    InstAcademicsConstants.DELETE_INST_CLASS_REQUEST,
    deleteInstClassGen
  );

  yield takeLatest(
    InstAcademicsConstants.GET_CURRICULUM_CLASS_REQUEST,
    getCurriculumClassGen
  );
  yield takeLatest(
    InstAcademicsConstants.ADD_CURRICULUM_CLASS_REQUEST,
    addCurriculumClassGen
  );
  yield takeLatest(
    InstAcademicsConstants.UPDATE_CURRICULUM_CLASS_REQUEST,
    updateCurriculumClassGen
  );
  yield takeLatest(
    InstAcademicsConstants.DELETE_CURRICULUM_CLASS_REQUEST,
    deleteCurriculumClassGen
  );

  yield takeLatest(
    InstAcademicsConstants.GET_MODULES_LIST_REQUEST,
    getModulesListGen
  );
  yield takeLatest(
    InstAcademicsConstants.UPDATE_MODULE_REQUEST,
    updateModuleListGen
  );
}
