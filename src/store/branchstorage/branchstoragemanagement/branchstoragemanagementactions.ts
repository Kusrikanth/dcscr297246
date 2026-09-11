//Lms Settings

import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { branchstoragemanagementconstants } from "./branchstoragemanagementconstants";
export { resetPreviewFolderFileDetailsAct, resetBranchStorageFoldersByIdAct, resetUploadBranchStorageFileAct, resetManageAccessSummaryAct, resetBranchStorageManagementFileTypeDetailsAct, resetBranchStorageAuditsByFileAct, resetBranchStorageAuditsByFileGroupsAct } from "./branchstoragemanagementslice";

//Branch Storage Management
export const getBranchStorageRootFoldersAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_ROOT_FOLDERS);
export const getBranchStorageFoldersFilesByIdAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_FOLDERS_FILES_BY_ID);
export const getBranchStorageFoldersByIdAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_FOLDERS_BY_ID);
export const createBranchStorageFolderAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.CREATE_BRANCH_STORAGE_FOLDER);
export const updateBranchStorageFolderNameAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.UPDATE_BRANCH_STORAGE_FOLDER_NAME);
export const updateBranchStorageFileNameAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.UPDATE_BRANCH_STORAGE_FILE_NAME);
export const uploadBranchStorageFileAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.UPLOAD_BRANCH_STORAGE_FILE);
export const reUploadBranchStorageFileAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.REUPLOAD_BRANCH_STORAGE_FILE);
export const downloadBranchStorageFilesBulkAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.DOWNLOAD_BRANCH_STORAGE_FILES_BULK);
export const downloadBranchStorageSingleFileAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.DOWNLOAD_BRANCH_STORAGE_SIGNLE_FILE);
export const getPreviewFolderFileDetailsAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_PREVIEW_FOLDER_FILE_DETAILS);
export const deleteMultipleFoldersAndFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.DELETE_MULTIPLE_FOLDERS_AND_FILES);
export const saveUserStorageManageAccessAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.SAVE_USER_STORAGE_MANAGE_ACCESS);
export const getManageAccessSummaryAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_MANAGE_ACCESS_SUMMARY);
export const revokeManageAccessAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.REVOKE_MANAGE_ACCESS);
export const getBranchStorageSuggestedFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_SUGGESTED_FILES);
export const getBranchStorageTrashFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_TRASH_FILES);
export const restoreBranchStorageTrashFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.RESTORE_BRANCH_STORAGE_TRASH_FILES);
export const getBranchStorageAuditsByFileAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_AUDITS_BY_FILE);
export const getBranchStorageAuditsByFileGroupsAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_AUDITS_BY_FILE_GROUPS);


//Dashboard
export const getBranchStorageManagementDetailsAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_MANAGEMENT_DETAILS);
export const getBranchStorageManagementFileTypeDetailsAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_MANAGEMENT_FILE_TYPE_DETAILS);
export const getBranchStorageManagementFileTypeCatogeryDetailsAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_MANAGEMENT_FILE_TYPE_CATEGORY_DETAILS);

//Shared With Me
export const getBranchStorageSharedWithMeFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_SHARED_WITH_ME_FILES);

// Favorites
export const getBranchStorageFavoriteFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_SHARED_FAVORITE_FILES);
export const saveBranchStorageFavoriteFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.SAVE_BRANCH_STORAGE_SHARED_FAVORITE_FILES);

//restore-file
export const restoreBranchStorageFileAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.RESTORE_BRANCH_STORAGE_SHARED_FILE);

//Copy Folders & Files
export const copyBranchStorageFolderFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.COPY_BRANCH_STORAGE_FOLDER_FILES);

//Move Folders & Files
export const moveBranchStorageFolderFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.MOVE_BRANCH_STORAGE_FOLDER_FILES);

//recent files
export const getBranchStorageRecentFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_BRANCH_STORAGE_RECENT_FILES);

//Teacher-Access
//Storage-Access-files
export const getLoginBasedBranchStorageAccessibleBranchesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_LOGIN_BASED_STORAGE_ACCESSIBLE_BRANCHES);
export const getLoginBasedBranchStorageRootFoldersAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_LOGIN_BASED_BRANCH_STORAGE_ROOT_FOLDERS);
export const getLoginBasedBranchStorageFoldersFilesByIdAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_LOGIN_BASED_BRANCH_STORAGE_FOLDERS_FILES_BY_ID);

//recent files
export const getLoginBasedRecentFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_LOGIN_BASED_STORAGE_RECENT_FILES);

//Favorites
export const getLoginBasedFavoritesFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_LOGIN_BASED_STORAGE_FAVORITE_FILES);

//Trash
export const getLoginBasedTrashFilesAct = createAction<INewActionType | undefined>(branchstoragemanagementconstants.GET_LOGIN_BASED_STORAGE_TRASH_FILES);
