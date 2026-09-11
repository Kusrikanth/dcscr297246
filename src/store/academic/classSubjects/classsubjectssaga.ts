import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  classSubjectErrorAct,
  deleteClassSubjectsListAct,
  setAssignedClassSubjectsListAct,
  setClassSubjectsListAct,
  setClassSubjectsListErrorAct,
  updateClassSubjectsListAct,

  setStudentAllocatedSubjectsAct,
  setAssignSubjectToStudentAct,
  setCopyPreviousSubjectAllocationAct,
  setCopyToCurrentClassAct, setCopyToCurrentSectionAct,
  setDeleteStudentSubjectAllocationAct,
  updateClassSubjectsListErrorAct,
  setAssignTeacherListAct,
  setSaveSubjectTeacherAct,
  setSaveBranchClassLanguagesAct,
  setDeleteBranchClassLanguagesAct,
} from "./classsubjectsslice";
import { ClassSubjectsConstants } from "./classsubjectsconstants";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getClassSubjects(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(setClassSubjectsListAct(response.data.data || []));
  }
}
function* getAssignedClassSubjects(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(setAssignedClassSubjectsListAct(response.data || []));
  }
}
function* updateClassSubjects(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(updateClassSubjectsListAct({ statusCode: response.status }));
  }
}
function* deleteClassSubjects(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(deleteClassSubjectsListAct({ statusCode: response.status }));
  }
}


function* getStudentAllocatedSubjectsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(setStudentAllocatedSubjectsAct(response.data));
  }
}

function* assignSubjectToStudentGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(setAssignSubjectToStudentAct(response.data));
  }
}

function* copyPreviousSubjectAllocationGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(setCopyPreviousSubjectAllocationAct(response.data));
  }
}

function* copyToCurrentClassGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(setCopyToCurrentClassAct(response.data));
  }
}

function* copyToCurrentSectionGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(setCopyToCurrentSectionAct(response.data));
  }
}
function* getAssignTeacherListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(setAssignTeacherListAct(response.data));
  }
}
function* saveSubjectTeacherGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(setSaveSubjectTeacherAct({ statusCode: response.status }));
  }
}


function* deleteStudentSubjectAllocationGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(setDeleteStudentSubjectAllocationAct({ statusCode: response.status }));
  }
}

function* saveBranchClassLanguagesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(setSaveBranchClassLanguagesAct({ statusCode: response.status }));
  }
}

function* deleteBranchClassLanguagesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(classSubjectErrorAct(response.error));
  } else {
    yield put(setDeleteBranchClassLanguagesAct({ statusCode: response.status }));
  }
}


export default function* classSubjectsSaga() {
  yield takeLatest(
    ClassSubjectsConstants.GET_CLASS_SUBJECTS_LIST,
    getClassSubjects
  );
  yield takeLatest(
    ClassSubjectsConstants.GET_ASSIGNED_CLASS_SUBJECTS_LIST,
    getAssignedClassSubjects
  );
  yield takeLatest(
    ClassSubjectsConstants.UPDATE_CLASS_SUBJECTS_LIST,
    updateClassSubjects
  );
  yield takeLatest(
    ClassSubjectsConstants.DELETE_CLASS_SUBJECTS_LIST,
    deleteClassSubjects
  );
  yield takeLatest(ClassSubjectsConstants.GET_STUDENT_ALLOCATEDSUBJECTS_REQUEST, getStudentAllocatedSubjectsGen);
  yield takeLatest(ClassSubjectsConstants.ASSIGN_SUBJECT_TOSTUDENT_REQUEST, assignSubjectToStudentGen);
  yield takeLatest(ClassSubjectsConstants.COPY_PREVIOUS_SUBJECT_ALLOCATION_REQUEST, copyPreviousSubjectAllocationGen);
  yield takeLatest(ClassSubjectsConstants.GET_COPYTO_CURRENT_CLASS_REQUEST, copyToCurrentClassGen);
  yield takeLatest(ClassSubjectsConstants.GET_COPYTO_CURRENT_SECTION_REQUEST, copyToCurrentSectionGen);
  yield takeLatest(ClassSubjectsConstants.DELETE_STUDENT_SUBJECTALLOCATION_REQUEST, deleteStudentSubjectAllocationGen);
  yield takeLatest(ClassSubjectsConstants.GET_SUBJECT_TEACHER_LIST, getAssignTeacherListGen);
  yield takeLatest(ClassSubjectsConstants.SAVE_SUBJECT_TEACHER, saveSubjectTeacherGen);
  yield takeLatest(ClassSubjectsConstants.SAVE_BRANCH_CLASS_LANGUAGES, saveBranchClassLanguagesGen);
  yield takeLatest(ClassSubjectsConstants.DELETE_BRANCH_CLASS_LANGUAGES, deleteBranchClassLanguagesGen);
}
