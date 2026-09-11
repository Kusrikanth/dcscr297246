export interface ISettingsListReducerState {
        // LibraryDetails
        libraryBookCollectionRequestListResp: any;
        getLibraryBookCollectionListByIdResp : any;
        saveLibraryBookCollectionResp : any;
        editLibraryBookCollectionRequestResp : any;
        deleteLibraryBookCollectionResp : any;
        exportLibraryBookCollectionResp : any;
        bulkUploadLibraryBookCollectionResp : any;
        downloadStaticLibraryBookCollectionResp : any;

        //collection stats
        libraryCollectionStatsRequestListResp : any;

        //error state
        libraryBookCollectionErrorAct: any;

        //library dashboard
        getLibraryDashboardDataResp : any;
        getStockVerificationResp : any;
        getBookCirculationAnalysisResp : any;
        getLibrarySummaryResp: any;
}