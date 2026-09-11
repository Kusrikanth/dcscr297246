import { call, put, takeLatest } from "redux-saga/effects";
import { branchstoragemanagementconstants } from "./branchstoragemanagementconstants";
import { setLoginBasedBranchStorageFoldersFilesByIdAct, setLoginBasedBranchStorageRootFoldersAct, setBranchStorageFavoriteFilesAct, setBranchStorageFoldersByIdAct, setBranchStorageManagementDetailsAct, setBranchStorageManagementErrorAct, setBranchStorageSuggestedFilesAct, setBranchStorageRootFoldersAct, setBranchStorageSharedWithMeFilesAct, setBranchStorageTrashFilesAct, setDeleteMultipleFoldersAndFilesAct, setDownloadBranchStorageFilesBulkAct, setDownloadBranchStorageSingleFileAct, setManageAccessSummaryAct, setPreviewFolderFileDetailsAct, setRestoreBranchStorageFileAct, setRestoreBranchStorageTrashFilesAct, setReUploadBranchStorageFileAct, setRevokeManageAccessAct, setSaveBranchStorageFavoriteFilesAct, setSaveBranchStorageFoldersAct, setSaveUserStorageManageAccessAct, setUpdateBranchStorageFileNameAct, setUpdateBranchStorageFoldersNameAct, setUploadBranchStorageFileAct, setCopyBranchStorageFolderFilesAct, setMoveBranchStorageFolderFilesAct, setBranchStorageManagementFileTypeDetailsAct, setBranchStorageFoldersFilesByIdAct, setBranchStorageRecentFilesAct, setLoginBasedStorageFavoriteFilesAct, setLoginBasedStorageRecentFilesAct, setLoginBasedStorageTrashFilesAct, setBranchStorageManagementFileTypeCategoryDetailsAct, setLoginBasedStorageAccessibleBranchesAct, setBranchStorageAuditsByFileAct, setBranchStorageAuditsByFileGroupsAct } from "./branchstoragemanagementslice";
import { ICreatedActionType } from "../../types";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";

//Institute Branch Storage Management
export function* getBranchStorageRootFoldersGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageRootFoldersAct(response.data));
  }
}

export function* getBranchStorageFoldersFilesByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageFoldersFilesByIdAct(response.data));
  }
}

export function* getBranchStorageFoldersByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageFoldersByIdAct(response.data));
  }
}

export function* saveBranchStorageFoldersGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setSaveBranchStorageFoldersAct({ status: response.status }));
  }
}

export function* updateBranchStorageFoldersNameGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setUpdateBranchStorageFoldersNameAct({ statusCode: response.status }));
  }
}

export function* updateBranchStorageFileNameGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setUpdateBranchStorageFileNameAct({ statusCode: response.status }));
  }
}

export function* uploadBranchStorageFileGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(
      setUploadBranchStorageFileAct(
        response?.data ?? response
      )
    );
  }
}

export function* reUploadBranchStorageFileGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setReUploadBranchStorageFileAct(response?.data ?? response));
  }
}

export function* downloadBranchStorageFilesBulkGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setDownloadBranchStorageFilesBulkAct(response?.data ?? response));
  }
}

export function* downloadBranchStorageSingleFileGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setDownloadBranchStorageSingleFileAct(response.data));
  }
}

export function* getPreviewFolderFileDetailsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setPreviewFolderFileDetailsAct(response.data));
  }
}

export function* deleteMultipleFoldersAndFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setDeleteMultipleFoldersAndFilesAct({ status: response.status }));
  }
}

export function* saveUserStorageManageAccessGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setSaveUserStorageManageAccessAct({ status: response.status }));
  }
}

export function* getManageAccessSummaryGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setManageAccessSummaryAct(response.data));
  }
}

export function* revokeManageAccessGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setRevokeManageAccessAct({ status: response.status }));
  }
}

export function* getBranchStorageSuggestedFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageSuggestedFilesAct(response.data));
  }
}

export function* getLoginBasedStorageAccessibleBranchesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setLoginBasedStorageAccessibleBranchesAct(response.data));
  }
}

