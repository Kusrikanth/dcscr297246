import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import {
  setLanguageDeleteAct,
  setLanguageDeleteErrorAct,
  setLanguageListAct,
  setStudentsIdcardAct,
  setUpdateStudentIdcardAct,
  setPreviewStudentIdcardAct,
  setLanguagesErrorAct,
  setLanguageListErrorAct,
} from "./languagesslice";
import { LanguagesConstants } from "./languagesconstants";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { IAssignStudentTableData } from "../../../pages/NewAcademics/AssignGroup/assignGroupTypes";
import { updateStudentIdCardAct } from "./languagesactions";

function* getLanguageList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setLanguageListErrorAct(response.error));
    yield put(setLanguageListAct([]));
  } else {
    // let arr: any = [];
    // response.data.map((student: any) => {
    //   let branchName = branch.instituteCurriculum.name;
    //   let branchId = branch.instituteCurriculum.id;
    //   arr.push({ name: branchName, id: branchId });
    // });
    yield put(setLanguageListAct(response.data.data));
  }
}
function* deleteLanguage(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setLanguageDeleteErrorAct(response.error));
  } else {
    yield put(setLanguageDeleteAct(response));
  }
}

function* studentsIdcardGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setLanguagesErrorAct(response.error));
  } else {
    yield put(setStudentsIdcardAct(response.data));
  }
}


function* updateStudentIdCardGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setLanguagesErrorAct(response.error));
  } else {
    yield put(setUpdateStudentIdcardAct({ idCardNo: response?.data }));
  }
}

function* previewStudentIdCardGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setLanguagesErrorAct(response.error));
  } else {
    yield put(setPreviewStudentIdcardAct(response?.data));
  }
}


export default function* languagesSaga() {
  yield takeLatest(LanguagesConstants.GET_LANGUAGE_LIST, getLanguageList);
  yield takeLatest(LanguagesConstants.DELETE_LANGUAGE, deleteLanguage);

  yield takeLatest(LanguagesConstants.GET_STUDENTS_IDCARD_REQUEST, studentsIdcardGen);
  yield takeLatest(LanguagesConstants.UPDATE_STUDENT_IDCARD_REQUEST, updateStudentIdCardGen);
  yield takeLatest(LanguagesConstants.PREVIEW_STUDENT_IDCARD_REQUEST, previewStudentIdCardGen);


}
