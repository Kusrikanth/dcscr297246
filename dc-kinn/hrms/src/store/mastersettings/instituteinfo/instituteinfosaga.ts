import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  setInstituteListAct,
  setInstituteByIdAct,
  setCreateInstituteAct,
  setUpdateInstByIdAct,
  setApprovingInstAct,
  setDeleteInstByIdAct,
  setUploadInstLogoAct,
  setInstDepartmentAct,
  setAddInstDepartmentAct,
  setUpdateInstDepartmentAct,
  setDeleteInstDepartmentAct,
  setInstMasterFieldsAct,
  setFormsAssignedToBranchAct,
  setAssignFormToBranchAct,
  setUpdateFormToBranchAct,
  setDeleteFormAssignedToBranchAct,
  setInstRoleTypeAct,
  setAddInstRoleTypeAct,
  setUpdateInstRoleTypeAct,
  setDeleteInstRoleTypeAct,
  setInstInfoErrorAct,
  setGlobalRecordDataAct,
  setAcademicLanguagesAct,
  updateAcademicLanguagesAct,
  deleteAcademicLanguagesAct,
  addAcademicLanguagesAct,
  setNumberingSeriesListByBranchIdAct,
  setInstDocumentTypeAct,
  setInstRoleTypeV2Act,
  setInstRoleV2Act,
  setAddInstRoleV2Act,
  setAddInstRoleTypeV2Act,
  setUpdateInstRoleTypeV2Act,
  setDeleteInstRoleTypeV2Act,
  setUpdateInstRoleV2Act,
  setDeleteInstRoleV2Act,
  setGetInstSubjectsByIdResp,
  setSaveInstSubjectsResp,
  setEditInstSubjectsResp
  // setBranchesAct,
} from "./instituteinfoslice";
import { InstInfoConstants } from "./instituteinfoconstants";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";

function* getInstituteListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setInstituteListAct(response.data));
  }
}
function* createInstituteGen(action: ICreatedActionType): any {
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
    yield put(setCreateInstituteAct(response.data));
  }
}

function* getInstByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setInstituteByIdAct(response.data));
  }
}
function* updateInstByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setUpdateInstByIdAct(response.data));
  }
}

function* deleteInstByIdGen(action: ICreatedActionType): any {
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
    yield put(setDeleteInstByIdAct({ statusCode: response.status }));
  }
}

function* uploadInstLogoGen(action: ICreatedActionType): any {
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
    yield put(setUploadInstLogoAct({ statusCode: response.status }));
  }
}

function* getInstDepartmentGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setInstDepartmentAct(response.data));
  }
}

function* addInstDepartmentGen(action: ICreatedActionType): any {
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
    yield put(setAddInstDepartmentAct(response.data));
  }
}

function* updateInstDepartmentGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setUpdateInstDepartmentAct(response.data));
  }
}

function* approvingInstGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setApprovingInstAct(response.data));
  }
}

function* deleteInstDepartmentGen(action: ICreatedActionType): any {
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
    yield put(
      setDeleteInstDepartmentAct(
        response.data || { statusCode: response.status }
      )
    );
  }
}

function* getInstMasterFieldsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setInstMasterFieldsAct(response.data));
  }
}

function* getFormAssignedToBranchGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setFormsAssignedToBranchAct(response.data));
  }
}

function* assignFormToBranchGen(action: ICreatedActionType): any {
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
    yield put(setAssignFormToBranchAct({ statusCode: response.status }));
  }
}

function* updateFormToBranchGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setUpdateFormToBranchAct({ statusCode: response.status }));
  }
}
function* deleteFormAssignedToBranchGen(action: ICreatedActionType): any {
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
    yield put(
      setDeleteFormAssignedToBranchAct({ statusCode: response.status })
    );
  }
}

function* getInstRoleTypeGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setInstRoleTypeAct(response.data));
  }
}
function* addInstRoleTypeGen(action: ICreatedActionType): any {
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
    yield put(setAddInstRoleTypeAct({ statusCode: response.status }));
  }
}
function* updateInstRoleTypeGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setUpdateInstRoleTypeAct(response.data));
  }
}
function* deleteInstRoleTypeGen(action: ICreatedActionType): any {
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
    yield put(setDeleteInstRoleTypeAct({ statusCode: response.status }));
  }
}

function* getInstRoleTypeV2Gen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setInstRoleTypeV2Act(response.data));
  }
}

function* addInstRoleTypeV2Gen(action: ICreatedActionType): any {
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
    yield put(setAddInstRoleTypeV2Act({statusCode : response.status}));
  }
}