export function* getLoginBasedBranchStorageRootFoldersGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setLoginBasedBranchStorageRootFoldersAct(response.data));
  }
}

export function* getLoginBasedBranchStorageFoldersFilesByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setLoginBasedBranchStorageFoldersFilesByIdAct(response.data));
  }
}

export function* getBranchStorageTrashFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageTrashFilesAct(response.data));
  }
}

export function* restoreBranchStorageTrashFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setRestoreBranchStorageTrashFilesAct({ status: response.status }));
  }
}

export function* getBranchStorageAuditsByFileGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageAuditsByFileAct(response.data));
  }
}

export function* getBranchStorageAuditsByFileGroupsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageAuditsByFileGroupsAct(response.data));
  }
}

//Dashboard
export function* getBranchStorageManagementDetailsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageManagementDetailsAct(response.data));
  }
}

export function* getBranchStorageManagementFileTypeDetailsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageManagementFileTypeDetailsAct(response.data));
  }
}

export function* getBranchStorageManagementFileTypeCategoryDetailsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageManagementFileTypeCategoryDetailsAct(response.data));
  }
}

//Shared With Me
export function* getBranchStorageSharedWithMeFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageSharedWithMeFilesAct(response.data));
  }
}

// Favorites
export function* getBranchStorageFavoriteFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageFavoriteFilesAct(response.data));
  }
}

export function* saveBranchStorageFavoriteFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setSaveBranchStorageFavoriteFilesAct({ status: response.status }));
  }
}

export function* restoreBranchStorageFileGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setRestoreBranchStorageFileAct({ status: response.status }));
  }
}

//Copy Folders & Files
export function* copyBranchStorageFolderFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setCopyBranchStorageFolderFilesAct({ status: response.status }));
  }
}

//Move Folders & Files
export function* moveBranchStorageFolderFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setMoveBranchStorageFolderFilesAct({ statusCode: response.status }));
  }
}

//recent files
export function* getBranchStorageRecentFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setBranchStorageRecentFilesAct(response.data));
  }
}

 // Favorites
export function* getLoginBasedStorageFavoriteFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setLoginBasedStorageFavoriteFilesAct(response.data));
  }
}

//recent files
export function* getLoginBasedStorageRecentFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setLoginBasedStorageRecentFilesAct(response.data));
  }
}

//Trash
export function* getLoginBasedStorageTrashFilesGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setBranchStorageManagementErrorAct(response.error));
  } else {
    yield put(setLoginBasedStorageTrashFilesAct(response.data));
  }
}

