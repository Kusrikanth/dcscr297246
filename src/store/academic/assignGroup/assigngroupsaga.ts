import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import {
  setAcademicDetailsAct,
  setAcademicDetailsErrorAct,
  setAcademicSubjectsListAct,
  setAcademicSubjectsListErrorAct,
  setAssignGroupErrorAct,
  setClassDetailsAct,
  setClassDetailsErrorAct,
  setGroupStudentListAct,
  setGroupStudentListErrorAct,
  setRemoveClassroomStudentsAct,
  setRemoveClassroomStudentsErrorAct,
  setStreamByIdAct,
  setStreamListAct,
  setStreamListErrorAct,
  setUnassignedGroupStudentListAct,
  setUnassignedGroupStudentListErrorAct,
  setUpdateClassroomStudentsAct,
  setUpdateClassroomStudentsErrorAct,
} from "./assigngroupslice";
import { AssignGroupConstants } from "./assigngroupconstants";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { IAssignStudentTableData } from "../../../pages/NewAcademics/AssignGroup/assignGroupTypes";

function* getGroupStudentsList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setAssignGroupErrorAct(response.error));
  } else {
    // let arr: any = [];
    // response.data.map((student: any) => {
    //   let branchName = branch.instituteCurriculum.name;
    //   let branchId = branch.instituteCurriculum.id;
    //   arr.push({ name: branchName, id: branchId });
    // });
    yield put(setGroupStudentListAct(response.data));
  }
}
function* getUnassignedGroupStudentsList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setAssignGroupErrorAct(response.error));
  } else {
    yield put(setUnassignedGroupStudentListAct(response.data));
  }
}
function* getAcademicDetails(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setAssignGroupErrorAct(response.error));
  } else {
    // let arr: any = [];
    // response.data.map((branch: any) => {
    //   let branchName = branch.instituteCurriculum.name;
    //   let branchId = branch.instituteCurriculum.id;
    //   arr.push({ name: branchName, id: branchId });
    // });
    yield put(setAcademicDetailsAct(response.data.data));
  }
}
function* getClassDetails(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );

  if (response && response.error) {
    yield put(setAssignGroupErrorAct(response.error));
  } else {
    // let arr: any = [];
    // response.data.map((branch: any) => {
    //   let branchName = branch.instituteCurriculum.name;
    //   let branchId = branch.instituteCurriculum.id;
    //   arr.push({ name: branchName, id: branchId });
    // });
    yield put(setClassDetailsAct(response.data));
  }
}
function* getStreamList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setAssignGroupErrorAct(response.error));
  } else {
    // let arr: any = [];
    // response.data.map((branch: any) => {
    //   let branchName = branch.instituteCurriculum.name;
    //   let branchId = branch.instituteCurriculum.id;
    //   arr.push({ name: branchName, id: branchId });
    // });
    yield put(setStreamListAct(response.data));
  }
}
function* getStreamById(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setAssignGroupErrorAct(response.error));
  } else {
    // let arr: any = [];
    // response.data.map((branch: any) => {
    //   let branchName = branch.instituteCurriculum.name;
    //   let branchId = branch.instituteCurriculum.id;
    //   arr.push({ name: branchName, id: branchId });
    // });
    yield put(setStreamByIdAct(response.data));
  }
}
function* getAcademicSubjects(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setAssignGroupErrorAct(response.error));
  } else {
    // let arr: any = [];
    // response.data.map((branch: any) => {
    //   let branchName = branch.instituteCurriculum.name;
    //   let branchId = branch.instituteCurriculum.id;
    //   arr.push({ name: branchName, id: branchId });
    // });
    yield put(setAcademicSubjectsListAct(response));
  }
}
function* updateGroupStudentsData(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setAssignGroupErrorAct(response.error));
  } else {
    yield put(setUpdateClassroomStudentsAct(response));
  }
}
function* removeGroupStudentsData(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setAssignGroupErrorAct(response.error));
  } else {
    yield put(setRemoveClassroomStudentsAct(response));
  }
}

export default function* assignGroupSaga() {
  yield takeLatest(
    AssignGroupConstants.GET_GROUP_STUDENTS_LIST,
    getGroupStudentsList
  );
  yield takeLatest(
    AssignGroupConstants.GET_UNASSIGNED_GROUP_STUDENTS_LIST,
    getUnassignedGroupStudentsList
  );
  yield takeLatest(
    AssignGroupConstants.ASSIGN_STUDENT_TO_GROUP,
    updateGroupStudentsData
  );
  yield takeLatest(
    AssignGroupConstants.REMOVE_STUDENT_TO_GROUP,
    removeGroupStudentsData
  );
  yield takeLatest(
    AssignGroupConstants.GET_ACADEMIC_SUBJECTS_LIST,
    getAcademicSubjects
  );
  yield takeLatest(
    AssignGroupConstants.GET_ACADEMIC_DETAILS,
    getAcademicDetails
  );
  yield takeLatest(AssignGroupConstants.GET_CLASS_DETAILS, getClassDetails);
  yield takeLatest(AssignGroupConstants.GET_STREAM_LIST, getStreamList);
  yield takeLatest(AssignGroupConstants.GET_STREAM_BY_ID, getStreamById);
}
