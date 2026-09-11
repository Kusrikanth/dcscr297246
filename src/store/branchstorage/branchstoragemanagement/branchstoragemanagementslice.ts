import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBranchStorageManagementListReducerState } from "./branchstoragemanagementtypes";

const initialState: IBranchStorageManagementListReducerState = {

    //Institute Branch Storage Management
    getBranchStorageRootFoldersList: undefined,
    getBranchStorageFoldersFilesResp: undefined,
    getBranchStorageFoldersByIdList: undefined,
    saveBranchStorageFoldersResp: undefined,
    updateBranchStorageFoldersNameResp: undefined,
    updateBranchStorageFileNameResp: undefined,
    uploadBranchStorageFileNameResp: undefined,
    reUploadBranchStorageFileNameResp: undefined,
    downloadBranchStorageFilesBulkResp: undefined,
    downloadBranchStorageSingleFileResp: undefined,
    getPreviewFolderFileDetailsResp: undefined,
    deleteMultipleFoldersAndFilesResp: undefined,
    saveUserStorageManageAccessResp: undefined,
    getManageAccessSummaryResp: undefined,
    revokeManageAccessResp: undefined,
    getBranchStorageSuggestedFilesResp: undefined,
    getLoginBasedStorageAccessibleBranchesResp: undefined,
    getLoginBasedBranchStorageRootFoldersResp: undefined,
    getLoginBasedBranchStorageFoldersFilesByIdResp: undefined,
    getBranchStorageTrashFilesResp: undefined,
    restoreBranchStorageTrashFilesResp: undefined,
    getBranchStorageAuditsByFileResp: undefined,
    getBranchStorageAuditsByFileGroupsResp: undefined,
    
    //Dashboard
    getBranchStorageManagementDetailsResp: undefined,
    getBranchStorageManagementFileTypeDetailsResp: undefined,
    getBranchStorageManagementFileTypeCategoryDetailsResp: undefined,

    //Shared With Me
    getBranchStorageSharedWithMeFilesResp: undefined,

    // Favorites
    getBranchStorageFavoriteFilesResp: undefined,
    saveBranchStorageFavoriteFilesResp: undefined,

    //Restore-files
    restoreBranchStorageFileResp: undefined,

    //Copy Folders & Files
    copyBranchStorageFolderFilesResp: undefined,

    //Move Folders & Files
    moveBranchStorageFolderFilesResp: undefined,

    //recent files
    getBranchStorageRecentFilesResp: undefined,

    // Favorites
    getLoginBasedStorageFavoriteFilesResp: undefined,

    //recent files
    getLoginBasedStorageRecentFilesResp: undefined,
    
    //Trash
    getLoginBasedStorageTrashFilesResp: undefined,
    
    // Error
    branchStorageManagementErrorAct: undefined,
};