export default function* branchStorageManagementSaga() {

  //Institute Branch Storage Management
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_ROOT_FOLDERS, getBranchStorageRootFoldersGen);
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_FOLDERS_FILES_BY_ID, getBranchStorageFoldersFilesByIdGen);
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_FOLDERS_BY_ID, getBranchStorageFoldersByIdGen);
  yield takeLatest(branchstoragemanagementconstants.CREATE_BRANCH_STORAGE_FOLDER, saveBranchStorageFoldersGen);
  yield takeLatest(branchstoragemanagementconstants.UPDATE_BRANCH_STORAGE_FOLDER_NAME, updateBranchStorageFoldersNameGen);
  yield takeLatest(branchstoragemanagementconstants.UPDATE_BRANCH_STORAGE_FILE_NAME, updateBranchStorageFileNameGen);
  yield takeLatest(branchstoragemanagementconstants.UPLOAD_BRANCH_STORAGE_FILE, uploadBranchStorageFileGen);
  yield takeLatest(branchstoragemanagementconstants.REUPLOAD_BRANCH_STORAGE_FILE, reUploadBranchStorageFileGen);
  yield takeLatest(branchstoragemanagementconstants.DOWNLOAD_BRANCH_STORAGE_FILES_BULK, downloadBranchStorageFilesBulkGen);
  yield takeLatest(branchstoragemanagementconstants.DOWNLOAD_BRANCH_STORAGE_SIGNLE_FILE, downloadBranchStorageSingleFileGen);
  yield takeLatest(branchstoragemanagementconstants.GET_PREVIEW_FOLDER_FILE_DETAILS, getPreviewFolderFileDetailsGen);
  yield takeLatest(branchstoragemanagementconstants.DELETE_MULTIPLE_FOLDERS_AND_FILES, deleteMultipleFoldersAndFilesGen);
  yield takeLatest(branchstoragemanagementconstants.SAVE_USER_STORAGE_MANAGE_ACCESS, saveUserStorageManageAccessGen);
  yield takeLatest(branchstoragemanagementconstants.GET_MANAGE_ACCESS_SUMMARY, getManageAccessSummaryGen);
  yield takeLatest(branchstoragemanagementconstants.REVOKE_MANAGE_ACCESS, revokeManageAccessGen);
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_SUGGESTED_FILES, getBranchStorageSuggestedFilesGen);
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_TRASH_FILES, getBranchStorageTrashFilesGen);
  yield takeLatest(branchstoragemanagementconstants.RESTORE_BRANCH_STORAGE_TRASH_FILES, restoreBranchStorageTrashFilesGen);
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_AUDITS_BY_FILE, getBranchStorageAuditsByFileGen);
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_AUDITS_BY_FILE_GROUPS, getBranchStorageAuditsByFileGroupsGen);
  
  //Dashboard
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_MANAGEMENT_DETAILS, getBranchStorageManagementDetailsGen);
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_MANAGEMENT_FILE_TYPE_DETAILS, getBranchStorageManagementFileTypeDetailsGen);
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_MANAGEMENT_FILE_TYPE_CATEGORY_DETAILS, getBranchStorageManagementFileTypeCategoryDetailsGen);
  
  //Shared With Me
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_SHARED_WITH_ME_FILES, getBranchStorageSharedWithMeFilesGen);

  // Favorites
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_SHARED_FAVORITE_FILES, getBranchStorageFavoriteFilesGen);
  yield takeLatest(branchstoragemanagementconstants.SAVE_BRANCH_STORAGE_SHARED_FAVORITE_FILES, saveBranchStorageFavoriteFilesGen);

  //Restore-File
  yield takeLatest(branchstoragemanagementconstants.RESTORE_BRANCH_STORAGE_SHARED_FILE, restoreBranchStorageFileGen);

  //Copy Folders & Files
  yield takeLatest(branchstoragemanagementconstants.COPY_BRANCH_STORAGE_FOLDER_FILES, copyBranchStorageFolderFilesGen);

  //Move Folders & Files
  yield takeLatest(branchstoragemanagementconstants.MOVE_BRANCH_STORAGE_FOLDER_FILES, moveBranchStorageFolderFilesGen);

  //recent files
  yield takeLatest(branchstoragemanagementconstants.GET_BRANCH_STORAGE_RECENT_FILES, getBranchStorageRecentFilesGen);

  //Teacher-Access
  //Storage-Access-files
  yield takeLatest(branchstoragemanagementconstants.GET_LOGIN_BASED_STORAGE_ACCESSIBLE_BRANCHES, getLoginBasedStorageAccessibleBranchesGen);
  yield takeLatest(branchstoragemanagementconstants.GET_LOGIN_BASED_BRANCH_STORAGE_ROOT_FOLDERS, getLoginBasedBranchStorageRootFoldersGen);
  yield takeLatest(branchstoragemanagementconstants.GET_LOGIN_BASED_BRANCH_STORAGE_FOLDERS_FILES_BY_ID, getLoginBasedBranchStorageFoldersFilesByIdGen);

  // Favorites
  yield takeLatest(branchstoragemanagementconstants.GET_LOGIN_BASED_STORAGE_FAVORITE_FILES, getLoginBasedStorageFavoriteFilesGen);

  //recent files
  yield takeLatest(branchstoragemanagementconstants.GET_LOGIN_BASED_STORAGE_RECENT_FILES, getLoginBasedStorageRecentFilesGen);

  //Trash
  yield takeLatest(branchstoragemanagementconstants.GET_LOGIN_BASED_STORAGE_TRASH_FILES, getLoginBasedStorageTrashFilesGen);
}
