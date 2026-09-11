import { call, put, takeLatest } from "redux-saga/effects";
import { branchstoragesettingsconstants } from "./branchstoragesettingsconstants";
import { setBranchStorageAct, setBranchStorageByIdAct, setSaveBranchStorageAct, setUpdateBranchStorageAct, setBranchStorageSettingsErrorAct, setUpdateBranchPoliciesAct, setBranchPoliciesAct, setUserGroupsByIdAct, setDeleteUserGroupsAct, setMembersInUserGroupsAct, setSaveUserGroupsAct, setSaveMembersInUserGroupsAct, setDeleteMembersInUserGroupsAct, setUserGroupsAct, setUserAccessProfilePermissionsAct, setSaveUserAccessProfilePermissionsAct, setUserAccessProfilePermissionsByIdAct, setDeleteUserAccessProfileAct, setDeleteUserAccessProfilePermissionsAct, setFileCategoryListAct, setSavetFileCategoryAct } from "./branchstoragesettingsslice";
import { ICreatedActionType } from "../../types";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";

//Institute Branch Storage Settings
export function* getBranchStorageGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setBranchStorageAct(response.data));
  }
}

export function* getBranchStorageByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setBranchStorageByIdAct(response.data));
  }
}

export function* saveBranchStorageGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setSaveBranchStorageAct({ status: response.status }));
  }
}

export function* updateBranchStorageGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setUpdateBranchStorageAct({ statusCode: response.status }));
  }
}

//User Groups
export function* getUserGroupsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setUserGroupsAct(response.data));
  }
}

export function* saveUserGroupsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setSaveUserGroupsAct({ status: response.status }));
  }
}

export function* getUserGroupsByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setUserGroupsByIdAct(response.data));
  }
}

export function* deleteUserGroupsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setDeleteUserGroupsAct({ status: response.status }));
  }
}

//user Profile Permissions
export function* getUserAccessProfilePermissionsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setUserAccessProfilePermissionsAct(response.data));
  }
}

export function* saveUserAccessProfilePermissionsen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setSaveUserAccessProfilePermissionsAct({ status: response.status }));
  }
}

export function* getUserAccessProfilePermissionsByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setUserAccessProfilePermissionsByIdAct(response.data));
  }
}

export function* deleteUserAccessProfileGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setDeleteUserAccessProfileAct({ status: response.status }));
  }
}

export function* deleteUserAccessProfilePermissionssGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setDeleteUserAccessProfilePermissionsAct({ status: response.status }));
  }
}

//User group members
export function* getMembersInUserGroupsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setMembersInUserGroupsAct(response.data));
  }
}

export function* saveMembersInUserGroupsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setSaveMembersInUserGroupsAct({ status: response.status }));
  }
}

export function* deleteMembersInUserGroupsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setDeleteMembersInUserGroupsAct({ status: response.status }));
  }
}

//Branch Policies
export function* getBranchPoliciesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setBranchPoliciesAct(response.data));
  }
}

export function* updateBranchPoliciesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setUpdateBranchPoliciesAct({ statusCode: response.status }));
  }
}

//File Category
export function* getFileCategoryListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setFileCategoryListAct(response.data));
  }
}

export function* saveFileCategoryGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageSettingsErrorAct(response.error));
  } else {
    yield put(setSavetFileCategoryAct({ status: response.status }));
  }
}
export default function* branchStorageSettingsSaga() {

  //Institute Branch Storage Settings
  yield takeLatest(branchstoragesettingsconstants.GET_BRANCH_STORAGE, getBranchStorageGen);
  yield takeLatest(branchstoragesettingsconstants.SAVE_BRANCH_STORAGE, saveBranchStorageGen);
  yield takeLatest(branchstoragesettingsconstants.GET_BRANCH_STORAGE_BY_ID, getBranchStorageByIdGen);
  yield takeLatest(branchstoragesettingsconstants.UPDATE_BRANCH_STORAGE, updateBranchStorageGen);

  //User Groups
  yield takeLatest(branchstoragesettingsconstants.GET_USER_GROUPS_LIST, getUserGroupsGen);
  yield takeLatest(branchstoragesettingsconstants.SAVE_USER_GROUPS, saveUserGroupsGen);
  yield takeLatest(branchstoragesettingsconstants.GET_USER_GROUPS_BY_ID, getUserGroupsByIdGen);
  yield takeLatest(branchstoragesettingsconstants.DELETE_UPDATE_USER_GROUPS, deleteUserGroupsGen);

//user Profile Permissions
  yield takeLatest(branchstoragesettingsconstants.GET_USER_ACCESS_PROFILE_PERMISSIONS, getUserAccessProfilePermissionsGen);
  yield takeLatest(branchstoragesettingsconstants.SAVE_USER_ACCESS_PROFILE_PERMISSIONS, saveUserAccessProfilePermissionsen);
  yield takeLatest(branchstoragesettingsconstants.GET_USER_ACCESS_PROFILE_PERMISSIONS_BY_ID, getUserAccessProfilePermissionsByIdGen);
  yield takeLatest(branchstoragesettingsconstants.DELETE_USER_ACCESS_PROFILE, deleteUserAccessProfileGen);
  yield takeLatest(branchstoragesettingsconstants.DELETE_USER_ACCESS_PROFILE_PERMISSIONS, deleteUserAccessProfilePermissionssGen);

  //User group members
  yield takeLatest(branchstoragesettingsconstants.GET_MEMBERS_IN_USER_GROUPS, getMembersInUserGroupsGen);
  yield takeLatest(branchstoragesettingsconstants.SAVE_MEMBERS_IN_USER_GROUPS, saveMembersInUserGroupsGen);
  yield takeLatest(branchstoragesettingsconstants.DELETE_MEMBERS_IN_USER_GROUPS, deleteMembersInUserGroupsGen);

  //Branch Policies
  yield takeLatest(branchstoragesettingsconstants.GET_BRANCH_POLICIES, getBranchPoliciesGen);
  yield takeLatest(branchstoragesettingsconstants.UPDATE_BRANCH_POLICIES, updateBranchPoliciesGen);

  //File Category
  yield takeLatest(branchstoragesettingsconstants.GET_FILE_TYPE_CATEGORY_LIST, getFileCategoryListGen);
  yield takeLatest(branchstoragesettingsconstants.SAVE_FILE_TYPE_CATEGORY, saveFileCategoryGen);
}