export const branchStorageManagement = createSlice({
    name: "branchStorageManagement",
    initialState,
    reducers: {

        //Institute Branch Storage Management
        setBranchStorageRootFoldersAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageRootFoldersList = action.payload;
        },
        setBranchStorageFoldersFilesByIdAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageFoldersFilesResp = action.payload;
        },
        setBranchStorageFoldersByIdAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageFoldersByIdList = action.payload;
        },
        resetBranchStorageFoldersByIdAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageFoldersByIdList = action.payload;
        },
        setSaveBranchStorageFoldersAct: (state, action: PayloadAction<any>) => {
            state.saveBranchStorageFoldersResp = action.payload;
        },
        setUpdateBranchStorageFoldersNameAct: (state, action: PayloadAction<any>) => {
            state.updateBranchStorageFoldersNameResp = action.payload;
        },
        setUpdateBranchStorageFileNameAct: (state, action: PayloadAction<any>) => {
            state.updateBranchStorageFileNameResp = action.payload;
        },
        setUploadBranchStorageFileAct: (state, action: PayloadAction<any>) => {
            state.uploadBranchStorageFileNameResp = action.payload;
        },
        setReUploadBranchStorageFileAct: (state, action: PayloadAction<any>) => {
            state.reUploadBranchStorageFileNameResp = action.payload;
        },
        resetUploadBranchStorageFileAct: (state, action: PayloadAction<any>) => {
            state.uploadBranchStorageFileNameResp = action.payload;
        },
        setDownloadBranchStorageFilesBulkAct: (state, action: PayloadAction<any>) => {
            state.downloadBranchStorageFilesBulkResp = action.payload;
        },
        setDownloadBranchStorageSingleFileAct: (state, action: PayloadAction<any>) => {
            state.downloadBranchStorageSingleFileResp = action.payload;
        },
        setPreviewFolderFileDetailsAct: (state, action: PayloadAction<any>) => {
            state.getPreviewFolderFileDetailsResp = action.payload;
        },
        resetPreviewFolderFileDetailsAct: (state, action: PayloadAction<any>) => {
            state.getPreviewFolderFileDetailsResp = action.payload;
        },
        setDeleteMultipleFoldersAndFilesAct: (state, action: PayloadAction<any>) => {
            state.deleteMultipleFoldersAndFilesResp = action.payload;
        },
        setSaveUserStorageManageAccessAct: (state, action: PayloadAction<any>) => {
            state.saveUserStorageManageAccessResp = action.payload;
        },
        setManageAccessSummaryAct: (state, action: PayloadAction<any>) => {
            state.getManageAccessSummaryResp = action.payload;
        },
        setRevokeManageAccessAct: (state, action: PayloadAction<any>) => {
            state.revokeManageAccessResp = action.payload;
        },
        setBranchStorageSuggestedFilesAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageSuggestedFilesResp = action.payload;
        },
        resetManageAccessSummaryAct: (state, action: PayloadAction<any>) => {
            state.getManageAccessSummaryResp = action.payload;
        },
        setLoginBasedBranchStorageRootFoldersAct: (state, action: PayloadAction<any>) => {
            state.getLoginBasedBranchStorageRootFoldersResp = action.payload;
        },
        setLoginBasedStorageAccessibleBranchesAct: (state, action: PayloadAction<any>) => {
            state.getLoginBasedStorageAccessibleBranchesResp = action.payload;
        },
        setLoginBasedBranchStorageFoldersFilesByIdAct: (state, action: PayloadAction<any>) => {
            state.getLoginBasedBranchStorageFoldersFilesByIdResp = action.payload;
        },
        setBranchStorageTrashFilesAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageTrashFilesResp = action.payload;
        },
        setRestoreBranchStorageTrashFilesAct: (state, action: PayloadAction<any>) => {
            state.restoreBranchStorageTrashFilesResp = action.payload;
        },
        setBranchStorageAuditsByFileAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageAuditsByFileResp = action.payload;
        },
        resetBranchStorageAuditsByFileAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageAuditsByFileResp = action.payload;
        },
        setBranchStorageAuditsByFileGroupsAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageAuditsByFileGroupsResp = action.payload;
        },
        resetBranchStorageAuditsByFileGroupsAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageAuditsByFileGroupsResp = action.payload;
        },
        setBranchStorageManagementDetailsAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageManagementDetailsResp = action.payload;
        },
        setBranchStorageManagementFileTypeDetailsAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageManagementFileTypeDetailsResp = action.payload;
        },
        setBranchStorageManagementFileTypeCategoryDetailsAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageManagementFileTypeCategoryDetailsResp = action.payload;
        },
        resetBranchStorageManagementFileTypeDetailsAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageManagementFileTypeDetailsResp = action.payload;
        },
        setBranchStorageSharedWithMeFilesAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageSharedWithMeFilesResp = action.payload;
        },
        // Favorites
        setBranchStorageFavoriteFilesAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageFavoriteFilesResp = action.payload;
        },
        setSaveBranchStorageFavoriteFilesAct: (state, action: PayloadAction<any>) => {
            state.saveBranchStorageFavoriteFilesResp = action.payload;
        },
        setRestoreBranchStorageFileAct: (state, action: PayloadAction<any>) => {
            state.restoreBranchStorageFileResp = action.payload;
        },

        //Copy Folders & Files
        setCopyBranchStorageFolderFilesAct: (state, action: PayloadAction<any>) => {
            state.copyBranchStorageFolderFilesResp = action.payload;
        },

        //Move Folders & Files
        setMoveBranchStorageFolderFilesAct: (state, action: PayloadAction<any>) => {
            state.moveBranchStorageFolderFilesResp = action.payload;
        },

        //recent files
        setBranchStorageRecentFilesAct: (state, action: PayloadAction<any>) => {
            state.getBranchStorageRecentFilesResp = action.payload;
        },

        // Favorites
        setLoginBasedStorageFavoriteFilesAct: (state, action: PayloadAction<any>) => {
            state.getLoginBasedStorageFavoriteFilesResp = action.payload;
        },

        //recent files
        setLoginBasedStorageRecentFilesAct: (state, action: PayloadAction<any>) => {
            state.getLoginBasedStorageRecentFilesResp = action.payload;
        },

        //Trash
        setLoginBasedStorageTrashFilesAct: (state, action: PayloadAction<any>) => {
            state.getLoginBasedStorageTrashFilesResp = action.payload;
        },

        // Error
        setBranchStorageManagementErrorAct: (state, action: PayloadAction<any>) => {
            state.branchStorageManagementErrorAct = action.payload;
        },
    },
});

