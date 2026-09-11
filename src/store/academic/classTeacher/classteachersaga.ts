import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  setDeleteSubjectOfTeacherAct,
  setDeleteSubjectOfTeacherErrorAct,
  setSubjectsOfTeacherTableData,
  setSubjectsOfTeacherTableDataErrorAct,
  setSubjectToTeacherAct,
  setSubjectToTeacherErrorAct,
  updateAssignedSubjectToTeacherAct,
} from "./classteacherslice";
import { ClassTeacherConstants } from "./classteacherconstants";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* deleteSubjectOfTeacher(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setDeleteSubjectOfTeacherErrorAct(response.error));
  } else {
    yield put(setDeleteSubjectOfTeacherAct(response));
  }
}
function* getSubjectTeacherTableDetails(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setSubjectsOfTeacherTableDataErrorAct(response.error));
  } else {
    // let arr: any = [];
    // response.data.map((branch: any) => {
    //   let branchName = branch.instituteCurriculum.name;
    //   let branchId = branch.instituteCurriculum.id;
    //   arr.push({ name: branchName, id: branchId });
    // });
    yield put(setSubjectsOfTeacherTableData(response.data));
  }
}
function* setSubjectToTeacher(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setSubjectToTeacherErrorAct(response.error));
  } else {
    // let arr: any = [];
    // response.data.map((branch: any) => {
    //   let branchName = branch.instituteCurriculum.name;
    //   let branchId = branch.instituteCurriculum.id;
    //   arr.push({ name: branchName, id: branchId });
    // });
    yield put(setSubjectToTeacherAct(response));
  }
}
function* updateAssignedSubjectToTeacher(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setSubjectToTeacherErrorAct(response.error));
  } else {
    // let arr: any = [];
    // response.data.map((branch: any) => {
    //   let branchName = branch.instituteCurriculum.name;
    //   let branchId = branch.instituteCurriculum.id;
    //   arr.push({ name: branchName, id: branchId });
    // });
    yield put(updateAssignedSubjectToTeacherAct(response));
  }
}
export default function* classTeacherSaga() {
  yield takeLatest(
    ClassTeacherConstants.DELETE_SUBJECT_OF_TEACHER,
    deleteSubjectOfTeacher
  );
  yield takeLatest(
    ClassTeacherConstants.GET_SUBJECT_OF_TEACHER_TABLE_DATA,
    getSubjectTeacherTableDetails
  );
  yield takeLatest(
    ClassTeacherConstants.ASSIGN_TEACHER_TO_SUBJECT,
    setSubjectToTeacher
  );
  yield takeLatest(
    ClassTeacherConstants.UPDATE_ASSIGNED_TEACHER_TO_SUBJECT,
    updateAssignedSubjectToTeacher
  );
}