function* updateInstRoleTypeV2Gen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setUpdateInstRoleTypeV2Act({statusCode : response.status}));
  }
}

function* deleteInstRoleTypeV2Gen(action: ICreatedActionType): any {
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
    yield put(setDeleteInstRoleTypeV2Act({statusCode : response.status}));
  }
}

function* getInstRoleV2Gen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setInstRoleV2Act(response.data));
  }
}

function* addInstRoleV2Gen(action: ICreatedActionType): any {
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
    yield put(setAddInstRoleV2Act({ statusCode: response.status }));
  }
}

function* updateInstRoleV2Gen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setUpdateInstRoleV2Act({ statusCode: response.status }));
  }
}

function* deleteInstRoleV2Gen(action: ICreatedActionType): any {
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
    yield put(setDeleteInstRoleV2Act({ statusCode: response.status }));
  }
}

function* getGlobalRecordGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setGlobalRecordDataAct(response.data));
  }
}
// function* getBranchesDataAct(action: ICreatedActionType): any {
//   const { payload } = action;
//   const response = yield call(
//     getData,
//     payload.endpoint,
//     payload.payload,
//     payload.optionalConfig
//   );
//   if (response && response.error) {
//     yield put(setInstInfoErrorAct(response.error));
//   } else {
//     yield put(setBranchesAct(response.data));
//   }
// }
function* getNumberingSeriesListByBranchIDAct(action: ICreatedActionType): any {
  const { payload } = action;

  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setNumberingSeriesListByBranchIdAct(response.data));
  }
}
function* getAcademicLanguageGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setAcademicLanguagesAct(response.data));
  }
}
function* addAcademicLanguageGen(action: ICreatedActionType): any {
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
    yield put(addAcademicLanguagesAct(response.data));
  }
}
function* updateAcademicLanguageGen(action: ICreatedActionType): any {
  const { payload } = action;

  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(updateAcademicLanguagesAct(response));
  }
}
function* removeAcademicLanguageGen(action: ICreatedActionType): any {
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
    yield put(deleteAcademicLanguagesAct(response));
  }
}
function* getInstDocumentTypeGen(action: ICreatedActionType): any {
  const { payload } = action;

  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setInstInfoErrorAct(response.error));
  } else {
    yield put(setInstDocumentTypeAct(response.data));
  }
}

//Inst_Subjects
    function* getInstSubjectsByIdGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setInstInfoErrorAct(response.error));
        } else {
            yield put(setGetInstSubjectsByIdResp(response.data));
        }
    }
    function* saveInstSubjectsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setInstInfoErrorAct(response.error));
        } else {
            yield put(setSaveInstSubjectsResp({statusCode: response.status}));
        }
    }
    function* editInstSubjectsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setInstInfoErrorAct(response.error));
        } else {
            yield put(setEditInstSubjectsResp({statusCode: response.status}));
        }
    }
// function* getAcademicYearGen(action: ICreatedActionType): any {
//   const { payload } = action;
//   const response = yield call(
//     getData,
//     payload.endpoint,
//     payload.payload,
//     payload.optionalConfig
//   );
//   if (response && response.error) {
//     yield put(setInstInfoErrorAct(response.error));
//   } else {
//     yield put(setNumberingSeriesAct(response.data));
//   }
// }

