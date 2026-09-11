export interface ISettingsListReducerState {

        // LibraryDetails
        libraryBookIssuanceRequestListResp: any;
        getBookDetailByAccessionNoResp: any;
        saveLibraryBookIssuanceResp : any;
        deleteLibraryBookIssuanceResp : any;
        getBookIssuanceUserTypeListResp : any;
        getExportBookIssuanceResp : any;
        getExportBooksOverDueResp : any;

        // Borrowed Books
        getLibraryBorrowedBooksListResp : any;
        exportLibraryBorrowedBooksResp : any;

        // library book renewal
        saveLibraryBookRenewalResp : any;

        // Stats
        libraryIssuanceStatsRequestListResp : any;

        //error state
        libraryBookIssuanceErrorAct: any;
}