export const {

    //Institute Branch Storage Management
    setBranchStorageRootFoldersAct,
    setBranchStorageFoldersFilesByIdAct,
    setBranchStorageFoldersByIdAct,
    resetBranchStorageFoldersByIdAct,
    setSaveBranchStorageFoldersAct,
    setUpdateBranchStorageFoldersNameAct,
    setUpdateBranchStorageFileNameAct,
    setUploadBranchStorageFileAct,
    setReUploadBranchStorageFileAct,
    resetUploadBranchStorageFileAct,
    setDownloadBranchStorageFilesBulkAct,
    setDownloadBranchStorageSingleFileAct,
    setPreviewFolderFileDetailsAct,
    resetPreviewFolderFileDetailsAct,
    setDeleteMultipleFoldersAndFilesAct,
    setSaveUserStorageManageAccessAct,
    setManageAccessSummaryAct,
    setRevokeManageAccessAct,
    setBranchStorageSuggestedFilesAct,
    resetManageAccessSummaryAct,
    setLoginBasedStorageAccessibleBranchesAct,
    setLoginBasedBranchStorageRootFoldersAct,
    setLoginBasedBranchStorageFoldersFilesByIdAct,
    setBranchStorageTrashFilesAct,
    setRestoreBranchStorageTrashFilesAct,
    setBranchStorageAuditsByFileAct,
    setBranchStorageAuditsByFileGroupsAct,
    setBranchStorageManagementDetailsAct,
    setBranchStorageManagementFileTypeDetailsAct,
    setBranchStorageManagementFileTypeCategoryDetailsAct,
    resetBranchStorageManagementFileTypeDetailsAct,
    resetBranchStorageAuditsByFileAct, 
    resetBranchStorageAuditsByFileGroupsAct,
    //Shared With Me
    setBranchStorageSharedWithMeFilesAct,
    // Favorites
    setBranchStorageFavoriteFilesAct,
    setSaveBranchStorageFavoriteFilesAct,

    //Restore-Files
    setRestoreBranchStorageFileAct,

    //Copy Folders & Files
    setCopyBranchStorageFolderFilesAct,

    //Move Folders & Files
    setMoveBranchStorageFolderFilesAct,

    //recent files
    setBranchStorageRecentFilesAct,

    // Favorites
    setLoginBasedStorageFavoriteFilesAct,

    //recent files
    setLoginBasedStorageRecentFilesAct,

    //Trash
    setLoginBasedStorageTrashFilesAct,

    // Error
    setBranchStorageManagementErrorAct,
} = branchStorageManagement.actions;

export default branchStorageManagement.reducer;
