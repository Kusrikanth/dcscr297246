export interface IBranchStorageManagementListReducerState {

    //Institute Branch Storage Management
    getBranchStorageRootFoldersList: any;
    getBranchStorageFoldersFilesResp: any;
    getBranchStorageFoldersByIdList: any;
    saveBranchStorageFoldersResp: any;
    updateBranchStorageFoldersNameResp: any;
    updateBranchStorageFileNameResp: any;
    uploadBranchStorageFileNameResp: any;
    reUploadBranchStorageFileNameResp: any;
    downloadBranchStorageFilesBulkResp: any;
    downloadBranchStorageSingleFileResp: any;
    getPreviewFolderFileDetailsResp: any;
    deleteMultipleFoldersAndFilesResp: any;
    saveUserStorageManageAccessResp: any;
    getManageAccessSummaryResp: any;
    revokeManageAccessResp: any;
    getBranchStorageSuggestedFilesResp: any;
    getLoginBasedStorageAccessibleBranchesResp: any;
    getLoginBasedBranchStorageRootFoldersResp: any;
    getLoginBasedBranchStorageFoldersFilesByIdResp: any;
    getBranchStorageTrashFilesResp: any;
    restoreBranchStorageTrashFilesResp: any;
    getBranchStorageAuditsByFileResp: any;
    getBranchStorageAuditsByFileGroupsResp: any;
    
    //Dashboard
    getBranchStorageManagementDetailsResp: any;
    getBranchStorageManagementFileTypeDetailsResp: any;
    getBranchStorageManagementFileTypeCategoryDetailsResp: any;
    
    //Shared With Me
    getBranchStorageSharedWithMeFilesResp: any;
    // Favorites
    getBranchStorageFavoriteFilesResp: any;
    saveBranchStorageFavoriteFilesResp: any;

    //Restore-files
    restoreBranchStorageFileResp: any;

    //Copy Folders & Files
    copyBranchStorageFolderFilesResp: any;

    //Move Folders & Files
    moveBranchStorageFolderFilesResp: any;

    //recent files
    getBranchStorageRecentFilesResp: any;

    // Favorites
    getLoginBasedStorageFavoriteFilesResp: any;

    //recent files
    getLoginBasedStorageRecentFilesResp: any;
    
    //Trash
    getLoginBasedStorageTrashFilesResp: any;

    // Error
    branchStorageManagementErrorAct: any;

}