export default function* instituteInfoSaga() {
  yield takeLatest(
    InstInfoConstants.GET_INSTITUTE_LIST_REQUEST,
    getInstituteListGen
  );
  yield takeLatest(
    InstInfoConstants.CREATE_INSTITUTE_REQUEST,
    createInstituteGen
  );

  yield takeLatest(
    InstInfoConstants.GET_INSTITUTE_BY_ID_REQUEST,
    getInstByIdGen
  );
  yield takeLatest(
    InstInfoConstants.UPDATE_INSTITUTE_BY_ID_REQUEST,
    updateInstByIdGen
  );
  yield takeLatest(
    InstInfoConstants.APPROVING_INSTITUTE_REQUEST,
    approvingInstGen
  );
  yield takeLatest(
    InstInfoConstants.DELETE_INSTITUTE_BY_ID_REQUEST,
    deleteInstByIdGen
  );
  yield takeLatest(
    InstInfoConstants.UPLOAD_INSTITUTE_LOGO_REQUEST,
    uploadInstLogoGen
  );

  yield takeLatest(
    InstInfoConstants.GET_INST_DEPARTMENT_REQUEST,
    getInstDepartmentGen
  );
  yield takeLatest(
    InstInfoConstants.ADD_INST_DEPARTMENT_REQUEST,
    addInstDepartmentGen
  );
  yield takeLatest(
    InstInfoConstants.UPDATE_INST_DEPARTMENT_REQUEST,
    updateInstDepartmentGen
  );
  yield takeLatest(
    InstInfoConstants.DELETE_INST_DEPARTMENT_REQUEST,
    deleteInstDepartmentGen
  );

  yield takeLatest(
    InstInfoConstants.GET_INST_MASTER_FIELDS_REQUEST,
    getInstMasterFieldsGen
  );

  yield takeLatest(
    InstInfoConstants.GET_FORM_ASSIGNED_TO_BRANCH_REQUEST,
    getFormAssignedToBranchGen
  );
  yield takeLatest(
    InstInfoConstants.ASSIGN_FORM_TO_BRANCH_REQUEST,
    assignFormToBranchGen
  );
  yield takeLatest(
    InstInfoConstants.UPDATE_FORM_TO_BRANCH_REQUEST,
    updateFormToBranchGen
  );
  yield takeLatest(
    InstInfoConstants.DELETE_FORM_ASSIGNED_TO_BRANCH_REQUEST,
    deleteFormAssignedToBranchGen
  );

  yield takeLatest(
    InstInfoConstants.GET_INST_ROLE_TYPE_REQUEST,
    getInstRoleTypeGen
  );
  yield takeLatest(
    InstInfoConstants.ADD_INST_ROLE_TYPE_REQUEST,
    addInstRoleTypeGen
  );
  yield takeLatest(
    InstInfoConstants.UPDATE_INST_ROLE_TYPE_REQUEST,
    updateInstRoleTypeGen
  );
  yield takeLatest(
    InstInfoConstants.DELETE_INST_ROLE_TYPE_REQUEST,
    deleteInstRoleTypeGen
  );

  yield takeLatest(
    InstInfoConstants.GET_INST_ROLE_TYPE_V2,
    getInstRoleTypeV2Gen
  );
  yield takeLatest(
    InstInfoConstants.ADD_INST_ROLE_TYPE_V2,
    addInstRoleTypeV2Gen
  );
  yield takeLatest(
    InstInfoConstants.UPDATE_INST_ROLE_TYPE_V2,
    updateInstRoleTypeV2Gen
  );
  yield takeLatest(
    InstInfoConstants.DELETE_INST_ROLE_TYPE_V2,
    deleteInstRoleTypeV2Gen
  );

  yield takeLatest(
    InstInfoConstants.GET_INST_ROLE_V2,
    getInstRoleV2Gen
  );
  yield takeLatest(
    InstInfoConstants.ADD_INST_ROLE_V2,
    addInstRoleV2Gen
  );
  yield takeLatest(
    InstInfoConstants.UPDATE_INST_ROLE_V2,
    updateInstRoleV2Gen
  );
  yield takeLatest(
    InstInfoConstants.DELETE_INST_ROLE_V2,
    deleteInstRoleV2Gen
  );

  yield takeLatest(
    InstInfoConstants.GET_GLOBAL_RECORD_DATA,
    getGlobalRecordGen
  );
  // yield takeLatest(
  //   InstInfoConstants.GET_BRANCH_DATA,
  //   getBranchesDataAct
  // );
  yield takeLatest(
    InstInfoConstants.GET_NUMBERING_SERIES_LIST_BY_BRANCHID,
    getNumberingSeriesListByBranchIDAct
  );
  yield takeLatest(
    InstInfoConstants.GET_ACADEMIC_LANGUAGE_DATA,
    getAcademicLanguageGen
  );
  yield takeLatest(
    InstInfoConstants.ADD_ACADEMIC_LANGUAGE,
    addAcademicLanguageGen
  );
  yield takeLatest(
    InstInfoConstants.UPDATE_ACADEMIC_LANGUAGE,
    updateAcademicLanguageGen
  );
  yield takeLatest(
    InstInfoConstants.REMOVE_ACADEMIC_LANGUAGE,
    removeAcademicLanguageGen
  ); yield takeLatest(
    InstInfoConstants.GET_INSTITUTE_DOCUMENT_TYPE_REQUEST,
    getInstDocumentTypeGen
  );
  // yield takeLatest(
  //   InstInfoConstants.GET_ACADEMIC_YEAR_DATA,
  //   getAcademicYearGen
  // );

  //Inst_Subjects
  
      yield takeLatest(InstInfoConstants.ADD_INST_SUBJECTS, saveInstSubjectsGen);
      yield takeLatest(InstInfoConstants.UPDATE_INST_SUBJECTS, editInstSubjectsGen);
      yield takeLatest(InstInfoConstants.GET_INST_SUBJECTS_BY_ID, getInstSubjectsByIdGen);
}
